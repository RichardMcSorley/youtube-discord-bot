require("dotenv").config();
const Discord = require("discord.js");
const db = require("./firebase/index");
const loadFiles = require("./utils/loader");

const bot = new Discord.Client({
  disabledEvents: [
    "GUILD_MEMBER_ADD",
    "GUILD_MEMBER_REMOVE",
    "GUILD_MEMBER_UPDATE",
    "GUILD_MEMBERS_CHUNK",
    "GUILD_ROLE_CREATE",
    "GUILD_ROLE_DELETE",
    "GUILD_ROLE_UPDATE",
    "GUILD_BAN_ADD",
    "GUILD_BAN_REMOVE",
    "CHANNEL_CREATE",
    "CHANNEL_DELETE",
    "CHANNEL_UPDATE",
    "CHANNEL_PINS_UPDATE",
    "MESSAGE_CREATE",
    "MESSAGE_DELETE",
    "MESSAGE_UPDATE",
    "MESSAGE_DELETE_BULK",
    "MESSAGE_REACTION_ADD",
    "MESSAGE_REACTION_REMOVE",
    "MESSAGE_REACTION_REMOVE_ALL",
    "USER_UPDATE",
    "USER_NOTE_UPDATE",
    "USER_SETTINGS_UPDATE",
    "PRESENCE_UPDATE",
    "VOICE_STATE_UPDATE",
    "TYPING_START",
    "VOICE_SERVER_UPDATE",
    "RELATIONSHIP_ADD",
    "RELATIONSHIP_REMOVE"
  ],
  messageCacheMaxSize: 1,
  messageCacheLifetime: 1,
  messageSweepInterval: 1
});

bot.commands = new Discord.Collection();
bot.selfEVENTS = new Discord.Collection();

bot.login(process.env.KOREAN_DICT_BOT_DISCORD_TOKEN);

// use fire for admin purposes, in discord use !admin eval bot.fire('restart') to restart the server
bot.fire = action => {
  const { spawn } = require("child_process");
  switch (action) {
    case "restart":
      const subprocess = spawn(process.argv[0], process.argv.slice(1), {
        // spawn new process
        detached: true,
        stdio: ["ignore"]
      });
      subprocess.unref();
      bot.fire("shutdown"); // close this process
      return "restarting";
    case "shutdown":
      process.exit();
      return "shutdown";
    default:
      return "please provide an action";
  }
};
bot.run = bot.fire; // sometimes I forget which one ;)
// Load needed libraries and attach event listeners

loadFiles({ path: "./commands/" }, ({ library }) => {
  const possibleCommands = Object.keys(library.prefix);
  // add all prefixes of each command
  possibleCommands.forEach(prefix => {
    bot.commands.set(prefix, {
      ...library,
      name: prefix,
      ...library.prefix[prefix]
    });
  });
});

loadFiles({ path: "./events/discord.bot/" }, ({ library }) => {
  bot.selfEVENTS.set(library.name, library);
  bot.on(library.name, message => library.handle({ message, bot, db }));
});
loadFiles({ path: "./events/firebase/" }, ({ library }) => {
  if (library.needsBot) {
    library.handle({ bot, db });
  }
});
// Catch Errors before they crash the app.
process.on("uncaughtException", err => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Uncaught Exception: ", errorMsg);
});
process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: ", err);
});
