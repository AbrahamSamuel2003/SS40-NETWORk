import 'server-only';
import nodemailer from 'nodemailer';

export type LeadAcknowledgementInput = {
    fullName: string;
    email: string;
};

export type AdminLeadNotificationInput = {
    fullName: string;
    email?: string | null;
    phone?: string | null;
    company?: string | null;
    serviceInterest?: string | null;
    message?: string | null;
    source?: string | null;
    sourcePage?: string | null;
    submittedAt?: Date | string;
};

const requiredSmtpKeys = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM'] as const;

const getSmtpConfig = () => {
    const missingKeys = requiredSmtpKeys.filter((key) => !process.env[key]);
    if (missingKeys.length > 0) {
        return { config: null, missingKeys };
    }

    const port = Number(process.env.SMTP_PORT);
    if (!Number.isInteger(port) || port <= 0) {
        return { config: null, missingKeys: ['SMTP_PORT'] };
    }

    return {
        config: {
            host: process.env.SMTP_HOST as string,
            port,
            secure: port === 465,
            auth: {
                user: process.env.SMTP_USER as string,
                pass: process.env.SMTP_PASS as string,
            },
            from: process.env.SMTP_FROM as string,
        },
        missingKeys: [],
    };
};

/**
 * Sends an instant acknowledgement email to the user upon submitting their enquiry.
 */
export async function sendLeadAcknowledgementEmail({ fullName, email }: LeadAcknowledgementInput) {
    const { config, missingKeys } = getSmtpConfig();

    if (!config) {
        console.error('Lead acknowledgement email skipped: missing or invalid SMTP configuration', { missingKeys });
        return;
    }

    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: config.auth,
    });

    const text = [
        `Dear ${fullName},`,
        '',
        'Thank you for contacting SS40 NETWORK. We have successfully received your inquiry.',
        'Our solutions engineering team is currently reviewing your details and will connect with you shortly.',
        '',
        'In the meantime, feel free to explore our Three Specialized Wings:',
        '- SS40 Digital Solutions: Custom software, web & mobile applications',
        '- SS40 Products: ClearInvoice (automated GST billing), SS40 AI Email Agent, GTC Suite',
        '- SS40 Academics: Practical software engineering internships and DSA placement prep',
        '',
        'Website: https://ss40network.com',
        'Official Support: support@ss40network.com',
        '',
        'Best regards,',
        'SS40 NETWORK PRIVATE LIMITED',
        'Tirunelveli, Tamil Nadu, India',
    ].join('\n');

    const html = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>We received your inquiry — SS40 NETWORK</title>
    </head>
    <body style="margin: 0; padding: 24px 12px; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
            <!-- Corporate Header -->
            <tr>
                <td style="background-color: #0F766E; background: linear-gradient(135deg, #0F766E 0%, #0D6E66 60%, #0A5751 100%); padding: 28px 26px 24px 26px; text-align: left;">
                    <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.12em; color: #99F6E4; text-transform: uppercase; margin-bottom: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        SS40 NETWORK &bull; CLIENT ACKNOWLEDGEMENT
                    </div>
                    <h1 style="margin: 0 0 6px 0; color: #FFFFFF; font-size: 21px; font-weight: 700; line-height: 1.25; letter-spacing: -0.01em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        Inquiry Received
                    </h1>
                    <p style="margin: 0; color: #CCFBF1; font-size: 13px; font-weight: 400; line-height: 1.4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        Thank you for connecting with us. Our solutions team will follow up promptly.
                    </p>
                </td>
            </tr>

            <!-- Message Body -->
            <tr>
                <td style="padding: 28px 26px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1E293B;">
                    <p style="font-size: 15px; font-weight: 600; color: #0F172A; margin: 0 0 14px 0;">
                        Dear ${escapeHtml(fullName)},
                    </p>
                    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 16px 0;">
                        Thank you for reaching out to <strong>SS40 NETWORK</strong>. We have securely recorded your inquiry. A member of our solutions engineering team will review your requirements and connect with you shortly.
                    </p>
                    <p style="font-size: 14px; line-height: 1.6; color: #334155; margin: 0 0 20px 0;">
                        In the meantime, feel free to explore our specialized wings:
                    </p>

                    <!-- Three Wings Quick Links -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin-bottom: 24px;">
                        <tr>
                            <td style="padding: 10px 14px; background-color: #F0FDF4; border: 1px solid #DCFCE7; border-radius: 8px; margin-bottom: 8px;">
                                <a href="https://ss40network.com/digital-solutions" style="color: #0F766E; text-decoration: none; font-size: 13px; font-weight: 700; display: block;">
                                    1. SS40 Digital Solutions &rarr;
                                    <span style="display: block; font-size: 11.5px; font-weight: 400; color: #475569; margin-top: 2px;">
                                        Custom software, web & mobile applications, AI and cloud systems
                                    </span>
                                </a>
                            </td>
                        </tr>
                        <tr><td style="height: 8px;"></td></tr>
                        <tr>
                            <td style="padding: 10px 14px; background-color: #F5F3FF; border: 1px solid #EDE9FE; border-radius: 8px;">
                                <a href="https://ss40network.com/products" style="color: #6B21A8; text-decoration: none; font-size: 13px; font-weight: 700; display: block;">
                                    2. SS40 Products (ClearInvoice) &rarr;
                                    <span style="display: block; font-size: 11.5px; font-weight: 400; color: #475569; margin-top: 2px;">
                                        Automated GST billing, AI email automation, and business platforms
                                    </span>
                                </a>
                            </td>
                        </tr>
                        <tr><td style="height: 8px;"></td></tr>
                        <tr>
                            <td style="padding: 10px 14px; background-color: #EFF6FF; border: 1px solid #DBEAFE; border-radius: 8px;">
                                <a href="https://ss40network.com/academics" style="color: #1D4ED8; text-decoration: none; font-size: 13px; font-weight: 700; display: block;">
                                    3. SS40 Academics &rarr;
                                    <span style="display: block; font-size: 11.5px; font-weight: 400; color: #475569; margin-top: 2px;">
                                        Practical software engineering internships, DSA placement prep
                                    </span>
                                </a>
                            </td>
                        </tr>
                    </table>

                    <p style="font-size: 13px; line-height: 1.5; color: #64748B; margin: 0;">
                        Best regards,<br />
                        <strong style="color: #0F172A;">Client Solutions &amp; Engineering Team</strong><br />
                        SS40 NETWORK PRIVATE LIMITED
                    </p>
                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td style="background-color: #F8FAFC; padding: 18px 24px; font-size: 12px; color: #94A3B8; text-align: center; border-top: 1px solid #F1F5F9; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <div style="font-weight: 600; color: #64748B; margin-bottom: 4px;">
                        &copy; ${new Date().getFullYear()} SS40 NETWORK PRIVATE LIMITED
                    </div>
                    <div style="font-size: 11.5px; color: #64748B;">
                        Municipal Corporation Incubation Centre, Sree Puram, Tirunelveli &bull; support@ss40network.com
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    await transporter.sendMail({
        from: config.from,
        to: email,
        subject: 'We received your enquiry — SS40 NETWORK',
        text,
        html,
    });
}

