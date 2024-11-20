import { QTableColumn } from 'quasar';


export interface Institucion {
  id?: number;
  nombre: string;
  datos: string;
  usuarios?: number;
  actions?: string;
}

export interface Campania {
  id?: number;
  nombre: string;
  inicio: string;
  fin: string;
  vigente?: boolean;
  finicio?: string;
  ffin?: string;
  fvigente?: string;
  relevamientos: number;
  datos: string;
  // usuarios?: number;
  actions?: string;
}

export interface Asunto {
  id?: number;
  nombre: string;
  padre?: number;
  padre_nombre?: string;
  observaciones?: string;
  actions?: string;
}

export interface Rol {
  id: number;
  role: string;
}

export interface OptionList {
  value: number;
  label: string;
}

export interface NuevoUsuario {
  id?: number;
  institucion: number;
  first_name: string;
  last_name: string;
  usuario: string;
  email: string;
  password: string;
}

export interface Usuario {
  id?: number;
  first_name: string;
  last_name: string;
  usuario: string;
  email: string;
  institucion_nombre: string;
  roles: Rol[];
  actions?: string;
}


export interface Pagination {
  sortBy: string;
  descending: boolean;
  page: number;
  rowsPerPage: number;
  rowsNumber?: number;
}

type GetCellValue = (col: QTableColumn<Usuario>, row: Usuario) => unknown

export interface RequestProps {
  pagination: Pagination;
  filter?: string;
  getCellValue?: GetCellValue;
}
