import { createBot } from "../src/bot.js";

// Vercel serverless handler for Telegram webhook
export default async function handler(req: any, res: any) {
  console.log("[Webhook] Request received:", {
    method: req.method,
    hasBody: !!req.body,
    envVars: {
      hasToken: !!process.env.BOT_TOKEN,
      hasAdminIds: !!process.env.ADMIN_IDS,
      adminIdsValue: process.env.ADMIN_IDS
    }
  });

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

  console.log("[Webhook] Environment check:", {
    hasToken: !!token,
    adminIdsCount: adminIds.length,
    adminIds: adminIds,
    hasInvalidAdminIds: adminIds.some((n) => Number.isNaN(n))
  });

  if (!token || adminIds.length === 0 || adminIds.some((n) => Number.isNaN(n))) {
    console.error("[Webhook] Missing env vars:", {
      token: !!token,
      adminIdsLength: adminIds.length,
      adminIdsHasNaN: adminIds.some((n) => Number.isNaN(n))
    });
    res.status(500).send("Missing BOT_TOKEN or ADMIN_IDS env vars");
    return;
  }

  try {
    console.log("[Webhook] Creating bot instance...");
    console.log("[Webhook] Request body:", JSON.stringify(req.body, null, 2));
    const bot = createBot({ BOT_TOKEN: token, ADMIN_IDS: adminIds, TARGET_GROUP_ID: groupId, TARGET_CHANNEL_ID: channelId, BOT_USERNAME: botUsername, CHANNEL_USERNAME: channelUsername });
    
    console.log("[Webhook] Handling update...");
    console.log("[Webhook] Update type:", req.body?.message ? "message" : req.body?.callback_query ? "callback_query" : "unknown");
    await bot.handleUpdate(req.body);
    console.log("[Webhook] ✅ Update handled successfully");
    res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("[Webhook] ❌ Error handling update:", err);
    console.error("[Webhook] ❌ Error message:", err?.message);
    console.error("[Webhook] ❌ Error stack:", err?.stack);
    console.error("[Webhook] ❌ Full error:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
    res.status(200).json({ ok: true }); // Always 200 to satisfy Telegram retries
  }
}


