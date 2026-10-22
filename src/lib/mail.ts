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
                                    2. SS40 Products &rarr;
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

    // Strict Guard: Never dispatch admin lead notification email without a valid phone number or email address
    const cleanPhone = (lead.phone || '').trim();
    const cleanEmail = (lead.email || '').trim().toLowerCase();
    const isPhoneValid = cleanPhone !== '' && cleanPhone.toLowerCase() !== 'not provided';
    const isEmailValid = cleanEmail !== '' && cleanEmail.toLowerCase() !== 'not provided';

    if (!isPhoneValid && !isEmailValid) {
        console.warn(`[Mail] Suppressed admin lead notification for '${lead.fullName}': Neither phone nor email provided.`);
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

    // Dynamic time-of-day salutation in IST timezone matching Screenshot 2
    const currentHourStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false });
    const currentHour = parseInt(currentHourStr, 10);
    const timeOfDay = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';
    const salutation = `Hi Sivasubramanian M, ${timeOfDay}`;

    // Bulletproof Minimalist HTML Email Template (Inspired by Executive Agent Briefing)
    const html = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Lead Report — ${escapeHtml(leadName)}</title>
    </head>
    <body style="margin: 0; padding: 28px 16px; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1E293B;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);">
            <tr>
                <td style="padding: 32px 28px 28px 28px;">
                    <!-- Editorial Serif Salutation -->
                    <h1 style="margin: 0 0 8px 0; color: #0F172A; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 700; line-height: 1.3; letter-spacing: -0.01em;">
                        ${salutation}
                    </h1>
                    <p style="margin: 0 0 24px 0; color: #475569; font-size: 13.5px; line-height: 1.55; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        I&rsquo;m your Agent SKY. A new verified inquiry was just captured on the official platform. Please review the lead brief below.
                    </p>

                    <!-- Minimalist Briefing Card (Soft Tinted Block) -->
                    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 20px;">
                        <!-- Section Header -->
                        <div style="font-size: 14px; font-weight: 700; color: #0F766E; margin-bottom: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; letter-spacing: -0.01em;">
                            Lead Report &mdash; ${escapeHtml(leadName)}
                        </div>

                        <!-- Key-Value Pairs without Heavy Borders -->
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            <tr>
                                <td width="120" style="padding: 3.5px 0; color: #64748B; font-size: 13px; font-weight: 500; vertical-align: top;">Full Name:</td>
                                <td style="padding: 3.5px 0; color: #0F172A; font-size: 13.5px; font-weight: 600;">${escapeHtml(leadName)}</td>
                            </tr>
                            <tr>
                                <td width="120" style="padding: 3.5px 0; color: #64748B; font-size: 13px; font-weight: 500; vertical-align: top;">Phone:</td>
                                <td style="padding: 3.5px 0; font-size: 13.5px;">
                                    ${leadPhone !== 'Not provided' ? `
                                        <a href="tel:${escapeHtml(leadPhone)}" style="color: #0F766E; text-decoration: none; font-weight: 600;">
                                            ${escapeHtml(leadPhone)}
                                        </a>
                                    ` : `
                                        <span style="color: #94A3B8;">Not provided</span>
                                    `}
                                </td>
                            </tr>
                            <tr>
                                <td width="120" style="padding: 3.5px 0; color: #64748B; font-size: 13px; font-weight: 500; vertical-align: top;">Email:</td>
                                <td style="padding: 3.5px 0; font-size: 13.5px;">
                                    ${leadEmail !== 'Not provided' ? `
                                        <a href="mailto:${escapeHtml(leadEmail)}" style="color: #0F766E; text-decoration: none; font-weight: 600; word-break: break-all;">
                                            ${escapeHtml(leadEmail)}
                                        </a>
                                    ` : `
                                        <span style="color: #94A3B8;">Not provided</span>
                                    `}
                                </td>
                            </tr>
                            <tr>
                                <td width="120" style="padding: 3.5px 0; color: #64748B; font-size: 13px; font-weight: 500; vertical-align: top;">Company / Org:</td>
                                <td style="padding: 3.5px 0; color: #334155; font-size: 13px;">${escapeHtml(leadCompany)}</td>
                            </tr>
                            <tr>
                                <td width="120" style="padding: 3.5px 0; color: #64748B; font-size: 13px; font-weight: 500; vertical-align: top;">Interest:</td>
                                <td style="padding: 3.5px 0; color: #0F766E; font-size: 13.5px; font-weight: 600;">${escapeHtml(leadInterest)}</td>
                            </tr>
                            <tr>
                                <td width="120" style="padding: 3.5px 0; color: #64748B; font-size: 13px; font-weight: 500; vertical-align: top;">Lead Source:</td>
                                <td style="padding: 3.5px 0; color: #334155; font-size: 13px;">${escapeHtml(formatLeadSource(leadSource))}</td>
                            </tr>
                            <tr>
                                <td width="120" style="padding: 3.5px 0; color: #64748B; font-size: 13px; font-weight: 500; vertical-align: top;">Captured At:</td>
                                <td style="padding: 3.5px 0; color: #64748B; font-size: 12.5px;">${escapeHtml(formattedDate)}</td>
                            </tr>
                        </table>

                        <!-- Optional Message / Inquiry Note -->
                        ${leadMessage ? `
                        <div style="margin-top: 12px; padding-top: 12px; border-top: 1px dashed #CBD5E1;">
                            <div style="color: #64748B; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                                Inquiry Note
                            </div>
                            <div style="color: #1E293B; font-size: 13px; line-height: 1.5; white-space: pre-wrap; font-style: italic;">
                                &ldquo;${escapeHtml(leadMessage)}&rdquo;
                            </div>
                        </div>
                        ` : ''}
                    </div>

                    <!-- Clean Understated Action Button -->
                    <div style="margin-top: 22px;">
                        <a href="https://ss40network.com/admin/leads" style="display: inline-block; background-color: #0F766E; color: #FFFFFF !important; text-decoration: none; padding: 10px 18px; font-size: 13px; font-weight: 600; border-radius: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; box-shadow: 0 1px 2px rgba(15, 118, 110, 0.2);">
                            Open Admin Lead Pipeline &rarr;
                        </a>
                    </div>

                    <!-- Quiet Minimalist Footer -->
                    <div style="margin-top: 26px; padding-top: 18px; border-top: 1px solid #F1F5F9; color: #94A3B8; font-size: 11.5px; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                        <span style="color: #64748B; font-weight: 600;">Agent SKY</span> &bull; SS40 NETWORK PRIVATE LIMITED<br />
                        Confidential operational dispatch
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

