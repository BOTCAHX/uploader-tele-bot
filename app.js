'use strict';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import config from "./settings.js";
import handlePhoto from "./handler/photo.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
import { dirname } from 'path';
const __dirname = dirname(__filename);

const logFilePath = path.join(__dirname, 'bot.log');

const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage);
};

const port = process.env.PORT || 8080;

const app = express();
const bot = new TelegramBot(config.botToken, { polling: true });

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const data = {
    status: 'true',
    message: 'Bot Successfully Activated!',
    author: 'BOTCAHX'
  };
  const result = {
    response: data
  };
  res.send(JSON.stringify(result, null, 2));
  log('GET / - Bot Successfully Activated!');
  console.  log('GET / - Bot Successfully Activated!');  
});

function listenOnPort(port) {
  app.listen(port, () => {
    log(`Server is running on port ${port}`);
    console.log(`Server is running on port ${port}`);
  });

  app.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      log(`Port ${port} is already in use. Trying another port...`);
      console.log(`Port ${port} is already in use. Trying another port...`);
      listenOnPort(port + 1);
    } else {
      log(`Server error: ${err.message}`);
      console.log(`Server error: ${err.message}`);
    }
  });
}

listenOnPort(port);

bot.onText(/^\/start$/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, config.message.info);
  log(`Received /start command from chat ID: ${chatId}`);
  console.log(`Received /start command from chat ID: ${chatId}`);
});

bot.on('photo', async (msg) => {
  log(`Photo received from chat ID: ${msg.chat.id}`);
  console.log(`Photo received from chat ID: ${msg.chat.id}`);
  await handlePhoto(bot, msg);
});

bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data.startsWith('copy_')) {
    const urlToCopy = data.replace('copy_', '');
    bot.answerCallbackQuery(callbackQuery.id, { text: `URL copied: ${urlToCopy}` });
    log(`Callback query for copying URL: ${urlToCopy} from chat ID: ${chatId}`);
    console.log(`Callback query for copying URL: ${urlToCopy} from chat ID: ${chatId}`);
  }
});
