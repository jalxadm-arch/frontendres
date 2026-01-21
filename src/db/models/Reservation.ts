import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
  tableNumbers: number[];
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema = new Schema<IReservation>(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name is too long"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Please provide a phone number"],
      trim: true,
      minlength: [10, "Phone number must be at least 10 digits"],
      maxlength: [15, "Phone number is too long"],
    },
    date: {
      type: Date,
      required: [true, "Please provide a reservation date"],
    },
    time: {
      type: String,
      required: [true, "Please provide a time slot"],
    },
    guests: {
      type: Number,
      required: [true, "Please provide the number of guests"],
      min: [1, "At least 1 guest is required"],
      max: [8, "Maximum 8 guests allowed"],
    },
    tableNumbers: {
      type: [Number],
      required: [true, "Table numbers must be assigned"],
      validate: {
        validator: function(v: number[]) {
          return v.length === 1 || v.length === 2;
        },
        message: "Must have 1 or 2 tables assigned"
      }
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
ReservationSchema.index({ email: 1 });
ReservationSchema.index({ date: 1 });
ReservationSchema.index({ status: 1 });

const Reservation =
  mongoose.models.Reservation ||
  mongoose.model<IReservation>("Reservation", ReservationSchema);

export default Reservation;