export type CareerApplicationNotificationInput = {
    fullName: string;
    email: string;
    phone: string;
    roleTitle: string;
    department?: string | null;
    experienceLevel?: string | null;
    currentOrg?: string | null;
    portfolioUrl?: string | null;
    linkedinUrl?: string | null;
    resumeUrl?: string | null;
    coverLetter?: string | null;
    submittedAt?: Date | string;
    targetEmail?: string | null;
};

/**
 * Sends a detailed job application notification to careers@ss40network.com
 */
export async function sendCareerApplicationNotification(app: CareerApplicationNotificationInput) {
    const { config, missingKeys } = getSmtpConfig();

    if (!config) {
        console.error('Career application notification skipped: missing or invalid SMTP configuration', { missingKeys });
        return;
    }

    const recipient = app.targetEmail?.trim() || process.env.CAREERS_NOTIFICATION_EMAIL || 'careers@ss40network.com';

    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: config.auth,
    });

    const candidateName = app.fullName?.trim() || 'Candidate';
    const candidateEmail = app.email?.trim() || 'Not provided';
    const candidatePhone = app.phone?.trim() || 'Not provided';
    const roleTitle = app.roleTitle?.trim() || 'General Role';
    const department = app.department?.trim() || 'Not Specified';
    const experience = app.experienceLevel?.trim() || 'Not Specified';
    const currentOrg = app.currentOrg?.trim() || 'Not Specified';
    const portfolioUrl = app.portfolioUrl?.trim() || '';
    const linkedinUrl = app.linkedinUrl?.trim() || '';
    const resumeUrl = app.resumeUrl?.trim() || '';
    const coverLetter = app.coverLetter?.trim() || '';
    const formattedDate = app.submittedAt
        ? new Date(app.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const subject = `[New Job Application] ${candidateName} — ${roleTitle} (${experience})`;

    const text = [
        `NEW JOB APPLICATION — SS40 NETWORK`,
        `==================================`,
        `Candidate Name:   ${candidateName}`,
        `Role Applied:     ${roleTitle}`,
        `Department:       ${department}`,
        `Experience Level: ${experience}`,
        `Email:            ${candidateEmail}`,
        `Phone / WhatsApp: ${candidatePhone}`,
        `Current Org:      ${currentOrg}`,
        `LinkedIn URL:     ${linkedinUrl || 'Not provided'}`,
        `Portfolio URL:    ${portfolioUrl || 'Not provided'}`,
        `Resume Link:      ${resumeUrl || 'Not uploaded'}`,
        `Submitted Date:   ${formattedDate}`,
        ``,
        `Cover Note / Introduction:`,
        `--------------------------`,
        `${coverLetter || 'No cover note provided.'}`,
        ``,
        `Admin Panel: https://ss40network.com/admin/careers`,
        `==================================`,
    ].join('\n');

    const html = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Job Application — ${escapeHtml(candidateName)}</title>
    </head>
    <body style="margin: 0; padding: 28px 16px; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1E293B;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);">
            <tr>
                <td style="padding: 32px 28px 28px 28px;">
                    <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.12em; color: #0F766E; text-transform: uppercase; margin-bottom: 8px;">
                        CAREERS &bull; TALENT ACQUISITION
                    </div>
                    <h1 style="margin: 0 0 12px 0; color: #0F172A; font-family: Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 700; line-height: 1.3;">
                        New Application: ${escapeHtml(candidateName)}
                    </h1>
                    <p style="margin: 0 0 20px 0; color: #475569; font-size: 13.5px; line-height: 1.55;">
                        A candidate has submitted their application for the <strong>${escapeHtml(roleTitle)}</strong> role in <strong>${escapeHtml(department)}</strong>.
                    </p>

                    <div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 18px 20px; margin-bottom: 20px;">
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; line-height: 1.6;">
                            <tr>
                                <td style="padding: 4px 0; color: #64748B; width: 130px; font-weight: 600;">Full Name:</td>
                                <td style="padding: 4px 0; color: #0F172A; font-weight: 600;">${escapeHtml(candidateName)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Position:</td>
                                <td style="padding: 4px 0; color: #0F766E; font-weight: 700;">${escapeHtml(roleTitle)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Department:</td>
                                <td style="padding: 4px 0; color: #334155;">${escapeHtml(department)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Experience:</td>
                                <td style="padding: 4px 0; color: #334155;">${escapeHtml(experience)}</td>
                            </tr>
                            <tr>
                                <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Email:</td>
                                <td style="padding: 4px 0; color: #0F172A;"><a href="mailto:${escapeHtml(candidateEmail)}" style="color: #0F766E; text-decoration: underline;">${escapeHtml(candidateEmail)}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Phone:</td>
                                <td style="padding: 4px 0; color: #0F172A;"><a href="tel:${escapeHtml(candidatePhone)}" style="color: #0F766E; text-decoration: underline;">${escapeHtml(candidatePhone)}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Organization:</td>
                                <td style="padding: 4px 0; color: #334155;">${escapeHtml(currentOrg)}</td>
                            </tr>
                            ${linkedinUrl ? `
                            <tr>
                                <td style="padding: 4px 0; color: #64748B; font-weight: 600;">LinkedIn:</td>
                                <td style="padding: 4px 0;"><a href="${escapeHtml(linkedinUrl)}" target="_blank" style="color: #0F766E; text-decoration: underline;">View Profile &rarr;</a></td>
                            </tr>` : ''}
                            ${portfolioUrl ? `
                            <tr>
                                <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Portfolio:</td>
                                <td style="padding: 4px 0;"><a href="${escapeHtml(portfolioUrl)}" target="_blank" style="color: #0F766E; text-decoration: underline;">View Portfolio &rarr;</a></td>
                            </tr>` : ''}
                            ${resumeUrl ? `
                            <tr>
                                <td style="padding: 4px 0; color: #64748B; font-weight: 600;">Resume Link:</td>
                                <td style="padding: 4px 0;"><a href="${resumeUrl.startsWith('http') ? escapeHtml(resumeUrl) : `https://ss40network.com${escapeHtml(resumeUrl)}`}" target="_blank" style="color: #0F766E; font-weight: 700; text-decoration: underline;">Download / View Resume &rarr;</a></td>
                            </tr>` : ''}
                        </table>
                    </div>

                    ${coverLetter ? `
                    <div style="margin-bottom: 24px;">
                        <div style="font-size: 12px; font-weight: 700; color: #64748B; text-transform: uppercase; margin-bottom: 6px;">Introduction / Cover Note</div>
                        <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 14px; font-size: 13px; line-height: 1.6; color: #334155; white-space: pre-line;">${escapeHtml(coverLetter)}</div>
                    </div>` : ''}

                    <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #F1F5F9; color: #94A3B8; font-size: 11.5px; line-height: 1.5;">
                        <span style="color: #64748B; font-weight: 600;">SS40 NETWORK Careers Desk</span> &bull; Tirunelveli HQ<br />
                        Submitted: ${formattedDate}
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    await transporter.sendMail({
        from: config.from,
        to: recipient,
        subject,
        text,
        html,
    });
}

export type ApplicantAcknowledgementInput = {
    fullName: string;
    email: string;
    roleTitle: string;
};

/**
 * Sends Option A confirmation email to the applicant
 */
export async function sendApplicantAcknowledgementEmail({ fullName, email, roleTitle }: ApplicantAcknowledgementInput) {
    const { config, missingKeys } = getSmtpConfig();

    if (!config) {
        console.error('Applicant acknowledgement email skipped: missing or invalid SMTP configuration', { missingKeys });
        return;
    }

    const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: config.auth,
    });

    const candidateName = fullName?.trim() || 'Applicant';
    const role = roleTitle?.trim() || 'Software Engineer';
    const subject = `Application Received — ${role} | SS40 NETWORK`;

    // OPTION A MESSAGE
    const text = [
        `Dear ${candidateName},`,
        ``,
        `Thank you for applying! Our team has received your application for the ${role} position. We will review your profile and contact you soon.`,
        ``,
        `Best regards,`,
        `Talent Acquisition Team`,
        `SS40 NETWORK PRIVATE LIMITED`,
        `Tirunelveli, Tamil Nadu, India`,
        `https://ss40network.com`,
    ].join('\n');

    const html = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Application Received — SS40 NETWORK</title>
    </head>
    <body style="margin: 0; padding: 28px 16px; background-color: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1E293B;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; margin: 0 auto; background-color: #FFFFFF; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);">
            <tr>
                <td style="background-color: #0F766E; padding: 24px 26px; text-align: left;">
                    <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.12em; color: #99F6E4; text-transform: uppercase;">
                        SS40 NETWORK &bull; CAREERS
                    </div>
                    <div style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin-top: 4px; font-family: Georgia, serif;">
                        Application Received
                    </div>
                </td>
            </tr>
            <tr>
                <td style="padding: 28px 26px;">
                    <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #0F172A;">
                        Dear <strong>${escapeHtml(candidateName)}</strong>,
                    </p>
                    <div style="background-color: #EDF5F2; border-left: 4px solid #0F766E; padding: 14px 16px; border-radius: 4px; margin-bottom: 20px;">
                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #134E4A; font-weight: 500;">
                            Thank you for applying! Our team has received your application for the <strong>${escapeHtml(role)}</strong> position. We will review your profile and contact you soon.
                        </p>
                    </div>
                    <p style="margin: 0 0 20px 0; font-size: 13px; line-height: 1.55; color: #475569;">
                        If you have any questions or wish to provide additional portfolio materials, you can reach out directly to <a href="mailto:careers@ss40network.com" style="color: #0F766E; text-decoration: underline;">careers@ss40network.com</a>.
                    </p>
                    <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid #F1F5F9; color: #94A3B8; font-size: 12px; line-height: 1.5;">
                        <strong>Talent Acquisition Team</strong><br />
                        SS40 NETWORK PRIVATE LIMITED &bull; Tirunelveli, Tamil Nadu<br />
                        <a href="https://ss40network.com" style="color: #0F766E; text-decoration: none;">https://ss40network.com</a>
                    </div>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;

    await transporter.sendMail({
        from: config.from,
        to: email.trim(),
        subject,
        text,
        html,
    });
}
