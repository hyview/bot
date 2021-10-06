import { userMention } from "@discordjs/builders";
import { GuildMember, GuildMemberRoleManager, Message, MessageActionRow, MessageAttachment, MessageButton, TextChannel } from "discord.js";
import HyviewClient from "../lib/client/Client";
import Captcha from "@haileybot/captcha-generator";
import Emojis from "../utils/Emojis";

module.exports = {
	name: 'guildMemberRemove',
	once: false,
	async exec(m: GuildMember) {

		(m.client as HyviewClient).logger.userLeave(m.user, m.guild);

    },
};