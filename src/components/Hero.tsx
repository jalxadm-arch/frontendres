import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import fondoHero from "@/assets/fondoHero.jpeg";
import img7511 from "@/assets/IMG_7511.png";
import { Button } from "@/components/ui/button";

interface HeroProps {
  onReserveClick: () => void;
}

const Hero = ({ onReserveClick }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${fondoHero})` }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 gradient-hero" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Logo Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
          whileHover={{ scale: 1.1 }}
        >
          <img
            src={img7511}
            alt="La Sierra Logo"
            className="w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 mx-auto object-contain filter drop-shadow-lg"
          />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-cream mb-4 tracking-tight">
            La Sierra
          </h1>
          <p className="font-display text-xl md:text-2xl text-sand/90 mb-2 italic">
            New Mexican Restaurant
          </p>
          <p className="font-body text-sand/70 text-lg mb-8">
            Authentic Flavors of Albuquerque Since Generations
          </p>
        </motion.div>

        {/* Button Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          whileHover={{ y: -5 }}
        >
          <Button
            onClick={onReserveClick}
            size="lg"
            className="gradient-sunset text-primary-foreground font-body font-semibold text-lg px-10 py-6 rounded-full shadow-elevated hover:scale-105 transition-transform duration-300"
          >
            Reserve Your Table
          </Button>
        </motion.div>


      </div>
    </section>
  );
};

export default Hero;
