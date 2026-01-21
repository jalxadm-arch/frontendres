import { useState } from "react";
import { Table as TableType } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Clock, ChevronDown, ChevronUp, Calendar } from "lucide-react";

interface TableCardProps {
  table: TableType;
  onSelectTable?: (table: TableType) => void;
  onSelectReservation?: (reservation: any) => void;
}

export const TableCard = ({ table, onSelectTable, onSelectReservation }: TableCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Validar si una franja horaria está en el futuro (considerando la fecha)
  const isTimeFuture = (timeSlot: string, reservationDate?: string): boolean => {
    const now = new Date();
    
    if (!reservationDate) {
      // Si no hay fecha, usar hoy
      const [time, period] = timeSlot.split(" ");
      const [hours, minutes] = time.split(":").map(Number);

      let hour24 = hours;
      if (period === "PM" && hours !== 12) {
        hour24 = hours + 12;
      } else if (period === "AM" && hours === 12) {
        hour24 = 0;
      }

      const slotTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        hour24,
        minutes
      );
      const slotEnd = new Date(slotTime.getTime() + 45 * 60000);
      return now < slotEnd;
    }

    // Con fecha de reserva, comparar fecha completa
    const reservationDateObj = new Date(reservationDate);
    
    // Obtener la fecha local en formato YYYY-MM-DD
    const reservationLocalDate = new Date(
      reservationDateObj.getFullYear(),
      reservationDateObj.getMonth(),
      reservationDateObj.getDate()
    );
    
    const todayDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // Si la reserva es para una fecha futura, mostrar
    if (reservationLocalDate.getTime() > todayDate.getTime()) {
      return true;
    }

    // Si la reserva es para una fecha pasada, ocultar
    if (reservationLocalDate.getTime() < todayDate.getTime()) {
      return false;
    }

    // Si es hoy, comparar la hora
    const [time, period] = timeSlot.split(" ");
    const [hours, minutes] = time.split(":").map(Number);

    let hour24 = hours;
    if (period === "PM" && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === "AM" && hours === 12) {
      hour24 = 0;
    }

    const slotTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour24,
      minutes
    );
    const slotEnd = new Date(slotTime.getTime() + 45 * 60000);
    return now < slotEnd;
  };

  const reservedSlots = table.timeSlots.filter(
    (slot) => slot.isReserved && isTimeFuture(slot.time, slot.date)
  );
  
  // Debug: mostrar qué reservaciones se filtran
  if (table.tableNumber === 1 && table.timeSlots.some(s => s.isReserved)) {
    const allReserved = table.timeSlots.filter(s => s.isReserved);
    const now = new Date();
    console.log(`[TableCard] Mesa ${table.tableNumber}: Hora actual: ${now.toLocaleString()}`);
    allReserved.forEach(slot => {
      const isFuture = isTimeFuture(slot.time, slot.date);
      const resDate = slot.date ? new Date(slot.date).toLocaleDateString() : 'sin fecha';
      console.log(`  - ${slot.time} (Fecha: ${resDate}, ISO: ${slot.date}): ${isFuture ? "VISIBLE ✓" : "HIDDEN ✗"}`);
    });
  }
  
  // Ordenar franjas reservadas por fecha y hora de creación
  const sortedReservedSlots = [...reservedSlots].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return dateB.getTime() - dateA.getTime(); // Más recientes primero
  });

  const occupancyPercentage = Math.round(
    (reservedSlots.length / table.timeSlots.length) * 100
  );

  const getOccupancyColor = (percentage: number) => {
    if (percentage === 0) return "bg-green-100 text-green-800";
    if (percentage < 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Mesa {table.tableNumber}
            </h3>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{table.capacity} personas</span>
              </div>
            </div>
          </div>
          <Badge className={`${getOccupancyColor(occupancyPercentage)}`}>
            {occupancyPercentage}% Ocupada
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Resumen de franjas ocupadas */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-700">
              Reservaciones
            </p>
            <span className="text-xs text-gray-600">
              {reservedSlots.length} reservada{reservedSlots.length !== 1 ? "s" : ""}
            </span>
          </div>

          {reservedSlots.length === 0 ? (
            <div className="text-center py-4 text-gray-500 text-sm">
              No hay reservaciones para esta mesa
            </div>
          ) : (
            /* Timeline de franjas reservadas */
            <div className="space-y-2">
              {!isExpanded ? (
                // Vista resumida
                <div className="space-y-1">
                  {sortedReservedSlots.slice(0, 3).map((slot, idx) => (
                    <div
                      key={idx}
                      className="text-sm bg-red-50 p-3 rounded border border-red-200 cursor-pointer hover:bg-red-100 transition-colors"
                      onClick={() => onSelectReservation?.(slot)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-red-600" />
                          <span className="font-medium text-red-900">
                            {slot.time}
                          </span>
                        </div>
                        {slot.tableNumbers && slot.tableNumbers.length > 0 && (
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                            Mesa {slot.tableNumbers.join(", ")}
                          </span>
                        )}
                      </div>
                      <div className="ml-6 text-red-700 text-xs">
                        {slot.guestName} ({slot.numberOfGuests} pers.)
                      </div>
                      {slot.date && (
                        <div className="ml-6 text-red-600 text-xs flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(slot.date)} a las {slot.time}
                        </div>
                      )}
                    </div>
                  ))}
                  {sortedReservedSlots.length > 3 && (
                    <div className="text-xs text-gray-600 text-center p-2">
                      +{sortedReservedSlots.length - 3} más...
                    </div>
                  )}
                </div>
              ) : (
                // Vista expandida
                <ScrollArea className="h-auto border rounded p-2">
                  <div className="space-y-2">
                    {sortedReservedSlots.map((slot, idx) => (
                      <div
                        key={idx}
                        className="bg-red-50 border border-red-200 p-3 rounded text-sm cursor-pointer hover:bg-red-100 transition-colors"
                        onClick={() => onSelectReservation?.(slot)}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-red-600" />
                            <span className="font-medium text-red-900">
                              {slot.time}
                            </span>
                          </div>
                          {slot.tableNumbers && slot.tableNumbers.length > 0 && (
                            <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                              Mesa {slot.tableNumbers.join(", ")}
                            </span>
                          )}
                        </div>
                        <div className="ml-6 text-red-700 text-xs mb-1">
                          <span className="font-medium">{slot.guestName}</span>
                          <span> ({slot.numberOfGuests} pers.)</span>
                        </div>
                        {slot.date && (
                          <div className="ml-6 text-red-600 text-xs flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(slot.date)} a las {slot.time}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        {reservedSlots.length > 0 && (
          <div className="flex gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1" />
                  Ocultar
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Ver todas
                </>
              )}
            </Button>
            
          </div>
        )}
      </div>
    </Card>
  );
};
