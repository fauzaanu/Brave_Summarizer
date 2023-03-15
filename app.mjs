import puppeteer from "puppeteer";
import TelegramBot from "node-telegram-bot-api";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const bot = new TelegramBot(process.env.TOKEN, { polling: true });

bot.onText(/\/brave (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  const photo = await BraveSummarizer(resp);
  if (photo === "Error: Element not found") {
    bot.sendMessage(chatId, "Brave Summarizer is not found for this query!");
    return;
  } else if (photo === "Error: Runtime Error.") {
    bot.sendMessage(chatId, "Runtime Error!");
    return;
  } else if (photo === "screenshot.png") {
    bot.sendPhoto(chatId, fs.createReadStream("screenshot.png"));
    return;
  }
});

async function BraveSummarizer(query) {
  try {
    const browser = await puppeteer.launch({ headless: true });
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
