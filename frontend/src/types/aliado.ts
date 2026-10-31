export interface AliadoCatalogo {
  id: number | string;
  razonSocial: string;
}

export interface AliadoPerfil extends AliadoCatalogo {
  tipoDocumento?: string;
  numeroDocumento?: string;
  contactoNombre?: string;
  contactoCorreo?: string;
  contactoTelefono?: string;
  estado?: string;
}
