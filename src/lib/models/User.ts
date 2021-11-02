import { model, Schema } from "mongoose";

const s = new Schema({
  discord_id: {
    type: String,
    required: true,
  },
  linked: Boolean,
  hyview_staff: {
    type: Boolean,
    default: false,
  },
  hypixel_staff: {
    type: Boolean,
    default: false,
  },
  uuid: String,
  rank: {
    type: String,
    default: "Default",
  },
  lvl: {
    type: Number,
    default: 0,
  },
});

const m = model("User", s);

export { m };
