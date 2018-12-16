const handle = async ({ bot }) => {
  bot.user.setActivity("Videos", { type: "WATCHING" });
  console.log(
    `Bot is online!\n${bot.users.size} users, in ${
      bot.guilds.size
    } servers connected.`
  );
};

module.exports = {
  handle,
  name: "ready"
};
