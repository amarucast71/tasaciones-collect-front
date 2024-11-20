export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PointSetting {
  coordinates: Coordinates;
  zoom: number;
}

export interface NewPoint {
  id?: number;
  nombre: string;
  observaciones: string;
  latitud: number | undefined;
  longitud: number | undefined;
  relevamientos: Relevamiento[];
}

export interface PointData {
  id: number;
  nombre: string;
  latitud: number;
  longitud: number;
  fecha: string;
  relevamientos_campania: number;
  relevamientos_total: number;
  observaciones: string;
  estado?: string;
  fecha_alta?: string;
  usuario?: number;
  usuario_nombre?: string;
  usuario_institucion?: string;
  confirmado?: boolean;
  relevamientos?: Relevamiento[];
}


interface Datos {
  tipo_registro: string;
  // nro_registro?: string;
  fecha_referencia: string;

  // EXPEDIENTE
  caso: string;
  tramite: string;

  tipo_inmueble: string;

  // EXPEDIENTE
  asunto_i: string;
  asunto_ii: string;

  // ANTECEDENTE
  operacion: string;
  oferente: string;
  telefono: string;
  email: string;
  enlace: string;



  // // UBICACIÓN DEL INMUEBLE
  nomenclatura_catastral: string;
  cuenta: string;
  departamento: string;
  pedania: string;
  ciudad: string;
  barrio: string;
  direccion: string;
  //
  // DESCRIPCIÓN DEL INMUEBLE
  superficie_terreno?: number;
  frente?: number;
  fondo?: number;
  forma: string;

  // RURAL
  limitantes_uso: string;

  //
  // // uso de suelo/planeamiento:
  ordenanza?: string;
  zona?: string;
  fot?: string;
  fos?: string;
  superficie_edificable?: number;


  //
  situacion_dominial: string;
  ocupacion: string;
  ubicacion: string;

  // MEJORAS
  mejoras_superficie?: number;
  mejoras_antiguedad?: number;
  mejoras_tipologia: string;
  mejoras_caracteristicas_principales: string;
  mejoras_estado_construccion: string;

  // CARACTERISTICAS GENERALES
  descripcion_general: string;
  propietario_titulo: string;

  // VALOR DEL TERRENO
  superficie_a_tasar?: number;
  valor_determinado?: number;
  valor_terreno?: number;
  descuento?: number;
  valor_neto?: number;
  valor_unitario_neto?: number;

  //  VALOR CONSTRUCCIÓN
  valor_unitario_construccion_nuevo?: number;
  valor_unitario_depreciado?: number;
  valor_total_construccion?: number;
  valor_mejora_nuevo?: number;
  depreciacion?: number;
  valor_total_mejoras?: number;

  //  VALOR TOTAL
  valor_pretendido?: number;
  valor_en_dolares?: number;
  valor_del_dolar?: number;

  valor_total_determinado?: number;
  informe: string;
  resolucion: string;

  // RURAL
  unidades_cartograficas?: string;
  simbolo?: string;
  pdfsimbolo?: string;
  capacidad_uso?: string;
  clase?: string;
  subclase?: string;
  indice_productividad?: number;
  limitante1?: string;
  limitante2?: string;
  limitante3?: string;
  agua_util_1m?: number;
  agua_util_2m?: number;
}

interface Fotografia {
  id: number;
  nombre: string;
  observaciones: string;
  url: string;
}


export interface Relevamiento {
  id?: number;
  fecha: string | null;
  datos: Datos;
  observaciones: string | null;
  punto: number | null;
  confirmado?: boolean;
  url_foto?: string;
  fotografias?: Fotografia[];
  usuario_nombre?: string;
  usuario_institucion?: string;
}

export interface Foto {
  id?: number;
  foto?: string;
}
