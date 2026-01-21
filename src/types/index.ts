// Tipos para reservaciones
export interface TimeSlot {
  time: string; // Formato HH:MM
  isReserved: boolean;
  reservationId?: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  numberOfGuests?: number;
  createdAt?: string; // Fecha y hora de creación de la reserva
  date?: string; // Fecha de la reserva
  tableNumbers?: number[]; // Mesas asignadas a la reserva
  status?: string; // Estado de la reserva
}

export interface Table {
  id: number;
  tableNumber: number;
  capacity: number; // cantidad de personas
  timeSlots: TimeSlot[]; // slots de 45 minutos
}

export interface Notification {
  id: string;
  type: "reservation" | "cancellation" | "modification" | "info";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  tableId?: number;
}

export interface AdminDashboardState {
  tables: Table[];
  notifications: Notification[];
  selectedTable?: Table;
}
