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
        'Thank you for contacting SS40 NETWORK. We have successfully received your message and our team will review your enquiry. We will get back to you soon.',
        '',
        'Regards,',
        'SS40 NETWORK PRIVATE LIMITED',
    ].join('\n');

    const html = `
        <p>Dear ${escapeHtml(fullName)},</p>
        <p>Thank you for contacting SS40 NETWORK. We have successfully received your message and our team will review your enquiry. We will get back to you soon.</p>
        <p>Regards,<br />SS40 NETWORK PRIVATE LIMITED</p>
    `;

    await transporter.sendMail({
        from: config.from,
        to: email,
        subject: 'We received your enquiry — SS40 NETWORK',
        text,
        html,
    });
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
    const leadMessage = lead.message?.trim() || 'Inquiry captured via SS40 NETWORK website.';
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
        `Lead Source:      ${leadSource}`,
        `Submitted Date:   ${formattedDate}`,
        ``,
        `Project Brief / Message:`,
        `------------------------`,
        `${leadMessage}`,
        ``,
        `Admin Panel: https://ss40network.com/admin/leads`,
        `====================================`,
    ].join('\n');

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; color: #1e293b; }
            .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
            .header { background: linear-gradient(135deg, #0F766E 0%, #0D6E66 50%, #0A5751 100%); color: #ffffff; padding: 22px 24px; }
            .header h1 { margin: 0 0 4px; font-size: 19px; font-weight: 700; letter-spacing: -0.02em; }
            .header p { margin: 0; font-size: 13px; color: #ccfbf1; }
            .badge { display: inline-block; padding: 4px 10px; font-size: 12px; font-weight: 600; border-radius: 20px; background: #ccfbf1; color: #0f766e; margin-top: 10px; }
            .content { padding: 24px; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 9px 0; }
            .field-label { width: 130px; font-size: 13px; font-weight: 600; color: #64748b; vertical-align: top; }
            .field-value { font-size: 14px; font-weight: 600; color: #0f172a; word-break: break-word; }
            .highlight-phone { color: #0F766E; font-weight: 700; }
            .message-box { margin-top: 18px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; }
            .message-box h3 { margin: 0 0 8px; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em; }
            .message-text { font-size: 13px; line-height: 1.55; color: #334155; white-space: pre-wrap; margin: 0; font-family: monospace; }
            .cta-button { display: inline-block; margin-top: 20px; background: #0F766E; color: #ffffff !important; text-decoration: none; padding: 11px 22px; font-size: 13px; font-weight: 600; border-radius: 8px; text-align: center; }
            .footer { background: #f8fafc; padding: 14px 24px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>New Lead Generated</h1>
                <p>SS40 NETWORK Instant Pipeline Alert</p>
                <div class="badge">${escapeHtml(leadInterest)}</div>
            </div>
            <div class="content">
                <table>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td class="field-label">Full Name</td>
                        <td class="field-value">${escapeHtml(leadName)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td class="field-label">Phone</td>
                        <td class="field-value highlight-phone">${escapeHtml(leadPhone)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td class="field-label">Email</td>
                        <td class="field-value">${escapeHtml(leadEmail)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td class="field-label">Company / Org</td>
                        <td class="field-value" style="font-weight: 500;">${escapeHtml(leadCompany)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td class="field-label">Area of Interest</td>
                        <td class="field-value">${escapeHtml(leadInterest)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td class="field-label">Lead Source</td>
                        <td class="field-value" style="font-weight: 500; color: #475569;">${escapeHtml(leadSource)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td class="field-label">Submitted Date</td>
                        <td class="field-value" style="font-weight: 400; color: #64748b; font-size: 13px;">${escapeHtml(formattedDate)}</td>
                    </tr>
                </table>

                <div class="message-box">
                    <h3>Project Brief / Inquiry Details</h3>
                    <p class="message-text">${escapeHtml(leadMessage)}</p>
                </div>

                <div style="text-align: center;">
                    <a href="https://ss40network.com/admin/leads" class="cta-button">Open Admin Lead Pipeline</a>
                </div>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} SS40 NETWORK PRIVATE LIMITED &middot; Sree Puram, Tirunelveli
            </div>
        </div>
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
