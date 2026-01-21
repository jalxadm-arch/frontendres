import { useState } from "react";
import { motion } from "framer-motion";
import { format, isBefore, startOfDay, parse, isToday, isAfter } from "date-fns";
import { CalendarIcon, Users, Clock, User, Mail, Phone } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { reservationAPI } from "@/lib/api/reservationAPI";

// Generate time slots from 8:00 AM to 8:15 PM (last slot starts at 8:15 PM for 45 min)
const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 45) {
      if (hour === 20 && minute > 15) break; // Last slot at 8:15 PM
      const h = hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? "PM" : "AM";
      const m = minute.toString().padStart(2, "0");
      slots.push(`${h}:${m} ${period}`);
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

const guestOptions = Array.from({ length: 8 }, (_, i) => i + 1);

// Function to check if a time slot is available
const isTimeSlotAvailable = (selectedDate: Date | undefined, timeSlot: string): boolean => {
  if (!selectedDate) return true;

  // If not today, all time slots are available
  if (!isToday(selectedDate)) return true;

  // If today, check if time slot is after current time
  const now = new Date();
  const [time, period] = timeSlot.split(" ");
  const [hours, minutes] = time.split(":").map(Number);

  let hour24 = hours;
  if (period === "PM" && hours !== 12) {
    hour24 = hours + 12;
  } else if (period === "AM" && hours === 12) {
    hour24 = 0;
  }

  // Create time object for today
  const slotTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour24, minutes);

  // Slot is available if it's greater than current time (with 30 min buffer)
  const bufferTime = new Date(now.getTime() + 30 * 60000);
  return slotTime.getTime() > bufferTime.getTime();
};

const reservationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
  date: z.date({
    required_error: "Please select a date for your reservation",
  }),
  time: z.string({
    required_error: "Please select a time slot",
  }),
  guests: z.string({
    required_error: "Please select the number of guests",
  }),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

interface ReservationFormProps {
  formRef?: React.RefObject<HTMLDivElement>;
}

const ReservationForm = ({ formRef }: ReservationFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (data: ReservationFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await reservationAPI.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: data.date,
        time: data.time,
        guests: data.guests,
      });

      toast({
        title: "¡Reserva Confirmada!",
        description: `¡Gracias ${data.name}! Tu mesa para ${data.guests} ${data.guests === "1" ? "persona" : "personas"} el ${format(data.date, "d MMMM, yyyy")} a las ${data.time} ha sido reservada.`,
      });

      form.reset();
      setIsSubmitting(false);
    } catch (error: any) {
      console.error("Error creating reservation:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al crear la reserva. Intenta de nuevo.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const today = startOfDay(new Date());

  return (
    <section ref={formRef} className="py-20 px-4 bg-background" id="reservation">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Reserve Your Table
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            Book your dining experience at La Sierra
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card p-10 md:p-14 rounded-2xl shadow-elevated"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-[400px_1fr] gap-10">
              {/* Left Column - Calendar */}
              <div className="flex flex-col items-center justify-start">
                <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  Select Date
                </h3>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <div className="bg-background p-4 rounded-lg border-2 border-border">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => isBefore(date, today)}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </div>
                      {field.value && (
                        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                          <p className="font-body text-sm font-semibold text-foreground">
                            Selected Date:
                          </p>
                          <p className="font-body text-lg font-bold text-primary">
                            {format(field.value, "MMMM d, yyyy")}
                          </p>
                        </div>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column - Form Fields */}
              <div className="space-y-6">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-body font-medium text-foreground flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your name"
                          {...field}
                          className="font-body bg-background border-border focus:ring-primary text-base h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email & Phone */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body font-medium text-foreground flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                            className="font-body bg-background border-border focus:ring-primary text-base h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body font-medium text-foreground flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="(505) 000-0000"
                            {...field}
                            className="font-body bg-background border-border focus:ring-primary text-base h-11"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Time & Guests */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body font-medium text-foreground flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          Time (45 min)
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="font-body bg-background border-border text-base h-11">
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-60">
                            {timeSlots.map((slot) => {
                              const isAvailable = isTimeSlotAvailable(form.watch("date"), slot);
                              const isToday_ = form.watch("date") && isToday(form.watch("date"));
                              return (
                                <SelectItem
                                  key={slot}
                                  value={slot}
                                  className={cn(
                                    "font-body",
                                    !isAvailable && "text-muted-foreground opacity-50 cursor-not-allowed pointer-events-none"
                                  )}
                                  disabled={!isAvailable}
                                >
                                  {slot} {!isAvailable && isToday_ && "(Time has passed)"}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-body font-medium text-foreground flex items-center gap-2">
                          <Users className="w-4 h-4 text-primary" />
                          Guests
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="font-body bg-background border-border text-base h-11">
                              <SelectValue placeholder="Select guests" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {guestOptions.map((num) => (
                              <SelectItem key={num} value={num.toString()} className="font-body">
                                {num} {num === 1 ? "Guest" : "Guests"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-sunset text-primary-foreground font-body font-semibold text-lg py-6 rounded-xl shadow-warm hover:shadow-elevated transition-all duration-300 hover:scale-[1.02]"
                >
                  {isSubmitting ? "Processing..." : "Confirm Reservation"}
                </Button>
              </div>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
};

export default ReservationForm;
