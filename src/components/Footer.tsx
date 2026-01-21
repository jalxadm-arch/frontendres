import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-12 px-4 bg-brown-deep text-sand">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-display text-2xl font-bold text-cream mb-4">
              La Sierra
            </h3>
            <p className="font-body text-sand/70">
              Authentic New Mexican cuisine in the heart of Albuquerque. 
              Family owned and operated.
            </p>
          </div>
          
          <div>
            <h4 className="font-display text-lg font-semibold text-cream mb-4">
              Contact
            </h4>
            <div className="space-y-3 font-body text-sand/80">
              <a href="tel:5058355599" className="flex items-center gap-2 hover:text-cream transition-colors">
                <Phone className="w-4 h-4" />
                (505) 835-5599
              </a>
              <a href="mailto:lasierra.abq@gmail.com" className="flex items-center gap-2 hover:text-cream transition-colors">
                <Mail className="w-4 h-4" />
                lasierra.abq@gmail.com
              </a>
              <a 
                href="https://maps.google.com/?q=2000+Menaul+Blvd+NE,+Albuquerque+NM+87107"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-cream transition-colors"
              >
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                2000 Menaul Blvd NE<br />
                Albuquerque, NM 87107
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display text-lg font-semibold text-cream mb-4">
              Hours
            </h4>
            <p className="font-body text-sand/80">
              Monday - Sunday<br />
              8:00 AM - 9:00 PM
            </p>
          </div>
        </div>
        
        <div className="border-t border-sand/20 pt-8 text-center">
          <p className="font-body text-sand/60 text-sm">
            © {new Date().getFullYear()} La Sierra New Mexican Restaurant. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
