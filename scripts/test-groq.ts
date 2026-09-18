import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
            const [k, ...v] = trimmed.split("=");
            const key = k.trim();
            const val = v.join("=").trim().replace(/^["']|["']$/g, "");
            process.env[key] = val;
        }
    }
}

import { generateRagResponse } from "../src/lib/ai/groq";

async function testCleanOptions() {
    const cleanOptions = [
        "About SS40",
        "SS40 Digital Solutions",
        "SS40 Products",
        "SS40 Academics",
        "Office Location",
        "WhatsApp Support"
    ];

    for (const opt of cleanOptions) {
        console.log(`\n========================================`);
        console.log(`OPTION CLICKED: "${opt}"`);
        const res = await generateRagResponse(opt, []);
        console.log(`Source: ${res.source}`);
        console.log(`Navigation Link:`, res.link);
        console.log(`Follow-up Quick Replies:`, res.quickReplies);
        console.log(`Bot Response:\n${res.replyText}`);
    }
}

testCleanOptions().catch(console.error);
