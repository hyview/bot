import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Client } from "hypixel-api-reborn";
import * as HyviewModels from "../lib/models";
import MessageEmitter from "../utils/Messenger";
import HyviewClient from "../lib/client/Client";


module.exports = {
  data: new SlashCommandBuilder()
    .setName("guild")
    .setDescription("Views data about a given guild.")
    .addStringOption((o) => {
      return o
        .setName("guild_name")
        .setDescription(
          "The name of the guild."
        );
    }),
    
  exec: (i: CommandInteraction, c: HyviewClient, h: Client) => {
    i.reply({ embeds: [c.embed({ desc: new MessageEmitter().FEATURE_NOT_YET_ENABLED(), type: "INFO" })]});
  },
}
