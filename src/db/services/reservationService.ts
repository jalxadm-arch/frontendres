import { connectDB } from "../connection";
import Reservation, { IReservation } from "../models/Reservation";

export interface CreateReservationInput {
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
}

type ReservationFilter = Record<string, any>;

// Validate if a time slot is available
const isTimeSlotValid = (reservationDate: Date, timeSlot: string): boolean => {
  const now = new Date();
  const reservationTime = new Date(reservationDate);

  // Parse time slot (e.g., "8:00 AM" -> hours and minutes)
  const [time, period] = timeSlot.split(" ");
  const [hours, minutes] = time.split(":").map(Number);

  let hour24 = hours;
  if (period === "PM" && hours !== 12) {
    hour24 = hours + 12;
  } else if (period === "AM" && hours === 12) {
    hour24 = 0;
  }

  // Set the reservation time
  reservationTime.setHours(hour24, minutes, 0, 0);

  // Check if reservation time is in the future
  return reservationTime > now;
};

// Check if the time slot is already fully booked
const isTimeSlotBooked = async (
  reservationDate: Date,
  timeSlot: string
): Promise<boolean> => {
  try {
    // Get all confirmed/pending reservations for the same date and time
    const existingReservations = await Reservation.find({
      date: {
        $gte: new Date(reservationDate.getFullYear(), reservationDate.getMonth(), reservationDate.getDate()),
        $lt: new Date(reservationDate.getFullYear(), reservationDate.getMonth(), reservationDate.getDate() + 1),
      },
      time: timeSlot,
      status: { $in: ["confirmed", "pending"] },
    });

    // Maximum 31 tables available
    const totalTablesNeeded = existingReservations.reduce(
      (sum, res) => sum + (res.tableNumbers?.length || 1),
      0
    );

    return totalTablesNeeded >= 31;
  } catch (error) {
    console.error("Error checking time slot availability:", error);
    return false;
  }
};

// Get the next available table number
const getNextAvailableTable = async (): Promise<number> => {
  try {
    // Get all active reservations (not cancelled)
    const activeReservations = await Reservation.find({
      status: { $ne: "cancelled" },
    });

    // Get all assigned table numbers
    const assignedTables = new Set<number>();
    activeReservations.forEach((reservation) => {
      reservation.tableNumbers.forEach((tableNum) => {
        assignedTables.add(tableNum);
      });
    });

    // Find the first available table (1-31)
    for (let tableNum = 1; tableNum <= 31; tableNum++) {
      if (!assignedTables.has(tableNum)) {
        return tableNum;
      }
    }

    // If all tables are taken, restart from table 1
    return 1;
  } catch (error) {
    console.error("Error getting next available table:", error);
    throw error;
  }
};

export const createReservation = async (
  data: CreateReservationInput
): Promise<IReservation> => {
  try {
    await connectDB();

    // Validate that the time slot is in the future
    if (!isTimeSlotValid(data.date, data.time)) {
      throw new Error("Invalid reservation time. Please select a future time slot.");
    }

    // Check if the time slot is already fully booked
    const isBooked = await isTimeSlotBooked(data.date, data.time);
    if (isBooked) {
      throw new Error("This time slot is fully booked. Please select another time.");
    }

    // Get the next available table
    const tableNumber = await getNextAvailableTable();

    const reservation = new Reservation({
      ...data,
      tableNumbers: [tableNumber],
      status: "confirmed",
    });

    await reservation.save();
    console.log("Reservation created successfully:", reservation);
    return reservation;
  } catch (error) {
    console.error("Error creating reservation:", error);
    throw error;
  }
};

export const getReservations = async (
  filters?: ReservationFilter
): Promise<IReservation[]> => {
  try {
    await connectDB();
    const reservations = await Reservation.find(filters || {}).sort({
      createdAt: -1,
    });
    return reservations;
  } catch (error) {
    console.error("Error fetching reservations:", error);
    throw error;
  }
};

export const getReservationById = async (
  id: string
): Promise<IReservation | null> => {
  try {
    await connectDB();
    const reservation = await Reservation.findById(id);
    return reservation;
  } catch (error) {
    console.error("Error fetching reservation:", error);
    throw error;
  }
};

export const updateReservation = async (
  id: string,
  updateData: ReservationFilter
): Promise<IReservation | null> => {
  try {
    await connectDB();
    const reservation = await Reservation.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    return reservation;
  } catch (error) {
    console.error("Error updating reservation:", error);
    throw error;
  }
};

export const deleteReservation = async (id: string): Promise<boolean> => {
  try {
    await connectDB();
    const result = await Reservation.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error("Error deleting reservation:", error);
    throw error;
  }
};
