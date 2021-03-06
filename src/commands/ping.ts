import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import Hypixel, { Client } from "hypixel-api-reborn";
import HyviewClient from "../lib/client/Client";
import * as Emojis from "../utils/Emojis";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Sends you some uptime information."),
  exec: async (i: CommandInteraction, c: HyviewClient, h: Client) => {
    const e = c.embed({
      desc: `๐ API Latency: ${c.ws.ping}ms\n๐จโ๐จโ๐งโ๐ง Shards: ${
        c.ws.shards.size
      } shard(s)\n๐ Uptime: ${c.convertTime(
        c.uptime as number
      )}\n ๐ฅ Hypixel API Status: ${
        (await h.getAPIStatus()).currentIncidents.length > 0
          ? "Degraded, see https://status.hypixel.net"
          : "All clear"
      }`,
      type: "INFO",
    });
    i.reply({ embeds: [e] });
  },
};
