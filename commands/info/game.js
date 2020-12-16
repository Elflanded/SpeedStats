const { URL } = require("url");

const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const got = require("got");

class GameCommand extends Command {
  constructor(client) {
    super(client, {
      name: "game",
      group: "info",
      memberName: "game",
      description: "Looks up a game.",
      args: [
        {
          key: "name",
          type: "string",
          prompt: "Enter a game to look up."
        }
      ]
    })
  }

  async run(message, {name}) {
    const url = new URL("https://www.speedrun.com/api/v1/games");
    url.searchParams.set("name", name);
    let game;
    try {
      game = (await got(url, {responseType: "json"})).body.data[0];
    } catch(error) {
      return await message.channel.send("Failed to fetch information for that game. Are you sure you entered their name correctly?");
    }

    const embed = new MessageEmbed();

    embed.setAuthor(game.names.international, game.assets.icon.uri, game.weblink);
    embed.setThumbnail(game.assets["cover-large"].uri);
    if (game.assets.background) embed.setImage(game.assets.background.uri); 

    message.channel.send(embed);
  }
}  

module.exports = GameCommand;