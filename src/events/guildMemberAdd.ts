import { userMention } from "@discordjs/builders";
import { GuildMember, GuildMemberRoleManager, Message, MessageActionRow, MessageAttachment, MessageButton, TextChannel } from "discord.js";
import HyviewClient from "../lib/client/Client";
import Captcha from "@haileybot/captcha-generator";
import Emojis from "../utils/Emojis";

module.exports = {
	name: 'guildMemberAdd',
	once: false,
	async exec(m: GuildMember) {
		
		(m.client as HyviewClient).logger.userJoin(m.user, m.guild);

		var ca = new Captcha();
		const chars = ca.value.split("");

		var tries = 0;

		const a = new MessageAttachment(ca.JPEGStream, "captcha.png");
		
		function generateCodes(c: string): string[] {

			var n = 0;
			var strings: string[] = [];
			const randomChar = () => chars[Math.floor(Math.random() * chars.length)];

			do {
				strings.push(`${randomChar()}${randomChar()}${randomChar()}${randomChar()}${randomChar()}${randomChar()}`);
				n++;
			} while (n <= 4);

			return strings;
		}
		
		const codes = generateCodes(ca.value);
		codes[Math.floor(Math.random() * chars.length)] = ca.value;

		const buttons = new MessageActionRow();

		for (const code of codes) {

			buttons.addComponents(
				new MessageButton()
					.setLabel(code)
					.setStyle("SECONDARY")
					.setCustomId("captchabutton_" + (codes.indexOf(code) + 1))
			)

		};
		
		const msg = await (m.guild.channels.cache.get("894891348254146560") as TextChannel).send({ embeds: [(m.client as HyviewClient).embed({ desc: `Welcome, ${userMention(m.id)}! Complete the captcha below to join the server.`, type: "INFO" }).setImage("attachment://captcha.png")], files: [a], components: [buttons] });

		m.client.on("interactionCreate", async i => {

			if (i.isButton()) {

				tries++;

				if (codes[parseInt(i.customId.charAt(14))-1] === ca.value) {
					(i.member?.roles as GuildMemberRoleManager).add("894890539890122802");
					i.reply({ embeds: [(m.client as HyviewClient).embed({ desc: Emojis.TickSuccess + " All done! Welcome to Hyview :D", type: "SUCCESS" })], ephemeral: true });
					await msg.delete();
					(m.client as HyviewClient).logger.userVerify(m.user, tries);
				} else {
					i.reply({ ephemeral: true, embeds: [(m.client as HyviewClient).embed({ desc: Emojis.CrossDanger + "That's not the code. Try again."})] });
				}
			}

		});

    },
};