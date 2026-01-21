import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Notification, Table as TableType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { NotificationPanel } from "@/components/NotificationPanel";
import { TableCard } from "@/components/TableCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Settings, LogOut } from "lucide-react";
import axios from "axios";

const AdminDashboard = () => {
  const [tables, setTables] = useState<TableType[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableType | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Actualizar hora actual cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(timer);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        console.log("Iniciando fetch de reservaciones...");
        const apiUrl = import.meta.env.VITE_API_URL || "https://lasierraerestaurant.com/api";
        const response = await axios.get(
          `${apiUrl}/reservations`
        );
        console.log("Respuesta de API:", response);
        console.log("Datos completos:", response.data);
        
        let reservations = (response.data as any).reservations || [];
        console.log("Reservaciones obtenidas:", reservations);
        console.log("Total de reservaciones:", reservations.length);

        // Filtrar solo reservas activas (no canceladas)
        const activeReservations = reservations.filter(
          (r: any) => r.status !== "cancelled"
        );
        console.log("Reservaciones activas:", activeReservations);

        // Convertir reservas a estructura de tablas para mostrar
        const tablesData: TableType[] = Array.from({ length: 31 }, (_, i) => {
          const tableNum = i + 1;

          // Filtrar reservas para esta mesa
          const tableReservations = activeReservations.filter(
            (r: any) => r.tableNumbers && r.tableNumbers.includes(tableNum)
          );
          
          if (tableReservations.length > 0) {
            console.log(`Mesa ${tableNum} tiene ${tableReservations.length} reservaciones:`, tableReservations);
          }

          const timeSlots = [
            "8:00 AM",
            "8:45 AM",
            "9:30 AM",
            "10:15 AM",
            "11:00 AM",
            "11:45 AM",
            "12:30 PM",
            "1:15 PM",
            "2:00 PM",
            "2:45 PM",
            "3:30 PM",
            "4:15 PM",
            "5:00 PM",
            "5:45 PM",
            "6:30 PM",
            "7:15 PM",
            "8:00 PM",
            "8:15 PM",
          ].map((time) => {
            // Buscar reserva que coincida con esta hora
            // Normalizar ambos para comparación (convertir a minúsculas y trimear)
            const reservation = tableReservations.find(
              (r: any) => r.time && r.time.trim().toUpperCase() === time.toUpperCase()
            );

            return {
              time,
              isReserved: !!reservation,
              reservationId: reservation?._id || "",
              guestName: reservation?.name || "",
              guestEmail: reservation?.email || "",
              guestPhone: reservation?.phone || "",
              numberOfGuests: reservation?.guests || 0,
              createdAt: reservation?.createdAt || "",
              date: reservation?.date || "",
              tableNumbers: reservation?.tableNumbers || [],
              status: reservation?.status || "",
            };
          });

          return {
            id: tableNum,
            tableNumber: tableNum,
            capacity: 8,
            timeSlots,
          };
        });

        setTables(tablesData);
        setNotifications([]);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        console.error("Error message:", (error as any).message);
        console.error("Error response:", (error as any).response?.data);
        console.error("Error status:", (error as any).response?.status);
        const emptyTablesData: TableType[] = Array.from({ length: 31 }, (_, i) => {
          const tableNum = i + 1;
          return {
            id: tableNum,
            tableNumber: tableNum,
            capacity: 8,
            timeSlots: [
              "8:00 AM",
              "8:45 AM",
              "9:30 AM",
              "10:15 AM",
              "11:00 AM",
              "11:45 AM",
              "12:30 PM",
              "1:15 PM",
              "2:00 PM",
              "2:45 PM",
              "3:30 PM",
              "4:15 PM",
              "5:00 PM",
              "5:45 PM",
              "6:30 PM",
              "7:15 PM",
              "8:00 PM",
              "8:15 PM",
            ].map((time) => ({
              time,
              isReserved: false,
              guestName: "",
              numberOfGuests: 0,
            })),
          };
        });

        setTables(emptyTablesData);
      }
    };

    fetchReservations();
  }, []);

  // Usar todas las mesas
  const filteredTables = tables;

  // Función para determinar el estado de una franja horaria
  const getSlotStatus = (timeSlot: string): "passed" | "current" | "future" => {
    const now = new Date();
    const [time, period] = timeSlot.split(" ");
    const [hours, minutes] = time.split(":").map(Number);

    let hour24 = hours;
    if (period === "PM" && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === "AM" && hours === 12) {
      hour24 = 0;
    }

    const slotStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour24, minutes);
    const slotEnd = new Date(slotStart.getTime() + 45 * 60000); // 45 minutos

    if (now < slotStart) {
      return "future";
    } else if (now >= slotStart && now < slotEnd) {
      return "current";
    } else {
      return "passed";
    }
  };

  const getSlotColorClass = (timeSlot: string, isReserved: boolean): string => {
    const status = getSlotStatus(timeSlot);

    if (!isReserved) {
      // No reservada
      if (status === "passed") {
        return "hidden"; // Oculta si ya pasó
      }
      return "bg-green-600 text-white hover:bg-green-700";
    } else {
      // Reservada
      if (status === "passed") {
        return "hidden"; // Oculta si ya pasó
      }
      if (status === "current") {
        return "bg-red-700 text-white hover:bg-red-800 ring-2 ring-red-400 animate-pulse"; // Rojo oscuro/jodo actual
      }
      return "bg-red-600 text-white hover:bg-red-700"; // Rojo para futuras
    }
  };

  const handleSelectTimeSlot = (slot: any) => {
    if (slot.isReserved) {
      setSelectedReservation(slot);
    }
  };

  // Manejar notificaciones
  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  // Estadísticas
  const totalTables = tables.length;
  const totalReservations = tables.reduce(
    (acc, table) => acc + table.timeSlots.filter((s) => s.isReserved).length,
    0
  );
  const averageOccupancy = Math.round(
    (totalReservations / (tables.length * tables[0]?.timeSlots.length || 1)) *
      100
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">
                Dashboard Administrativo
              </h1>
              <span className="text-sm text-gray-300">
                Bienvenido, <span className="font-semibold">{user?.email}</span>
              </span>
              <NotificationPanel
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onDismiss={handleDismissNotification}
              />
              <Button variant="outline" size="icon" title="Configuración">
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-700 border-slate-600 text-white p-6">
            <div className="space-y-2">
              <p className="text-sm text-slate-300">Total de Mesas</p>
              <p className="text-3xl font-bold">{totalTables}</p>
              <p className="text-xs text-slate-400">Mesas disponibles</p>
            </div>
          </Card>

          <Card className="bg-slate-700 border-slate-600 text-white p-6">
            <div className="space-y-2">
              <p className="text-sm text-slate-300">Reservaciones Hoy</p>
              <p className="text-3xl font-bold">{totalReservations}</p>
              <p className="text-xs text-slate-400">Franjas ocupadas</p>
            </div>
          </Card>

          <Card className="bg-slate-700 border-slate-600 text-white p-6">
            <div className="space-y-2">
              <p className="text-sm text-slate-300">Ocupación Promedio</p>
              <p className="text-3xl font-bold">{averageOccupancy}%</p>
              <p className="text-xs text-slate-400">Del total de franjas</p>
            </div>
          </Card>

          <Card className="bg-slate-700 border-slate-600 text-white p-6">
            <div className="space-y-2">
              <p className="text-sm text-slate-300">Notificaciones</p>
              <p className="text-3xl font-bold">
                {notifications.filter((n) => !n.read).length}
              </p>
              <p className="text-xs text-slate-400">No leídas</p>
            </div>
          </Card>
        </div>

        {/* Controles */}
        <Card className="bg-slate-700 border-slate-600 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reservación
            </Button>
          </div>
        </Card>

        {/* Mesas */}
        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="bg-slate-700 border-slate-600 mb-6">
            <TabsTrigger value="grid" className="text-gray-300">
              Vista en Grilla
            </TabsTrigger>
            <TabsTrigger value="list" className="text-gray-300">
              Vista en Lista
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grid">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTables.length > 0 ? (
                filteredTables.map((table) => (
                  <TableCard
                    key={table.id}
                    table={table}
                    onSelectTable={setSelectedTable}                    onSelectReservation={setSelectedReservation}                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg">
                    No se encontraron mesas que coincidan con tu búsqueda
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="list">
            <Card className="bg-slate-700 border-slate-600 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-300">
                  <thead className="bg-slate-600 border-b border-slate-500">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">
                        Mesa
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Capacidad
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Reservaciones
                      </th>
                      <th className="px-6 py-3 text-left font-semibold">
                        Ocupación
                      </th>
                      <th className="px-6 py-3 text-right font-semibold">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-600">
                    {filteredTables.map((table) => {
                      const reserved = table.timeSlots.filter(
                        (s) => s.isReserved
                      ).length;
                      const occupancy = Math.round(
                        (reserved / table.timeSlots.length) * 100
                      );
                      return (
                        <tr
                          key={table.id}
                          className="hover:bg-slate-600 transition-colors"
                        >
                          <td className="px-6 py-4 font-semibold">
                            Mesa {table.tableNumber}
                          </td>
                          <td className="px-6 py-4">{table.capacity} pers.</td>
                          <td className="px-6 py-4">{reserved}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-slate-600 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500"
                                  style={{ width: `${occupancy}%` }}
                                />
                              </div>
                              <span>{occupancy}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-400 hover:text-blue-300"
                              onClick={() => setSelectedTable(table)}
                            >
                              Ver
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Información de mesa seleccionada */}
        {selectedTable && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-slate-700 border-slate-600 max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    Mesa {selectedTable.tableNumber}
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTable(null)}
                    className="text-gray-400"
                  >
                    ✕
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-gray-300">
                  <div>
                    <p className="text-sm text-gray-400">Capacidad</p>
                    <p className="text-lg font-semibold">
                      {selectedTable.capacity} personas
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-3">
                    Franjas Horarias
                  </h3>
                  <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                    {selectedTable.timeSlots.map((slot, idx) => {
                      const slotStatus = getSlotStatus(slot.time);
                      const colorClass = getSlotColorClass(slot.time, slot.isReserved);

                      // Si la clase es "hidden", no renderizar el elemento
                      if (colorClass === "hidden") {
                        return null;
                      }

                      return (
                        <div
                          key={idx}
                          className={`p-2 rounded text-center text-xs font-medium transition-colors cursor-pointer ${colorClass}`}
                          title={
                            slot.isReserved
                              ? `${slot.guestName} - ${slot.numberOfGuests} pers. (${slotStatus === "current" ? "EN CURSO" : slotStatus === "future" ? "PRÓXIMA" : "PASADA"})`
                              : `Disponible (${slotStatus === "current" ? "AHORA" : slotStatus === "future" ? "FUTURO" : "PASADO"})`
                          }
                          onClick={() => handleSelectTimeSlot(slot)}
                        >
                          {slot.time}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-600">
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    Editar Reservaciones
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedTable(null)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Modal de detalles de reservación */}
        {selectedReservation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="bg-slate-700 border-slate-600 max-w-md w-full">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">
                    Detalles de Reservación
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedReservation(null)}
                    className="text-gray-400"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-3 border-t border-slate-600 pt-4">
                  <div>
                    <p className="text-sm text-gray-400">Horario</p>
                    <p className="text-lg font-semibold text-white">
                      {selectedReservation.time}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Fecha de la Reserva</p>
                    <p className="text-lg font-semibold text-white">
                      {selectedReservation.date ? new Date(selectedReservation.date).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }) : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Mesas Asignadas</p>
                    <p className="text-lg font-semibold text-white">
                      {selectedReservation.tableNumbers && selectedReservation.tableNumbers.length > 0 
                        ? `Mesa ${selectedReservation.tableNumbers.join(", ")}`
                        : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Nombre del Cliente</p>
                    <p className="text-lg font-semibold text-white">
                      {selectedReservation.guestName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-sm text-blue-300 break-all">
                      {selectedReservation.guestEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Teléfono</p>
                    <p className="text-sm text-white">
                      {selectedReservation.guestPhone}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Número de Comensales</p>
                    <p className="text-lg font-semibold text-white">
                      {selectedReservation.numberOfGuests} personas
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Estado</p>
                    <p className="text-sm text-white capitalize">
                      {selectedReservation.status || "confirmed"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">ID de Reservación</p>
                    <p className="text-xs text-gray-400 break-all font-mono">
                      {selectedReservation.reservationId}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-slate-600">
                  
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedReservation(null)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
