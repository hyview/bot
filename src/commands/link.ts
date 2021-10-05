import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import MessageEmitter from "../utils/Messenger";
import Hypixel, { Client } from "hypixel-api-reborn";
import HyviewClient from "../lib/client/Client";
import * as HyviewModels from "../lib/models";
import * as Emojis from "../utils/Emojis";

module.exports = {

    data: new SlashCommandBuilder()
            .setName("link")
            .setDescription("Links your account to your Hypixel profile.")
            .addStringOption(o => {
                return o.setName("username").setDescription("The username of the your Minecraft account").setRequired(true);
            }),
    exec: async (i: CommandInteraction, c: HyviewClient, h: Client) => {

        const e = await HyviewModels.User.exists({ discord_id: i.user.id });

        if (e) {
            i.reply({ embeds: [c.embed({ desc: new MessageEmitter().link.DB_RECORD_EXISTS(), type: "INFO" })]})
            linkAccount(i);
        } else {
            await HyviewModels.User.create({ discord_id: i.user.id }).then(d => {
                i.reply({ embeds: [c.embed({ desc: new MessageEmitter().link.DB_RECORD_NOT_EXISTS_SO_CREATED(), type: "INFO" })]});
                linkAccount(i);
            })
        }

        async function linkAccount(i: CommandInteraction) {
            var isLinked: any[];
            const r = await HyviewModels.User.findOne({ discord_id: i.user.id });
            var d;

            try {
                d = await h.getPlayer(i.options.getString("username", true));
                isLinked = await h.getPlayer(i.options.getString("username", true)).then(player => {
                    const d = player.socialMedia.filter(i => i.id == "DISCORD");
                    return d;
                })
            } catch (e: any) {

                switch(e.message) {
                    case (Hypixel.Errors.PLAYER_DOES_NOT_EXIST):
                        i.followUp({ embeds: [c.embed({ desc: new MessageEmitter().link.PLAYER_DOES_NOT_EXIST(), type: "WARNING" })]})
                        return;
                        break;
                    case (Hypixel.Errors.PLAYER_HAS_NEVER_LOGGED):
                        i.followUp({ embeds: [c.embed({ desc: new MessageEmitter().link.PLAYER_HAS_NOT_LOGGED(), type: "WARNING" })]})
                        return;
                        break;
                    default:
                        i.followUp({ embeds: [c.embed({ desc: new MessageEmitter().GENERIC_ERROR(e), type: "DANGER"})]})
                        return;
                        break;
                }
               
            }

            if (r && r.get("uuid")) {
                i.editReply({ embeds: [c.embed({ desc: new MessageEmitter().link.ALREADY_LINKED(), type: "INFO" })] })
            } else {
                if (isLinked.length === 0) {                    
                    i.replied ? i.editReply({ embeds: [c.embed({ desc: new MessageEmitter().link.ACCOUNT_NOT_LINKED_ON_HYPIXEL(), type: "WARNING"})] }) : i.reply({ embeds: [c.embed({ desc: new MessageEmitter().link.ACCOUNT_NOT_LINKED_ON_HYPIXEL(), type: "WARNING"})] });
                } else {
                    if (isLinked[0].link !== i.user.tag) {
                        i.replied ? i.editReply({ embeds: [c.embed({ desc: new MessageEmitter().link.TAG_DOES_NOT_MATCH(isLinked[0].link), type: "INFO"})] }) : i.reply({ embeds: [c.embed({ desc: new MessageEmitter().link.TAG_DOES_NOT_MATCH(isLinked[0].link), type: "INFO"})] });
                        return;
                    } else {
                        console.log(isLinked[0].link)
                        i.replied ? i.editReply({ embeds: [c.embed({ desc: new MessageEmitter().link.DISCORD_ACCOUNT_FOUND(isLinked[0].link), type: "SUCCESS"})] }) : i.reply({ embeds: [c.embed({ desc: Emojis.default.TickSuccess + " We found this Discord account on your Hypixel profile: " + isLinked[0].link, type: "SUCCESS"})] });
                        if (!r) {
                            i.followUp({ embeds: [c.embed({ desc: "An unexpected error has occured. Please report it to the development team, and tell them the following:\n`The \"commands/link.ts\" file returned null when fetching a Hypixel player in line 35. Please correct this.`"})]})
                            return;
                        } else {
                            r.set("uuid", d.uuid);
                            await r?.save().then(() => {
                                i.followUp({ embeds: [c.embed({ desc: Emojis.default.TickSuccess + " Successfully linked \"" + i.options.getString("username") + "\" to your Discord account.", type: "SUCCESS" })]})
                            })
                        }
                    }
                }
            }

        }

    }

};

