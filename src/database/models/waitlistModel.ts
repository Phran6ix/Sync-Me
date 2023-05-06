import { model, Schema, Document, Types } from "mongoose";
import { IWaitlist } from "../../interfaces/waitlist.interface";

const waitingSchema = new Schema({
  group: {
    type: Types.ObjectId,
    ref: "Group",
  },
  waiting: [
    {
      user: {
        type: Types.ObjectId,
        ref: "User",
      },
      accepted: {
        type: Boolean,
        default: false,
      },
      createdOn: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const waitingModel = model<IWaitlist & Document>("Waiting", waitingSchema);

export { waitingModel as Waitlist };
