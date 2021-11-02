import { model, Schema } from "mongoose";

const s = new Schema({
  host_uuid: {
    type: String,
    required: true,
  },
  members: [],
  games: [],
});

const m = model("Party", s);

export { m };
