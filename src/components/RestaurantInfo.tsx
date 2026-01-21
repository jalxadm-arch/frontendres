import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";

const infoItems = [
  {
    icon: MapPin,
    title: "Location",
    content: "2000 Menaul Blvd NE, Albuquerque NM 87107",
    link: "https://maps.google.com/?q=2000+Menaul+Blvd+NE,+Albuquerque+NM+87107"
  },
  {
    icon: Phone,
    title: "Phone",
    content: "(505) 835-5599",
    link: "tel:5058355599"
  },
  {
    icon: Mail,
    title: "Email",
    content: "lasierra.abq@gmail.com",
    link: "mailto:lasierra.abq@gmail.com"
  },
  {
    icon: Clock,
    title: "Hours",
    content: "Monday - Sunday: 8:00 AM - 9:00 PM",
  }
];

const socialLinks = [
  {
    icon: Instagram,
    name: "Instagram",
    handle: "@la_sierra_los_nunez",
    link: "https://instagram.com/la_sierra_los_nunez"
  },
  {
    icon: Facebook,
    name: "Facebook",
    handle: "La Sierra Restaurant",
    link: "https://facebook.com/La.Sierra.Restaurant"
  }
];

const RestaurantInfo = () => {
  return (
    <section className="py-20 px-4 bg-card">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Visit Us
          </h2>
          <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience authentic New Mexican cuisine in the heart of Albuquerque. 
            With 31 tables and a warm atmosphere, we're ready to serve you.
          </p>
        </motion.div>
        
        {/* Info Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {infoItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {item.link ? (
                <a
                  href={item.link}
                  target={item.link.startsWith("http") ? "_blank" : undefined}
                  rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block p-6 bg-background rounded-xl shadow-warm hover:shadow-elevated transition-shadow duration-300 h-full"
                >
                  <InfoContent item={item} />
                </a>
              ) : (
                <div className="p-6 bg-background rounded-xl shadow-warm h-full">
                  <InfoContent item={item} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6"
        >
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-3 bg-background rounded-full shadow-warm hover:shadow-elevated transition-all duration-300 hover:scale-105"
            >
              <social.icon className="w-5 h-5 text-primary" />
              <span className="font-body font-medium text-foreground">{social.handle}</span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const InfoContent = ({ item }: { item: typeof infoItems[0] }) => (
  <>
    <div className="w-12 h-12 gradient-sunset rounded-full flex items-center justify-center mb-4">
      <item.icon className="w-6 h-6 text-primary-foreground" />
    </div>
    <h3 className="font-display text-xl font-semibold text-foreground mb-2">
      {item.title}
    </h3>
    <p className="font-body text-muted-foreground">
      {item.content}
    </p>
  </>
);

export default RestaurantInfo;
