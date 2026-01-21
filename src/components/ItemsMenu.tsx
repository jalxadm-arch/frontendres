import { FC, useState } from 'react';
import { Plato } from '../types/menu';

interface ItemsMenuProps {
  platos: Plato[];
}

const ItemsMenu: FC<ItemsMenuProps> = ({ platos }) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {platos.map((plato, index) => (
        <div
          key={plato.id}
          className="group relative"
          onMouseEnter={() => setHoveredId(plato.id)}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            animation: `slideInUp 0.6s ease-out ${index * 0.1}s both`,
          }}
        >
          {/* Contenedor con bordes solo izquierda y abajo */}
          <div
            className={`p-5 border-l-4 border-b-2 transition-all duration-300 ${hoveredId === plato.id
              ? 'border-amber-600 bg-white/100 backdrop-blur-sm'
              : 'border-gray-300 bg-white/80 hover:bg-gray-50'
              }`}
          >
            <div className="flex items-start justify-between gap-6">
              {/* Contenido izquierdo */}
              <div className="flex-1 min-w-0">
                {/* Número en círculo si existe */}
                {plato.numero && (
                  <div className="inline-flex items-center justify-center mb-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-all duration-300 ${hoveredId === plato.id
                        ? 'bg-amber-600 scale-110'
                        : 'bg-amber-500'
                        }`}
                      style={{
                        animation: hoveredId === plato.id
                          ? 'bounce 0.6s ease-in-out infinite'
                          : 'none',
                      }}
                    >
                      {plato.numero}
                    </div>
                  </div>
                )}

                <h3
                  className={`text-lg font-bold mb-2 transition-colors duration-300 ${hoveredId === plato.id ? 'text-amber-700' : 'text-gray-900'
                    }`}
                >
                  {plato.nombre}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {plato.ingredientes}
                </p>
              </div>

              {/* Precio centrado a la derecha */}
              <div
                className={`flex items-center justify-center flex-shrink-0 transition-all duration-300 ${hoveredId === plato.id
                  ? 'scale-110 text-amber-600'
                  : 'text-gray-900'
                  }`}
              >
                <div className="text-center">
                  <p className="text-xs text-gray-500 font-medium uppercase">
                    Precio
                  </p>
                  <p className="text-3xl font-bold">
                    ${plato.precio.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
};

export default ItemsMenu;
