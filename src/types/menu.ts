export interface Plato {
  id: string;
  nombre: string;
  ingredientes: string;
  precio: number;
  numero?: number;
}

export interface SeccionMenu {
  id: string;
  titulo: string;
  platos: Plato[];
}

export interface MenuCompleto {
  menu: SeccionMenu[];
}
