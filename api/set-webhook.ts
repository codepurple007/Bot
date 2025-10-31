import { createBot } from "../src/bot.js";

// Call this endpoint once after deployment to register Telegram webhook
export default async function handler(req: any, res: any) {
  console.log("[SetWebhook] Request received:", {
    method: req.method,
    url: req.url,
    hasToken: !!process.env.BOT_TOKEN,
    hasAdminIds: !!process.env.ADMIN_IDS,
    hasPublicUrl: !!process.env.PUBLIC_URL
  });

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

  console.log("[SetWebhook] Environment check:", {
    hasToken: !!token,
    adminIdsCount: adminIds.length,
    publicUrl: publicUrl
  });

  if (!token || adminIds.length === 0 || !publicUrl) {
    console.error("[SetWebhook] Missing env vars:", {
      token: !!token,
      adminIdsLength: adminIds.length,
      publicUrl: !!publicUrl
    });
    res.status(500).send("Missing BOT_TOKEN, ADMIN_IDS or PUBLIC_URL");
    return;
  }

  const bot = createBot({ BOT_TOKEN: token, ADMIN_IDS: adminIds, TARGET_GROUP_ID: groupId, TARGET_CHANNEL_ID: channelId, BOT_USERNAME: botUsername, CHANNEL_USERNAME: channelUsername });

  try {
    console.log("[SetWebhook] Creating bot instance...");
    // Remove trailing slash from publicUrl if present
    const baseUrl = publicUrl.replace(/\/$/, '');
    const webhookUrl = `${baseUrl}/api/webhook`;
    console.log("[SetWebhook] Setting webhook to:", webhookUrl);
    await bot.api.setWebhook(webhookUrl);
    console.log("[SetWebhook] ✅ Webhook set successfully");
    res.status(200).json({ ok: true, webhookUrl });
  } catch (err: any) {
    console.error("[SetWebhook] ❌ Error:", err);
    console.error("[SetWebhook] ❌ Error message:", err?.message);
    console.error("[SetWebhook] ❌ Error stack:", err?.stack);
    res.status(500).json({ ok: false, error: err?.message || "setWebhook failed" });
  }
}


