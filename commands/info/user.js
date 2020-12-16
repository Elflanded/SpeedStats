const { URL } = require("url");

const { Command } = require("discord.js-commando");
const { MessageEmbed } = require("discord.js");
const got = require("got");

class UserCommand extends Command {
  constructor(client) {
    super(client, {
      name: "user",
      group: "info",
      memberName: "user",
      description: "Looks up a user.",
      args: [
        {
          key: "username",
          type: "string",
          prompt: "Enter a username to look up"
        }
      ]
    })
  }

  async run(message, {username}) {
    const url = new URL("https://www.speedrun.com/api/v1/users/" + username);
    let user;
    try {
      user = (await got(url, {responseType: "json"})).body.data;
    } catch(error) {
      return await message.channel.send("Failed to fetch information for that user. Are you sure you entered their name correctly?");
    }

    const embed = new MessageEmbed();

    embed.setAuthor(user.names.international, `https://www.speedrun.com/themes/user/${user.names.international}/image.png`, user.weblink); 
    if (user.signup) embed.setTimestamp(new Date(user.signup));
    embed.setColor(user["name-style"].style === "solid" ? user["name-style"].color.dark : user["name-style"]["color-from"].dark);
    embed.setThumbnail(`https://www.speedrun.com/themes/user/${user.names.international}/image.png`);

    if (user.location) embed.addField("Region", `:flag_${user.location.country.code.toLowerCase()}: ` + (user.location.region ? user.location.region.names.international : user.location.country.names.international), false);

    if (user.twitch) embed.addField("Twitch", user.twitch.uri, false);
    if (user.hitbox) embed.addField("Hitbox", user.hitbox.uri, false);
    if (user.youtube) embed.addField("YouTube", user.youtube.uri, false);
    if (user.twitter) embed.addField("Twitter", user.twitter.uri, false);
    if (user.speedrunslive) embed.addField("SpeedrunsLive", user.speedrunslive.uri, false);

    embed.setFooter(`ID: ${user.id}`, this.client.user.displayAvatarURL({dynamic: true}));

    await message.channel.send(embed);
  }
}

module.exports = UserCommand;