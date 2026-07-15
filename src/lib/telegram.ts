export async function sendTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) {
    console.error("TELEGRAM_BOT_TOKEN is not set");
    return { success: false, error: "Token not set" };
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error("Telegram API Error:", data);
      return { success: false, error: data.description };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return { success: false, error };
  }
}

export async function setTelegramWebhook(webhookUrl: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token) {
    return { success: false, error: "Token not set" };
  }

  const url = `https://api.telegram.org/bot${token}/setWebhook`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: webhookUrl,
      }),
    });

    const data = await response.json();
    return { success: data.ok, description: data.description };
  } catch (error) {
    return { success: false, error };
  }
}
