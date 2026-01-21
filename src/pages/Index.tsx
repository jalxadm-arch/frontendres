import { useRef } from "react";
import Hero from "@/components/Hero";
import RestaurantInfo from "@/components/RestaurantInfo";
import ReservationForm from "@/components/ReservationForm";
import Footer from "@/components/Footer";
import SeccionMenu from "@/components/SeccionMenu";

const Index = () => {
  const reservationRef = useRef<HTMLDivElement>(null);

  const scrollToReservation = () => {
    reservationRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen">
      <Hero onReserveClick={scrollToReservation} />
      <RestaurantInfo />
      <SeccionMenu />
      <ReservationForm formRef={reservationRef} />
      <Footer />
    </main>
  );
};

export default Index;
