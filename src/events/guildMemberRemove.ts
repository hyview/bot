import { GuildMember } from "discord.js";
import HyviewClient from "../lib/client/Client";

module.exports = {
  name: "guildMemberRemove",
  once: false,
  async exec(m: GuildMember) {
    (m.client as HyviewClient).logger.userLeave(m.user, m.guild);
  },
};
