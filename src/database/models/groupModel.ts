import { Document, Schema, model, Types } from "mongoose";

import { IGroup } from "../../interfaces/group.interface";

const groupSchema = new Schema({
  name: {
    type: String,
    required: [true, "Input the group name"],
  },
  description: {
    type: String,
  },
  members: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  createdBy: {
    type: Types.ObjectId,
    ref: "User",
  },
  created_on: {
    type: Date,
    default: Date.now,
  },
});

const groupModel = model<IGroup & Document>("Group", groupSchema);
export { groupModel as Group };
