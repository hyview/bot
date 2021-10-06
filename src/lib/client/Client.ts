import { Client, Collection, ColorResolvable, EmbedField, Guild, MessageEmbed, TextChannel, User } from "discord.js";
import { PLAYER_RANK } from "hypixel-api-reborn";
import Emojis from "../../utils/Emojis";
import Command from "../structures/Command";
import * as HyviewModels from "../models/index";
import chalk from "chalk";
import * as figlet from "figlet";
import { Spinner } from "cli-spinner";
import { config } from "dotenv";

export default class HyviewClient extends Client {

    public commands: Collection<string, Command> = new Collection();
    public console = new HyviewConsoleLogger();
    public logger = new HyviewChannelLogger(process.env.LOG as `${bigint}`, this)
    
    private _mccolorcodes = new MinecraftColorCodes();
    private _emojis = Emojis;

    constructor() {
        super({ intents: 32767 });

        config();
    }

    /**
     * Creates a message embed with the given parameters
     * @returns MessageEmbed
     */
    public embed(e: ClientEmbedOptions): MessageEmbed {
        const em = new MessageEmbed({ description: e.desc, fields: e.main || undefined, color: e.color ? e.color : this.validateEmbedType(e.type!), title: e.name || undefined, footer: { text: e.footer || undefined } });

        if (e.img !== undefined) { em.setThumbnail(e.img) };

        return em;
    }

    /**
     * Converts a ClientEmbedType to a relevant ColorResolvable
     * @param t A ClientEmbedType
     * @returns The relevant colour
     */
    private validateEmbedType(t: ClientEmbedType): ColorResolvable {

        var c: ColorResolvable;

        switch (t) {
            case "SUCCESS":
                c = "#4BFF7E"
                break;
            case "INFO":
                c = "#827DFF"
                break;
            case "WARNING":
                c = "#FFC27D"
                break;
            case "DANGER":
                c = "#FC5050"
                break;
            case "ACCENT1":
                c = "#FF7300"
                break;
            case "ACCENT2":
                c = "#BA37D7"
                break;
            default:
                c = "#060029";
                break;
        }

        return c;
    }

    /**
     * Converts a Hypixel rank returned by hypixel-api-reborn to a relevant ColorResolvable
     * @param t A string returned by hypixel-api-reborn
     * @returns The relevant colour
     */
    public validateRankColour(t: string): ColorResolvable {
        var c: ColorResolvable;
        
        switch (t) {
            case "DEFAULT":
                c = this._mccolorcodes.LIGHT_GREY as ColorResolvable;
                break;
            case "VIP":
            case "VIP+":
                c = this._mccolorcodes.GREEN as ColorResolvable;
                break;
            case "MVP":
            case "MVP+":
                c = this._mccolorcodes.AQUA as ColorResolvable;
                break;
            case "MVP++":
            case "EVENTS":
            case "MOJANG":
                c = this._mccolorcodes.GOLD as ColorResolvable;
                break;
            case "YOUTUBE":
            case "Admin":
            case "OWNER":
                c = this._mccolorcodes.RED as ColorResolvable;
                break;
            case "Game Master":
                c = this._mccolorcodes.DARK_GREEN as ColorResolvable;
                break;
            default:
                c = this._mccolorcodes.LIGHT_GREY as ColorResolvable;
                break;
        }

        return c;

    };

    /**
     * Takes in a rank from hypixel-api-reborn and outputs a boolean denoting whether it's a staff role.
     * @param r The rank of the staff member
     * @returns A boolean value denoting whether the user is staff
     * @deprecated Use **fetchRankProps** instead 
     */
    public isHypixelStaff(r: string | undefined): boolean {
        var t: boolean;

        switch (r) {
            case "Game Master":
            case undefined:
            case "OWNER":
            case "Admin":
            case "EVENTS":
                t = true;
                break;
            default:
                t = false
        }

        return t;
    }

    public async isHyviewStaff(u: User): Promise<boolean> {
        const doc = await HyviewModels.User.findOne({ discord_id: u.id });
        return doc?.get("hyview_staff") as boolean;
    }

    /**
     * Takes in a rank from hypixel-api-reborn and outputs an object with relevant info
     * @param r The rank of the staff member
     * @returns An object containing the rank of the user, their rank colour and the relevant prefix icon.
     */
    public fetchRankProps(r: string | undefined): RankProps | undefined {

        var d: RankProps;

        switch (r) {
            case "VIP":
                d = { rank: "VIP", rankColor: this._mccolorcodes.GREEN as ColorResolvable, emoji: this._emojis.VIPIcon };
                break;
            case "VIP+":
                d = { rank: "VIP+", rankColor: this._mccolorcodes.GREEN as ColorResolvable, emoji: this._emojis.VIPPlusIcon };
                break;
            case "MVP":
                d = { rank: "MVP", rankColor: this._mccolorcodes.AQUA as ColorResolvable, emoji: this._emojis.MVPIcon };
                break;
            case "MVP+":
                d = { rank: "MVP+", rankColor: this._mccolorcodes.AQUA as ColorResolvable, emoji: this._emojis.MVPPlusIcon };
                break;
            case "MVP++":
                d = { rank: "MVP++", rankColor: this._mccolorcodes.GOLD as ColorResolvable, emoji: this._emojis.MVPPlusPlusIcon };
                break;
            case "PIG+++":
                d = { rank: "PIG+++", rankColor: this._mccolorcodes.PURPLE as ColorResolvable, emoji: "" };
                break;
            case "Game Master":
                d = { rank: "Game Master", rankColor: this._mccolorcodes.DARK_GREEN as ColorResolvable, emoji: this._emojis.HypixelStaff };
                break;
            case "Admin":
                d = { rank: "Admin", rankColor: this._mccolorcodes.RED as ColorResolvable, emoji: this._emojis.HypixelStaff };
                break;
            case "OWNER":
                d = { rank: "Owner", rankColor: this._mccolorcodes.RED as ColorResolvable, emoji: this._emojis.HypixelStaff };
                break;
            default:
                d = { rank: "Default", rankColor: this._mccolorcodes.LIGHT_GREY as ColorResolvable, emoji: "" };
                break;
        }

        return d;
    }

