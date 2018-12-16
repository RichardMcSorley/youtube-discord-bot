const handle = ({ message, options, bot }) => {
  options.setThumbnail(
    "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/155/books_1f4da.png"
  );
  let commandString = "";
  const listOfCommands = bot.commands
    .array()
    .filter(
      ({ display, lang }) =>
        display === true || (display === "lang" && message.lang === lang)
    );
  //bot.commands.tap(command => console.log(command));
  if (message.channel.type === "youtube") {
    listOfCommands.forEach(({ name }) => {
      commandString += ` ${name} `;
    });
    return message.channel.send(
      "Korean Dictionary Commands:" + commandString,
      true
    );
  }
  listOfCommands.forEach(({ usage, description }) => {
    options.addField(usage, description, true);
  });
  options.addField(
    "Tip:",
    "Most commands have a 3 and 1 character short hand ***!keyboard*** becomes ***!key*** or ***!k***"
  );
  options.setTitle("Youtube bot commands:");
  return message.channel.send(options);
};

module.exports = {
  handle,
  prefix: {
    "!yhelp": {
      match: "help",
      value: "!yhelp ",
      lang: "en",
      display: false
    }
  }
};
