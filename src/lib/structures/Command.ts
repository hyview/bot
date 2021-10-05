import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Client } from "hypixel-api-reborn";
import HyviewClient from "../client/Client";

export default interface Command {
    data: SlashCommandBuilder,
    exec: (i: CommandInteraction, c: HyviewClient, h: Client) => void
}