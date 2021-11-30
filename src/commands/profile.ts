import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Formatters, Message, User } from "discord.js";
import { Client as HypixelClient } from "hypixel-api-reborn";
import * as HyviewModels from "../lib/models";
import MessageEmitter from "../utils/Messenger";
import HyviewClient from "../lib/client/Client";
import Emojis from "../utils/Emojis";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Views the profile of a given player")
    .addUserOption((u) => {
      return u
        .setName("discord")
        .setDescription("The Discord user of the player (recommended)");
    })
    .addStringOption((o) => {
      return o
        .setName("minecraft")
        .setDescription(
          "The Minecraft username of the player (not recommended)"
        );
    }),
  exec: async (i: CommandInteraction, c: HyviewClient, h: HypixelClient) => {
    if (i.options.getString("minecraft") !== null) {
      i.reply({
        embeds: [
          c.embed({
            desc: new MessageEmitter().profile.MC_USERNAME_DEPWARN(),
            type: "WARNING",
          }),
        ],
      });
      getProfile(i.options.getString("minecraft", true));
    } else {
      getProfile(i.options.getUser("discord", true));
    }

    async function getProfile(arg: User | string) {
      if (arg instanceof User) {
        const doc = await HyviewModels.User.findOne({ discord_id: arg.id });
        if (doc !== null) {
          const uuid = doc.get("uuid");

          const p = await h.getPlayer(uuid).then((p) => {
            if (p !== null) {
              return {
                username: p.nickname,
                rank: p.rank,
                online: p.isOnline,
                lvl: Math.floor(p.level).toString(),
                guild: p.guild?.name,
              };
            } else {
              i.reply({
                embeds: [
                  c.embed({
                    desc: new MessageEmitter().profile.PLAYER_DOES_NOT_EXIST(),
                    type: "DANGER",
                  }),
                ],
              });
            }
          });

          if (p) {
            const hs = await c.isHyviewStaff(arg).valueOf();

            const em = c.embed({
              name:
                (hs
                  ? Emojis.HyviewStaff + " "
                  : c.fetchRankProps(p.rank)?.emoji + " ") +
                Formatters.bold(p.username) +
                (p.online ? " (online)" : " (offline)"),
              desc:
                p.username +
                " has " +
                Formatters.bold(p.rank) +
                " rank. Their Hypixel level is " +
                p.lvl +
                ".",
              main: [
                {
                  name: "Hyview Level",
                  value: doc.get("lvl").toString(),
                  inline: true,
                },
                {
                  name: "Guild",
                  value: p.guild ? p.guild : "None",
                  inline: true,
                },
                {
                  name: "Current game",
                  value:
                    (await h.getStatus(p.username)).game?.name === undefined
                      ? "N/A"
                      : ((await h.getStatus(p.username)).game?.name as string),
                  inline: true,
                },
              ],
              img: "https://crafatar.com/renders/head/" + uuid,
              color: hs ? "#de5667" : c.fetchRankProps(p.rank)?.rankColor,
            });

            i.replied
              ? i.editReply({ embeds: [em] })
              : i.reply({ embeds: [em] });
          }
        } else {
          i.reply({ embeds: [c.embed({ desc: new MessageEmitter().profile.PLAYER_NOT_IN_DB(), type: "DANGER" })] })
        }
      } else {
        const p = await h
          .getPlayer(i.options.getString("minecraft", true), { guild: true })
          .then((p) => {
            if (p !== null) {
              return {
                username: p.nickname,
                rank: p.rank,
                online: p.isOnline,
                lvl: Math.floor(p.level).toString(),
                guild: p.guild?.name,
                uuid: p.uuid,
              };
            } else {
            }
          });

        if (p) {
          const em = c.embed({
            name:
              c.fetchRankProps(p.rank)?.emoji +
              " " +
              Formatters.bold(p.username) +
              (p.online ? " (online)" : " (offline)"),
            desc: p.username + " has " + Formatters.bold(p.rank) + " rank.",
            main: [
              { name: "Level", value: p.lvl, inline: true },
              {
                name: "Guild",
                value: p.guild !== undefined ? p.guild : "None",
                inline: true,
              },
              {
                name: "Current game",
                value:
                  (await h.getStatus(p.username)).game?.name === undefined
                    ? p.online
                      ? "In a lobby"
                      : "(offline)"
                    : ((await h.getStatus(p.username)).game?.name as string),
                inline: true,
              },
            ],
            footer:
              new MessageEmitter().profile.WARNING_CANNOT_FETCH_DISCORD_DATA(),
            img: "https://crafatar.com/renders/head/" + p.uuid,
            color: c.fetchRankProps(p.rank)?.rankColor,
          });

          i.replied ? i.editReply({ embeds: [em] }) : i.reply({ embeds: [em] });
        }
      }
    }
  },
};
