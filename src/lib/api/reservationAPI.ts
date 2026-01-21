import axios from "axios";

export interface ReservationPayload {
  name: string;
  email: string;
  phone: string;
  date: Date | string;
  time: string;
  guests: string | number;
}

// Usa la variable de entorno VITE_API_URL
// En desarrollo: http://localhost:8080/api
// En producción: https://api.lasierraerestaurant.com/api
const API_URL = import.meta.env.VITE_API_URL || "https://api.lasierraerestaurant.com/api";

console.log(`🔗 API URL: ${API_URL}`);

export const reservationAPI = {
  // Create a new reservation
  create: async (data: ReservationPayload) => {
    try {
      const response = await axios.post(`${API_URL}/reservations`, {
        ...data,
        guests: Number(data.guests),
        date: new Date(data.date),
      });
      return response.data;
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw error;
    }
  },

  // Get all reservations
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}/reservations`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reservations:", error);
      throw error;
    }
  },

  // Get reservation by ID
  getById: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/reservations/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reservation:", error);
      throw error;
    }
  },

  // Update reservation
  update: async (id: string, data: Partial<ReservationPayload>) => {
    try {
      const response = await axios.put(`${API_URL}/reservations/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating reservation:", error);
      throw error;
    }
  },

  // Delete reservation
  delete: async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/reservations/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting reservation:", error);
      throw error;
    }
  },
};
