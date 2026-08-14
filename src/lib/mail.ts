import 'server-only';
import nodemailer from 'nodemailer';

type LeadAcknowledgementInput = {
    fullName: string;
    email: string;
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

    await transporter.verify();

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

function escapeHtml(value: string) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
