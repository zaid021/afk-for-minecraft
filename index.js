
const mineflayer = require('mineflayer');
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

const bot = mineflayer.createBot({
  host: 'zaidalres-pphn.aternos.me',
  port: 32037,
  username: 'AFK_Bot'
});

bot.loadPlugin(pathfinder);

// Telegram Bot Setup
const tgToken = '5540558971:AAGC9BgNGMeOh79UjTjlbIfjBc7IzTuKaCI';
const chatId = 5034160176;
const telegramBot = new TelegramBot(tgToken, { polling: true });

// Telegram Commands
telegramBot.onText(/\/say (.+)/, (msg, match) => {
  if (msg.chat.id === chatId) bot.chat(match[1]);
});

telegramBot.onText(/\/come/, () => {
  const target = bot.players['zaidiio']?.entity;
  if (target) {
    const goal = new goals.GoalFollow(target, 1);
    bot.pathfinder.setMovements(new Movements(bot));
    bot.pathfinder.setGoal(goal, true);
  }
});

telegramBot.onText(/\/status/, () => {
  telegramBot.sendMessage(chatId, `Health: ${bot.health} | Food: ${bot.food}`);
});

telegramBot.onText(/\/stop/, () => {
  bot.quit();
  telegramBot.sendMessage(chatId, 'Bot disconnected.');
});

bot.on('spawn', () => {
  bot.chat('أنا داخل السيرفر وجاهز!');
});

bot.on('physicTick', () => {
  const entity = bot.nearestEntity(e => e.type === 'mob');
  if (entity) bot.attack(entity);
});

// Keep Alive
const app = express();
app.get('/', (_, res) => res.send('AFK Bot is running!'));
app.listen(3000);