// In-memory lead notification cooldown cache to prevent spam/duplicate triggers (10 minutes)
const recentLeadNotifications = new Map<string, number>();
const LEAD_NOTIFICATION_COOLDOWN_MS = 10 * 60 * 1000;

/**
 * Sends an instant admin notification email to support@ss40network.com whenever a new lead is captured.
 */
function formatLeadSource(source?: string | null): string {
    if (!source) return 'Website Direct';
    const clean = source.trim().toUpperCase();
    if (clean === 'SS40_SKY_CHATBOT') return 'SS40 SKY Assistant (Chatbot)';
    if (clean === 'CONTACT_FORM') return 'Website Contact Form';
    if (clean === 'DIGITAL_SOLUTIONS_PAGE') return 'Digital Solutions Page';
    if (clean === 'PRODUCTS_PAGE') return 'Products Page';
    if (clean === 'ACADEMICS_PAGE') return 'Academics Page';
    return source.replace(/_/g, ' ');
}

/**
 * Sends an instant admin notification email to support@ss40network.com whenever a new lead is captured.
 */
export async function sendAdminNewLeadNotificationEmail(lead: AdminLeadNotificationInput) {
    const { config, missingKeys } = getSmtpConfig();

    if (!config) {
        console.error('Admin lead notification email skipped: missing or invalid SMTP configuration', { missingKeys });
        return;
    }

    // Deduplication check: prevent multiple duplicate emails for the same contact within cooldown window
    const identifier = (lead.phone?.trim() || lead.email?.trim() || lead.fullName?.trim() || '').toLowerCase();
    if (identifier && identifier !== 'not provided' && identifier !== 'chat visitor') {
        const lastSent = recentLeadNotifications.get(identifier);
        if (lastSent && Date.now() - lastSent < LEAD_NOTIFICATION_COOLDOWN_MS) {
            console.log(`[Mail] Duplicate admin lead notification suppressed for '${identifier}' (sent ${Math.round((Date.now() - lastSent) / 1000)}s ago)`);
            return;
        }
        recentLeadNotifications.set(identifier, Date.now());
    }

    const adminRecipient = process.env.ADMIN_NOTIFICATION_EMAIL || 'support@ss40network.com';

    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: config.auth,
    });

    const leadName = lead.fullName?.trim() || 'Chat Visitor';
    const leadPhone = lead.phone?.trim() || 'Not provided';
    const leadEmail = lead.email?.trim() || 'Not provided';
    const leadCompany = lead.company?.trim() || 'Not Specified';
    const leadInterest = lead.serviceInterest?.trim() || 'General Inquiry';
    const leadSource = lead.source?.trim() || 'SS40_SKY_CHATBOT';
    const leadMessage = lead.message?.trim() || 'Inquiry captured via SS40 SKY AI Assistant.';
    const formattedDate = lead.submittedAt
        ? new Date(lead.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const sourceTag = leadSource === 'SS40_SKY_CHATBOT' ? 'SS40 SKY' : 'Website Form';
    const subject = `[New Lead Alert] ${leadName} — ${leadInterest} (${sourceTag})`;

    const text = [
        `NEW LEAD NOTIFICATION — SS40 NETWORK`,
        `====================================`,
        `Name:             ${leadName}`,
        `Phone:            ${leadPhone}`,
        `Email:            ${leadEmail}`,
        `Company:          ${leadCompany}`,
        `Area of Interest: ${leadInterest}`,
        `Lead Source:      ${formatLeadSource(leadSource)}`,
        `Submitted Date:   ${formattedDate}`,
        ``,
        `Project Brief / Message:`,
        `------------------------`,
        `${leadMessage}`,
        ``,
        `Admin Panel: https://ss40network.com/admin/leads`,
        `====================================`,
    ].join('\n');

    // Bulletproof HTML Email Template with 100% Inlined Styles for Gmail, Apple Mail, Outlook
    const html = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Lead Alert - SS40 NETWORK</title>
    </head>
    <body style="margin: 0; padding: 24px 12px; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 0 auto; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
            <!-- Corporate Header -->
            <tr>
                <td style="background-color: #0F766E; background: linear-gradient(135deg, #0F766E 0%, #0D6E66 60%, #0A5751 100%); padding: 28px 26px 24px 26px; text-align: left;">
                    <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.12em; color: #99F6E4; text-transform: uppercase; margin-bottom: 6px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        SS40 NETWORK &bull; PIPELINE ALERT
                    </div>
                    <h1 style="margin: 0 0 6px 0; color: #FFFFFF; font-size: 21px; font-weight: 700; line-height: 1.25; letter-spacing: -0.01em; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        New Lead Generated
                    </h1>
                    <p style="margin: 0; color: #CCFBF1; font-size: 13px; font-weight: 400; line-height: 1.4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        Instant verified inquiry captured via official digital channels.
                    </p>
                    <div style="padding-top: 14px;">
                        <span style="display: inline-block; background-color: #CCFBF1; color: #0F766E; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            ${escapeHtml(leadInterest)}
                        </span>
                    </div>
                </td>
            </tr>

            <!-- Lead Details Table with Explicit Column Widths and Inlined Styles -->
            <tr>
                <td style="padding: 26px 26px 20px 26px;">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                        <!-- Full Name -->
                        <tr>
                            <td width="135" style="width: 135px; min-width: 135px; padding: 11px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; font-size: 13px; font-weight: 600; vertical-align: top; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                Full Name
                            </td>
                            <td style="padding: 11px 0 11px 16px; border-bottom: 1px solid #F1F5F9; color: #0F172A; font-size: 14.5px; font-weight: 700; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                ${escapeHtml(leadName)}
                            </td>
                        </tr>

                        <!-- Phone Number -->
                        <tr>
                            <td width="135" style="width: 135px; min-width: 135px; padding: 11px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; font-size: 13px; font-weight: 600; vertical-align: top; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                Phone Number
                            </td>
                            <td style="padding: 11px 0 11px 16px; border-bottom: 1px solid #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                ${leadPhone !== 'Not provided' ? `
                                    <a href="tel:${escapeHtml(leadPhone)}" style="color: #0F766E; text-decoration: none; font-size: 14.5px; font-weight: 700;">
                                        ${escapeHtml(leadPhone)} &rarr;
                                    </a>
                                ` : `
                                    <span style="color: #94A3B8; font-size: 13px; font-weight: 500;">Not provided</span>
                                `}
                            </td>
                        </tr>

                        <!-- Email Address -->
                        <tr>
                            <td width="135" style="width: 135px; min-width: 135px; padding: 11px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; font-size: 13px; font-weight: 600; vertical-align: top; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                Email Address
                            </td>
                            <td style="padding: 11px 0 11px 16px; border-bottom: 1px solid #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                ${leadEmail !== 'Not provided' ? `
                                    <a href="mailto:${escapeHtml(leadEmail)}" style="color: #0F766E; text-decoration: none; font-size: 14px; font-weight: 600; word-break: break-all;">
                                        ${escapeHtml(leadEmail)}
                                    </a>
                                ` : `
                                    <span style="color: #94A3B8; font-size: 13px; font-weight: 500;">Not provided</span>
                                `}
                            </td>
                        </tr>

                        <!-- Company / Org -->
                        <tr>
                            <td width="135" style="width: 135px; min-width: 135px; padding: 11px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; font-size: 13px; font-weight: 600; vertical-align: top; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                Company / Org
                            </td>
                            <td style="padding: 11px 0 11px 16px; border-bottom: 1px solid #F1F5F9; color: #334155; font-size: 13.5px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                ${escapeHtml(leadCompany)}
                            </td>
                        </tr>

                        <!-- Area of Interest -->
                        <tr>
                            <td width="135" style="width: 135px; min-width: 135px; padding: 11px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; font-size: 13px; font-weight: 600; vertical-align: top; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                Area of Interest
                            </td>
                            <td style="padding: 11px 0 11px 16px; border-bottom: 1px solid #F1F5F9; color: #0F172A; font-size: 14px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                ${escapeHtml(leadInterest)}
                            </td>
                        </tr>

                        <!-- Lead Source -->
                        <tr>
                            <td width="135" style="width: 135px; min-width: 135px; padding: 11px 0; border-bottom: 1px solid #F1F5F9; color: #64748B; font-size: 13px; font-weight: 600; vertical-align: top; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                Lead Source
                            </td>
                            <td style="padding: 11px 0 11px 16px; border-bottom: 1px solid #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                <span style="display: inline-block; background-color: #F1F5F9; color: #334155; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 6px; border: 1px solid #E2E8F0;">
                                    ${escapeHtml(formatLeadSource(leadSource))}
                                </span>
                            </td>
                        </tr>

                        <!-- Submitted Date -->
                        <tr>
                            <td width="135" style="width: 135px; min-width: 135px; padding: 11px 0; color: #64748B; font-size: 13px; font-weight: 600; vertical-align: top; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                Submitted Date
                            </td>
                            <td style="padding: 11px 0 11px 16px; color: #64748B; font-size: 13px; font-weight: 400; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                ${escapeHtml(formattedDate)}
                            </td>
                        </tr>
                    </table>

                    <!-- Project Brief / Inquiry Details Box (Sans-serif, Elegant Card) -->
                    <div style="margin-top: 22px; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 10px; padding: 16px 18px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        <div style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">
                            Project Brief / Inquiry Details
                        </div>
                        <div style="font-size: 13.5px; line-height: 1.6; color: #1E293B; white-space: pre-wrap;">
                            ${escapeHtml(leadMessage)}
                        </div>
                    </div>

                    <!-- Direct Action CTAs -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 24px;">
                        <tr>
                            <td align="center">
                                <a href="https://ss40network.com/admin/leads" style="display: block; width: 100%; box-sizing: border-box; background-color: #0F766E; color: #FFFFFF !important; text-decoration: none; padding: 13px 24px; font-size: 14px; font-weight: 700; border-radius: 8px; text-align: center; letter-spacing: 0.01em; box-shadow: 0 2px 8px rgba(15, 118, 110, 0.25); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                    Open Admin Lead Pipeline &rarr;
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>

            <!-- Professional Corporate Footer -->
            <tr>
                <td style="background-color: #F8FAFC; padding: 18px 24px; font-size: 12px; color: #94A3B8; text-align: center; border-top: 1px solid #F1F5F9; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                    <div style="font-weight: 600; color: #64748B; margin-bottom: 4px;">
                        &copy; ${new Date().getFullYear()} SS40 NETWORK PRIVATE LIMITED
                    </div>
                    <div style="font-size: 11.5px; color: #64748B;">
                        Municipal Corporation Incubation Centre, Sree Puram, Tirunelveli &bull; support@ss40network.com
                    </div>
                    <div style="font-size: 10.5px; color: #94A3B8; margin-top: 6px;">
                        Confidential operational dispatch &bull; Generated by SS40 SKY AI Assistant
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    await transporter.sendMail({
        from: config.from,
        to: adminRecipient,
        subject,
        text,
        html,
    });
}

function escapeHtml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
