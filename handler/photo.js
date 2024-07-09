import FormData from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
import fetch from 'node-fetch';
import axios from 'axios';
import config from "../settings.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
import { dirname } from 'path';
const __dirname = dirname(__filename);

const logFilePath = path.join(__dirname, '../bot.log');

const log = (message) => {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  fs.appendFileSync(logFilePath, logMessage);
};

const handlePhoto = async (bot, msg) => {
  const chatId = msg.chat.id;
  const photoId = msg.photo[msg.photo.length - 1].file_id;

  log(`Received photo from chat ID: ${chatId}, photo ID: ${photoId}`);
  console.log(`Received photo from chat ID: ${chatId}, photo ID: ${photoId}`);

  try {
    const file = await bot.getFile(photoId);
    const filePath = `https://api.telegram.org/file/bot${config.botToken}/${file.file_path}`;
    
    log(`File path: ${filePath}`);
    console.log(`File path: ${filePath}`);

    const response = await axios({
      url: filePath,
      method: 'GET',
      responseType: 'arraybuffer'
    });

    const buffer = Buffer.from(response.data, 'binary');
    let { ext } = await fileTypeFromBuffer(buffer);
    
    log(`File extension: ${ext}`);
    console.log(`File extension: ${ext}`);
    
    let bodyForm = new FormData();
    bodyForm.append("file", buffer, "file." + ext);

    log(`Uploading file to https://btch.pages.dev/upload`);
    console.log(`Uploading file to https://btch.pages.dev/upload`);

    let res = await fetch("https://btch.pages.dev/upload", {
      method: "post",
      body: bodyForm,
    });

    let data = await res.json();
    let resultUrl = data[0] ? `https://btch.pages.dev${data[0].src}` : '';

    log(`Result URL: ${resultUrl}`);
    console.log(`Result URL: ${resultUrl}`);

    if (resultUrl) {
      const replyMarkup = {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'URL', url: resultUrl }],
            [{ text: 'Share', switch_inline_query: resultUrl }],
            [{ text: 'Copy', callback_data: `copy_${resultUrl}` }],
          ],
        },
      };

      log(`Sending photo with URL: ${resultUrl}`);
      console.log(`Sending photo with URL: ${resultUrl}`);

      await bot.sendPhoto(chatId, photoId, {
        caption: `@${msg.from.username}, ${config.message.success}\n\nURL: ${resultUrl}`,
        reply_markup: replyMarkup.reply_markup
      });
    } else {
      log(`Error: Unable to retrieve result URL`);
      console.log(`Error: Unable to retrieve result URL`);
      bot.sendMessage(chatId, config.message.error);
    }
  } catch (error) {
    log(`Error: ${error.message}`);
    console.log(`Error: ${error.message}`);
    bot.sendMessage(chatId, config.message.error);
  }
};

export default handlePhoto;
