/**
 * NOTA: Este archivo ya no se necesita
 * 
 * Antes se usaba para documentar rutas locales, pero ahora que
 * el backend está en un servidor separado (api.lasierraerestaurant.com),
 * todas las rutas están documentadas en:
 * 
 * - backend/README.md (con ejemplos de curl)
 * - backend/server.js (código del API)
 * 
 * Las llamadas al API se hacen a través de reservationAPI.ts
 * que usa VITE_API_URL como base URL.
 * 
 * PUEDES ELIMINAR ESTE ARCHIVO
 */

export const API_ENDPOINTS = {
  RESERVATIONS: "/reservations",
  RESERVATION_BY_ID: (id: string) => `/reservations/${id}`,
};

