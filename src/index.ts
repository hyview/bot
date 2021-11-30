import HyviewClient from "./lib/client/Client";
import { config } from "dotenv";
config();
const client = new HyviewClient();
client.start();