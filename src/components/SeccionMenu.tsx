import { FC, useState, useEffect } from 'react';
import ItemsMenu from './ItemsMenu';
import { SeccionMenu as SeccionMenuType, MenuCompleto } from '../types/menu';
import menuData from '../data/menu.json';
import fondoMenu from '../assets/fondoMenu.jpeg';


const SeccionMenu: FC = () => {
  const [menuSecciones, setMenuSecciones] = useState<SeccionMenuType[]>([]);
  const [seccionActiva, setSeccionActiva] = useState<string | null>(null);

  useEffect(() => {
    const data: MenuCompleto = menuData;
    setMenuSecciones(data.menu);
    if (data.menu.length > 0) {
      setSeccionActiva(data.menu[0].id);
    }
  }, []);

  const seccionActualData = menuSecciones.find(s => s.id === seccionActiva);

  return (
    <div 
      className="relative min-h-screen py-16 px-4"
      style={{
        backgroundImage:  `url(${fondoMenu})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black bg-opacity-65"></div>
      
      {/* Contenido */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Título principal */}
        <div className="text-center mb-12" style={{ animation: 'fadeInDown 0.8s ease-out' }}>
          <h1 className="text-5xl font-bold text-white mb-4">
            Nuestro Menú
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full" />
          <p className="text-gray-200 mt-4 text-lg">
            Descubre los sabores auténticos de nuestra cocina
          </p>
        </div>

        {/* Tabs de secciones */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {menuSecciones.map((seccion, index) => (
            <button
              key={seccion.id}
              onClick={() => setSeccionActiva(seccion.id)}
              style={{ animation: `slideInDown 0.6s ease-out ${index * 0.1}s both` }}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                seccionActiva === seccion.id
                  ? 'bg-white bg-opacity-40 text-gray-900 border-2 border-white backdrop-blur-sm'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-600'
              }`}
            >
              {seccion.titulo}
            </button>
          ))}
        </div>

        {/* Contenido de la sección activa */}
        {seccionActualData && (
          <div
            key={seccionActualData.id}
            className="animate-fadeIn"
            style={{ animation: 'fadeInUp 0.6s ease-out' }}
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              {seccionActualData.titulo}
            </h2>
            <ItemsMenu platos={seccionActualData.platos} />
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SeccionMenu;
