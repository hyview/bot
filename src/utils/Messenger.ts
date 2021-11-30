import * as Emojis from "../utils/Emojis";

export default class MessageEmitter {
  public link = new LinkCommandMessageEmitter();
  public profile = new ProfileCommandMessageEmitter();
  public beta = new BetaProgramMessageEmitter();
  public events = new EventMessageEmitter();

  GENERIC_ERROR(e: any): string {
    return (
      "An unexpected error has occured. Please report it to the development team, and show them this stack trace: \n`" +
      e.stack +
      "`"
    );
  }

  STAFF_ONLY(): string {
    return (
      Emojis.default.ShieldInfo +
      " You need to be a Hyview staff member to use this command!"
    );
  }

  SENIOR_STAFF_ONLY(): string {
    return (
      Emojis.default.ShieldInfo +
      " You need to be a Hyview senior staff member to use this command!"
    );
  }

  FEATURE_NOT_YET_ENABLED(): string {
    return (
      Emojis.default.ShieldInfo +
      "Steady on! We're still working on this feature."
    )
  }
}

class LinkCommandMessageEmitter {
  constructor() {}

  DB_RECORD_EXISTS(): string {
    return (
      Emojis.default.TickInfo +
      " We found an existing record for your Discord account in our database, now attempting to link your Minecraft account."
    );
  }

  DB_RECORD_NOT_EXISTS_SO_CREATED(): string {
    return (
      Emojis.default.TickInfo +
      " You weren't in our database so we've created a record for your Discord account, now attempting to link your Minecraft account."
    );
  }

  PLAYER_DOES_NOT_EXIST(): string {
    return (
      Emojis.default.ExclamationWarning +
      " Looks like that Minecraft player doesn't exist!"
    );
  }

  PLAYER_HAS_NOT_LOGGED(): string {
    return (
      Emojis.default.ExclamationWarning +
      " Looks like that Minecraft player has never logged into Hypixel!"
    );
  }

  ACCOUNT_NOT_LINKED_ON_HYPIXEL(): string {
    return (
      Emojis.default.QuestionWarning +
      " Looks like you don't have a Discord account linked on Hypixel! Log on and add it to your social media connections."
    );
  }

  TAG_DOES_NOT_MATCH(l: string): string {
    return (
      Emojis.default.TickInfo +
      " We found a Discord account on your Hypixel profile (" +
      l +
      "), but it doesn't match your current tag. If you changed your tag since you connected your Discord account to Hypixel, you will need to log in to Hypixel, un-register your account and then re-register it to reset the issue."
    );
  }

  ALREADY_LINKED(): string {
    return (
      Emojis.default.TickInfo +
      " You already have a linked Minecraft account in our database! Contact the Hyview staff team if this is in error."
    );
  }

  DISCORD_ACCOUNT_FOUND(t: string): string {
    return (
      Emojis.default.TickSuccess +
      " We found this Discord account on your Hypixel profile: " +
      t
    );
  }
}

class ProfileCommandMessageEmitter {
  constructor() {}

  MC_USERNAME_DEPWARN(): string {
    return (
      Emojis.default.ShieldWarning +
      " Using a Minecraft username for /profile is not recommended as the user's account may not be linked."
    );
  }

  WARNING_CANNOT_FETCH_DISCORD_DATA(): string {
    return 'Unfortunately we cannot fetch data about the user\'s Discord profile using this method. To view their Discord profile, do /profile and supply a value for "discord"';
  }

  PLAYER_DOES_NOT_EXIST(): string {
    return (
      Emojis.default.CrossDanger +
      " That player doesn't seem to exist or has never logged into Hypixel."
    );
  }

  
  PLAYER_NOT_IN_DB(): string {
    return (
      Emojis.default.CrossDanger +
      " That player seems to not have linked their account with our servers so we can't show Discord data about them. Try inputting their Minecraft username instead."
    );
  }
}

class BetaProgramMessageEmitter {
  ADDED_USER(): string {
    return "Successfully added that user to the beta program. Briefing them now.";
  }

  ALREADY_ADDED_USER(): string {
    return (
      Emojis.default.CrossDanger +
      " That user has already been added to the program!"
    );
  }

  REF_USER(): string {
    return "Successfully refused that user's application to the beta program. Briefing them now.";
  }

  USER_JOIN_MSG(): string {
    return "Hello! I'm Hyview and I've been asked to contact you about our Closed Beta program beginning (if all goes well) on November 13th 2021. \n\nThank you for submitting your application. We're pleased to tell you that **your application has been accepted and you will be a part of the Hyview Closed Beta!** \n\n*What will the beta involve?*\n- Testing new features added to Hyview\n- Some activity on Hypixel to test whether statistics do successfully update\n- Giving feedback to help us fine-tune our systems, particularly our Leveling system.\n\nA member of our senior staff team will contact you within 24 hours.";
  }

  USER_REF_MSG(): string {
    return "Hello! I'm Hyview and I've been asked to contact you about our Closed Beta program beginning (if all goes well) on November 13th 2021. \n\nThank you for submitting your application. Unfortunately, your application has not been successful, and, as a result, you have not been invited to join our Closed Beta program. We thank you for your interest in the Project, and please do feel free to re-apply for our next beta phase when it happens.";
  }
}

class EventMessageEmitter {
  public guildMemberAdd = new GuildMemberAddMessageEmitter();
  public guildMemberUpdate = new GuildMemberUpdateMessageEmitter();
}

class GuildMemberAddMessageEmitter {
  NICKNAME_INAPPROPRIATE(nn: string, str: number): string {
    return (
      "Our tech elves have found " +
      str.toString() +
      " instance(s) of hard to read, inappropriate or confusing content in your Discord username so we've changed it to \"**" +
      nn +
      '**". You can change it at any time.'
    );
  }
}

class GuildMemberUpdateMessageEmitter {
  NICKNAME_INAPPROPRIATE(nn: string, str: number): string {
    return (
      "Our tech elves have found " +
      str.toString() +
      " instance(s) of hard to read, inappropriate or confusing content in your nickname so we've changed it to \"**" +
      nn +
      '**". You can change it at any time.'
    );
  }
}