    /**
     * Converts a timestamp to an humanly understandable string.
     * @param duration The timestamp
     * @returns A string in the format "HH:MM minutes"
     */
    public convertTime(duration: number): string {
        var seconds: string | number = Math.floor((duration/1000)%60)
            , minutes: string | number = Math.floor((duration/(1000*60))%60)
            , hours: string | number = Math.floor(duration/(1000*60*60)%24);
        
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        
        return hours + ":" + minutes + " minutes";
    }

}

class HyviewConsoleLogger {

    public async error(m: string): Promise<void> {
        console.log(chalk.bold.red("ERROR: ") + chalk.red(m))
    }

    public async info(m: string): Promise<void> {
        console.log(chalk.bold.blue("INFO: ") + chalk.blue(m))
    }

    public async wordmark(): Promise<void> {
        await figlet.text("Hyview", {
            font: "Ogre",
            horizontalLayout: 'default',
            verticalLayout: 'default',
            width: 160,
            whitespaceBreak: true
        }, (err, data) => {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(chalk.bold.magentaBright(data));
        });
    }

}

class HyviewChannelLogger {

    public channel;
    public client;

    constructor(c: `${bigint}`, cl: HyviewClient) {
        this.channel = c;
        this.client = cl;
    }

    public async userJoin(u: User, g: Guild): Promise<void> {
        (this.client.channels.cache.get(this.channel) as TextChannel).send({ embeds: [this.client.embed({ desc: `${u.tag} joined the server. We're now at ${g.memberCount-3} members.`, type: "SUCCESS" })] })
    }  

    public async userLeave(u: User, g: Guild): Promise<void> {
        (this.client.channels.cache.get(this.channel) as TextChannel).send({ embeds: [this.client.embed({ desc: `${u.tag} left the server. We're now at ${g.memberCount-3} members.`, type: "DANGER" })] })
    }  

    public async userVerify(u: User, t: Number): Promise<void> {
        (this.client.channels.cache.get(this.channel) as TextChannel).send({ embeds: [this.client.embed({ desc: `${u.tag} successfully verified after ${t} tries.`, type: "INFO" })] })
    }  
    
    public async userNicknameChange(u: User, b: string, a: string): Promise<void> {
        (this.client.channels.cache.get(this.channel) as TextChannel).send({ embeds: [this.client.embed({ desc: `${u.tag} changed their nickname.\n\n **Before:** ${b}\n**After:** ${a}`, type: "INFO" })] })
    } 

    public async userRoleAdd(u: User, r: string): Promise<void> {
        (this.client.channels.cache.get(this.channel) as TextChannel).send({ embeds: [this.client.embed({ desc: `${u.tag} was given **${r}** role.`, type: "SUCCESS" })] })
    }

    public async userRoleRemove(u: User, r: string): Promise<void> {
        (this.client.channels.cache.get(this.channel) as TextChannel).send({ embeds: [this.client.embed({ desc: `${u.tag} was removed from **${r}** role.`, type: "DANGER" })] })
    }

}

interface ClientEmbedOptions {
    name?: string,
    desc: string,
    footer?: string,
    color?: ColorResolvable,
    type?: ClientEmbedType,
    main?: EmbedField[],
    img?: string
}

type ClientEmbedType = "SUCCESS" | "INFO" | "WARNING" | "DANGER" | "ACCENT1" | "ACCENT2";

class MinecraftColorCodes {
    public RED = "#ff5555";
    public DARK_RED = "#aa0000";
    public GOLD = "#ffaa00";
    public YELLOW = "#ffff55";
    public GREEN = "#55ff55";
    public DARK_GREEN = "#00aa00";
    public AQUA = "#55ffff";
    public DARK_AQUA = "#00aaaa";
    public BLUE = "#5555ff";
    public DARK_BLUE = "#0000aa";
    public PURPLE = "#ff55ff";
    public PINK = "#ff55ff";
    public DARK_PURPLE = "#aa00aa";
    public WHITE = "#ffffff";
    public LIGHT_GREY = "#aaaaaa";
    public DARK_GREY = "#555555";
    public BLACK = "#000000";
}

interface RankProps {
    rankColor: ColorResolvable,
    rank: string,
    emoji: string
}