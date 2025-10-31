import { createBot } from "../src/bot.js";

// Vercel serverless handler for Telegram webhook
export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const token = process.env.BOT_TOKEN;
  const adminIds = (process.env.ADMIN_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s));
  const groupId = process.env.TARGET_GROUP_ID ? Number(process.env.TARGET_GROUP_ID) : undefined;
  const channelId = process.env.TARGET_CHANNEL_ID ? Number(process.env.TARGET_CHANNEL_ID) : undefined;
  const botUsername = process.env.BOT_USERNAME || undefined;
  const channelUsername = process.env.CHANNEL_USERNAME || undefined;

  if (!token || adminIds.length === 0 || adminIds.some((n) => Number.isNaN(n))) {
    res.status(500).send("Missing BOT_TOKEN or ADMIN_IDS env vars");
    return;
  }

  const bot = createBot({ BOT_TOKEN: token, ADMIN_IDS: adminIds, TARGET_GROUP_ID: groupId, TARGET_CHANNEL_ID: channelId, BOT_USERNAME: botUsername, CHANNEL_USERNAME: channelUsername });

  try {
    await bot.handleUpdate(req.body);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(200).json({ ok: true }); // Always 200 to satisfy Telegram retries
  }
}


