import { model, Schema } from "mongoose";

const s = new Schema({
  id: {
    type: String,
    required: true,
  },
  joined: Date,
});

const m = model("BetaProgramMember", s);

export { m };
