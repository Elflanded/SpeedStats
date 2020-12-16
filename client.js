const path = require("path");

const { CommandoClient } = require("discord.js-commando");
const { Intents } = require("discord.js");

const intents = new Intents();
intents.add(Intents.NON_PRIVILEGED);

const client = new CommandoClient({
  owner: [
    "738604939957239930",
    "474016258019557377"
  ],
  presence: {
    activity: {
      name: "Speedrun.com",
      type: "WATCHING"
    }
  },
  commandPrefix: "s!",
  invite: "https://discord.gg/sDaP9NU",
  ws: {intents}
});

client.registry.registerDefaults();
client.registry.registerGroups([
  ["info", "Information"]
])
client.registry.registerCommandsIn(path.join(__dirname, "commands"));

client.on("debug", console.debug);

client.login();