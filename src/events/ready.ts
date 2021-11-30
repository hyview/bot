import HyviewClient from "../lib/client/Client";

module.exports = {
  name: "guildMemberRemove",
  once: false,
  async exec(c: HyviewClient) {
    this.user?.setActivity({ type: "WATCHING", name: "over the people of Hypixel" })
  },
};
