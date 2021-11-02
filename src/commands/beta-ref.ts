import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMemberRoleManager } from "discord.js";
import Hypixel, { Client } from "hypixel-api-reborn";
import HyviewClient from "../lib/client/Client";
import MessageEmitter from "../utils/Messenger";
import Emojis from "../utils/Emojis";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("beta-ref")
    .setDescription("Refuses a users's application to the closed beta program.")
    .addStringOption((o) =>
      o
        .setName("id")
        .setDescription("The ID of the user to refuse.")
        .setRequired(true)
    ),
  exec: async (i: CommandInteraction, c: HyviewClient, h: Client) => {
    if (
      !(i.member?.roles as GuildMemberRoleManager).cache.has(
        "893855547676311582"
      )
    ) {
      i.reply({
        embeds: [
          c.embed({ desc: new MessageEmitter().STAFF_ONLY(), type: "INFO" }),
        ],
      });
    } else if (
      !(i.member?.roles as GuildMemberRoleManager).cache.has(
        "894878886654017567"
      )
    ) {
      i.reply({
        embeds: [
          c.embed({
            desc: new MessageEmitter().SENIOR_STAFF_ONLY(),
            type: "INFO",
          }),
        ],
      });
    } else {
      i.reply({
        embeds: [
          c.embed({
            desc: Emojis.TickSuccess + new MessageEmitter().beta.REF_USER(),
            type: "SUCCESS",
          }),
        ],
      });

      c.users.cache
        .get(i.options.getString("id", true))
        ?.send({
          embeds: [
            c.embed({
              desc: new MessageEmitter().beta.USER_REF_MSG(),
              type: "ACCENT2",
            }),
          ],
        });
    }
  },
};
