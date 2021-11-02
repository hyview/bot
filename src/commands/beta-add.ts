import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMemberRoleManager } from "discord.js";
import Hypixel, { Client } from "hypixel-api-reborn";
import HyviewClient from "../lib/client/Client";
import MessageEmitter from "../utils/Messenger";
import * as HyviewModels from "../lib/models/index";
import Emojis from "../utils/Emojis";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("beta-add")
    .setDescription("Add users to the closed beta program.")
    .addStringOption((o) =>
      o
        .setName("id")
        .setDescription("The ID of the user to add to the program.")
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
      if (
        await HyviewModels.BetaProgramMember.exists({
          id: i.options.getString("id", true),
        })
      ) {
        i.reply({
          embeds: [
            c.embed({
              desc: new MessageEmitter().beta.ALREADY_ADDED_USER(),
              type: "DANGER",
            }),
          ],
        });
      } else {
        HyviewModels.BetaProgramMember.create({
          id: i.options.getString("id"),
          joined: Date.now(),
        });

        i.reply({
          embeds: [
            c.embed({
              desc: Emojis.TickSuccess + new MessageEmitter().beta.ADDED_USER(),
              type: "SUCCESS",
            }),
          ],
        });

        c.users.cache
          .get(i.options.getString("id", true))
          ?.send({
            embeds: [
              c.embed({
                desc: new MessageEmitter().beta.USER_JOIN_MSG(),
                type: "ACCENT2",
              }),
            ],
          });
      }
    }
  },
};
