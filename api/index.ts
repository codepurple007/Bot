// Simple root endpoint to avoid 404
export default async function handler(req: any, res: any) {
  console.log("[Index] Root endpoint accessed");
  res.status(200).json({
    message: "Telegram Bot API",
    endpoints: {
      webhook: "/api/webhook",
      setWebhook: "/api/set-webhook"
    },
    status: "online",
    env: {
      hasToken: !!process.env.BOT_TOKEN,
      hasAdminIds: !!process.env.ADMIN_IDS,
      hasPublicUrl: !!process.env.PUBLIC_URL
    }
  });
}

