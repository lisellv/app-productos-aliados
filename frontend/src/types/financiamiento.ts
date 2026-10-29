export interface FinancingOption {
  id: number;
  productoId: number | string;
  tipoTasa: string;
  tasaAnual: number;
  montoMinimo: number;
  montoMaximo: number;
  plazoMinimoMeses: number;
  plazoMaximoMeses: number;
  vigenteDesde?: string;
  vigenteHasta?: string;
  activo?: boolean;
}

export interface FinancingRequest {
  id: number | string;
  clienteId: number | string;
  productoId: number | string;
  montoSolicitado: number;
  moneda?: string;
  plazoMeses: number;
  resultadoPrecalificacion?: string;
  estado?: string;
  creadoAt?: string;
}

export interface ClientRecord {
  id: number | string;
  tipoPersona: string;
  tipoDocumento?: string;
  numeroDocumento?: string;
  nombres?: string;
  apellidos?: string;
  razonSocial?: string;
  correo?: string;
  telefono?: string;
}

export interface ClientRegistrationRequest {
  tipoPersona: string;
  tipoDocumento: string | null;
  numeroDocumento: string;
  nombres: string | null;
  apellidos: string | null;
  razonSocial: string | null;
  correo: string | null;
  telefono: string | null;
}

export interface CreateFinancingRequest {
  clienteId: number;
  productoId: number;
  productoFinanciamientoId: number;
  montoSolicitado: number;
  plazoMeses: number;
  tasaTipoAplicada: string;
  tasaAnualAplicada: number;
  consentimiento: boolean;
}
