import 'server-only';
import { getApps, initializeApp, cert, type App } from 'firebase-admin/app';
import { getMessaging, type Messaging } from 'firebase-admin/messaging';

let cachedApp: App | null = null;
let warnedMissingCredentials = false;

function getFirebaseAdminApp(): App | null {
    if (cachedApp) return cachedApp;

    const existingApps = getApps();
    if (existingApps.length > 0) {
        cachedApp = existingApps[0];
        return cachedApp;
    }

    const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim();
    const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !rawPrivateKey) {
        if (!warnedMissingCredentials) {
            warnedMissingCredentials = true;
            console.warn(
                '[Firebase Admin] Push notifications disabled: missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY.'
            );
        }
        return null;
    }

    // Handle whitespace, escaped newlines, and accidental wrapping quotes from env panels
    const privateKey = rawPrivateKey
        .trim()
        .replace(/^["']|["']$/g, '')
        .replace(/\\n/g, '\n');

    cachedApp = initializeApp({
        credential: cert({
            projectId,
            clientEmail,
            privateKey,
        }),
    });

    return cachedApp;
}

export function getFirebaseMessaging(): Messaging | null {
    const app = getFirebaseAdminApp();
    if (!app) return null;
    return getMessaging(app);
}

