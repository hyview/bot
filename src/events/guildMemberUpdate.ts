import { GuildMember } from "discord.js";
import HyviewClient from "../lib/client/Client";

module.exports = {
  name: "guildMemberUpdate",
  once: false,
  async exec(o: GuildMember, n: GuildMember) {
    if (o.nickname !== n.nickname) {
      const t = new Date();
      t.setSeconds(t.getSeconds() - 30);

      var pt = o.joinedAt as Date;

      if (t > pt) {
        (n.client as HyviewClient).logger.userNicknameChange(
          n.user,
          o.nickname === null ? "No nickname" : (o.nickname as string),
          n.nickname === null ? "No nickname" : (n.nickname as string)
        );
      }
    } else if (o.roles !== n.roles) {
      o.roles.cache.forEach((r) => {
        if (!n.roles.cache.has(r.id)) {
          (n.client as HyviewClient).logger.userRoleRemove(n.user, r.name);
        }
      });

      n.roles.cache.forEach((r) => {
        if (!o.roles.cache.has(r.id)) {
          (n.client as HyviewClient).logger.userRoleAdd(n.user, r.name);
        }
      });
    }
  },
};
