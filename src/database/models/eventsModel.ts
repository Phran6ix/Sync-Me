import { Schema, model, Document, Types, ObjectId } from "mongoose";
import { IEvents } from "../../interfaces/events.interface";

const eventsSchema = new Schema(
  {
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
    completed: {
      type: Boolean,
      default: false,
    },

    time: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    _id: false,
    versionKey: false,
  }
);

eventsSchema.index({ completed: 1 });

const eventModel = model<IEvents & Document>("Event", eventsSchema);
export { eventModel as Events };
