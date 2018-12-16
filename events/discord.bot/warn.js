const handle = async ({ message }) => {
  console.log("botOnWarn", message);
};

module.exports = {
  handle,
  name: "warn"
};
