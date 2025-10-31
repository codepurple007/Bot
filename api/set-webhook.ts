import { createBot } from "../src/bot.js";

// Call this endpoint once after deployment to register Telegram webhook
export default async function handler(req: any, res: any) {
  const token = process.env.BOT_TOKEN;
  const adminIds = (process.env.ADMIN_IDS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s));
  const publicUrl = process.env.PUBLIC_URL; // e.g., https://your-project.vercel.app
  const groupId = process.env.TARGET_GROUP_ID ? Number(process.env.TARGET_GROUP_ID) : undefined;
  const channelId = process.env.TARGET_CHANNEL_ID ? Number(process.env.TARGET_CHANNEL_ID) : undefined;
  const botUsername = process.env.BOT_USERNAME || undefined;
  const channelUsername = process.env.CHANNEL_USERNAME || undefined;

  if (!token || adminIds.length === 0 || !publicUrl) {
    res.status(500).send("Missing BOT_TOKEN, ADMIN_IDS or PUBLIC_URL");
    return;
  }

  const bot = createBot({ BOT_TOKEN: token, ADMIN_IDS: adminIds, TARGET_GROUP_ID: groupId, TARGET_CHANNEL_ID: channelId, BOT_USERNAME: botUsername, CHANNEL_USERNAME: channelUsername });

  try {
    const webhookUrl = `${publicUrl}/api/webhook`;
    await bot.api.setWebhook(webhookUrl);
    res.status(200).json({ ok: true, webhookUrl });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ ok: false, error: err?.message || "setWebhook failed" });
  }
}


