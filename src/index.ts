import { config } from "dotenv";
import HyviewClient from "./lib/client/Client";

import * as Hypixel from "hypixel-api-reborn";
import mongoose from "mongoose";
const fs = require("fs");

config();

mongoose.connect("mongodb://localhost:27017/hylink");

const client = new HyviewClient();
const hypixel = new Hypixel.Client(process.env.HYPIXEL_KEY as string);

const commandFiles = fs
  .readdirSync("./src/commands")
  .filter((file: string) => file.endsWith(".ts"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on("ready", async () => {
  await client.console.wordmark();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.exec(interaction, client, hypixel);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file: string) => file.endsWith(".ts"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.exec(...args));
  } else {
    client.on(event.name, (...args) => event.exec(...args));
  }
}

client.login(process.env.TOKEN);
