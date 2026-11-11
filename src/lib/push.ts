import 'server-only';
import type { Messaging } from 'firebase-admin/messaging';
import { prisma } from './prisma';
import { getFirebaseMessaging } from './firebase-admin';

export type AdminPushPayload = {
    title: string;
    body: string;
    route: string;
    type: string;
    data?: Record<string, string>;
};

const INVALID_TARGET_CODES = new Set([
    'messaging/registration-token-not-registered',
    'messaging/invalid-registration-token',
    'messaging/installation-id-not-registered',
]);

async function dispatchMulticastTargets(
    messaging: Messaging,
    targets: string[],
    mode: 'fids' | 'tokens',
    basePayload: {
        notification: { title: string; body: string };
        data: Record<string, string>;
        android: {
            priority: 'high';
            ttl: number;
            notification: {
                channelId: string;
                priority: 'max';
                visibility: 'public';
                defaultSound: boolean;
                defaultVibrateTimings: boolean;
                defaultLightSettings: boolean;
            };
        };
    }
): Promise<string[]> {
    const invalidTargets: string[] = [];

    for (let i = 0; i < targets.length; i += 500) {
        const chunk = targets.slice(i, i + 500);
        const result =
            mode === 'fids'
                ? await messaging.sendEachForMulticast({ ...basePayload, fids: chunk })
                : await messaging.sendEachForMulticast({ ...basePayload, tokens: chunk });

        result.responses.forEach((resp, idx) => {
            if (resp.success || !resp.error) return;
            if (INVALID_TARGET_CODES.has(resp.error.code)) {
                invalidTargets.push(chunk[idx]);
            } else {
                console.error(
                    `Push delivery failure (${mode}):`,
                    resp.error.code,
                    resp.error.message
                );
            }
        });
    }

    return invalidTargets;
}

export async function sendPushToAllAdmins(payload: AdminPushPayload): Promise<void> {
    const messaging = getFirebaseMessaging();
    if (!messaging) {
        return;
    }

    try {
        const records = await prisma.adminDeviceToken.findMany({
            where: {
                adminUser: {
                    isActive: true,
                },
            },
            select: { token: true },
        });

        const allTargets = Array.from(new Set(records.map((r) => r.token).filter(Boolean)));
        if (allTargets.length === 0) {
            return;
        }

        const stringData: Record<string, string> = {
            ...(payload.data || {}),
            route: payload.route,
            type: payload.type,
            title: payload.title,
            body: payload.body,
        };

        const basePayload = {
            notification: {
                title: payload.title,
                body: payload.body,
            },
            data: stringData,
            android: {
                priority: 'high' as const,
                ttl: 3600 * 1000,
                notification: {
                    channelId: 'ss40_admin_alerts_v2',
                    priority: 'max' as const,
                    visibility: 'public' as const,
                    defaultSound: true,
                    defaultVibrateTimings: true,
                    defaultLightSettings: true,
                },
            },
        };

        // Separate modern Firebase Installation IDs (FIDs, no ':') from legacy registration tokens (contain ':')
        const fids = allTargets.filter((t) => !t.includes(':'));
        const legacyTokens = allTargets.filter((t) => t.includes(':'));

        const invalidTargets = [
            ...(fids.length > 0
                ? await dispatchMulticastTargets(messaging, fids, 'fids', basePayload)
                : []),
            ...(legacyTokens.length > 0
                ? await dispatchMulticastTargets(messaging, legacyTokens, 'tokens', basePayload)
                : []),
        ];

        if (invalidTargets.length > 0) {
            await prisma.adminDeviceToken.deleteMany({
                where: {
                    token: { in: invalidTargets },
                },
            });
        }
    } catch (error) {
        console.error('Failed to send admin push notification:', error);
    }
}
