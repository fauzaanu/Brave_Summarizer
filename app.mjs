import puppeteer from "puppeteer";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

// the bot may crash if chromium crashes so we need to handle it
// it may crash with a timeout as well

bot.onText(/\/brave (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  const photo = await BraveSummarizer(resp);
  if (photo === "Error: Element not found") {
    bot.sendMessage(chatId, "Brave Summarizer is not found for this query!");
    return;
  }
});

bot.sendPhoto(chatId, photo);

async function BraveSummarizer(query) {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(`https://search.brave.com/search?q=${query}`, {
      waituntil: "networkidle0",
    });

    // we need to screenshot element id of #summarizer if not found then wait for 10 seconds and return error
    try {
      await page.waitForSelector("#summarizer", { timeout: 10000 });
    } catch (err) {
      await browser.close();
      return "Error: Element not found";
    }

    // screenshot the element
    await page.screenshot({
      path: "screenshot.png",

      // clip the element
      clip: await page.$eval("#summarizer", (el) => {
        const { x, y, width, height } = el.getBoundingClientRect();
        return { x, y, width, height };
      }),
    });

    await browser.close();
    return "screenshot.png";
  } catch (err) {
    return "Error: Runtime Error.";
  }
}
