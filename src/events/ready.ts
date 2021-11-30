import HyviewClient from "../lib/client/Client";

module.exports = {
  name: "ready",
  once: false,
  async exec(c: HyviewClient) {
    c.user?.setActivity({ type: "WATCHING", name: "over " + c.guilds.cache.get("893570416617066618")?.memberCount + " people" })
  },
};
