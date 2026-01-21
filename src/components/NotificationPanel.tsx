import { useState } from "react";
import { Notification } from "@/types";
import { Bell, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const NotificationPanel = ({
  notifications,
  onMarkAsRead,
  onDismiss,
}: NotificationPanelProps) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "reservation":
        return "bg-blue-100 border-blue-300";
      case "cancellation":
        return "bg-red-100 border-red-300";
      case "modification":
        return "bg-yellow-100 border-yellow-300";
      default:
        return "bg-gray-100 border-gray-300";
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "reservation":
        return <Badge className="bg-blue-600">Reservación</Badge>;
      case "cancellation":
        return <Badge className="bg-red-600">Cancelación</Badge>;
      case "modification":
        return <Badge className="bg-yellow-600">Modificación</Badge>;
      default:
        return <Badge>Información</Badge>;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          title="Notificaciones"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">Notificaciones</h3>
          <p className="text-sm text-gray-600">
            {unreadCount} no leídas de {notifications.length}
          </p>
        </div>

        <ScrollArea className="h-96">
          <div className="p-4 space-y-3">
            {notifications.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No hay notificaciones
              </p>
            ) : (
              notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-3 border-2 ${getNotificationColor(
                    notification.type
                  )} ${!notification.read ? "opacity-100" : "opacity-60"}`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {getNotificationBadge(notification.type)}
                          <span className="text-xs text-gray-600">
                            {notification.timestamp.toLocaleTimeString("es-ES", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <h4 className="font-semibold mt-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-700">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-2"
                          onClick={() => onMarkAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-red-600 hover:bg-red-50"
                      onClick={() => onDismiss(notification.id)}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Descartar
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
