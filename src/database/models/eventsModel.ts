import { Schema, model, Document, Types, ObjectId } from "mongoose";
import { IGroup } from "./groupModel";
import { IEvents } from "../../interfaces/events.interface";

const eventsSchema = new Schema({
  group: {
    type: Types.ObjectId,
    required: true,
    ref: "Group",
  },
  description: {
    type: String,
    required: [true, "Input events description"],
  },
  photo: {
    type: String,
  },
  date: {
    type: Date,
  },
  location: {
    type: String,
  },
  created_on: {
    type: Date,
    defaut: Date.now(),
  },
  time: {
    type: String,
  },
});

const eventModel = model<IEvents & Document>("Event", eventsSchema);
export { eventModel as Events };
