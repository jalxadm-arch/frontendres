import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import { cn } from "@/lib/utils";

export const NotificationCenter: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 100 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "p-4 rounded-lg shadow-lg flex items-start gap-3",
              {
                "bg-green-50 border border-green-200": notification.type === "success",
                "bg-red-50 border border-red-200": notification.type === "error",
                "bg-blue-50 border border-blue-200": notification.type === "info",
                "bg-yellow-50 border border-yellow-200": notification.type === "warning",
              }
            )}
          >
            <div className="flex-1">
              <h3
                className={cn("font-semibold text-sm", {
                  "text-green-900": notification.type === "success",
                  "text-red-900": notification.type === "error",
                  "text-blue-900": notification.type === "info",
                  "text-yellow-900": notification.type === "warning",
                })}
              >
                {notification.title}
              </h3>
              <p
                className={cn("text-sm mt-1", {
                  "text-green-800": notification.type === "success",
                  "text-red-800": notification.type === "error",
                  "text-blue-800": notification.type === "info",
                  "text-yellow-800": notification.type === "warning",
                })}
              >
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className={cn("flex-shrink-0 mt-1", {
                "text-green-600 hover:text-green-700":
                  notification.type === "success",
                "text-red-600 hover:text-red-700": notification.type === "error",
                "text-blue-600 hover:text-blue-700": notification.type === "info",
                "text-yellow-600 hover:text-yellow-700":
                  notification.type === "warning",
              })}
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;
