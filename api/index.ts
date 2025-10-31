// Simple root endpoint to avoid 404
export default async function handler(req: any, res: any) {
  res.status(200).json({
    message: "Telegram Bot API",
    endpoints: {
      webhook: "/api/webhook",
      setWebhook: "/api/set-webhook"
    },
    status: "online"
  });
}

