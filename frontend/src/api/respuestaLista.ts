export type ListResponse<T> = T[] | { content?: T[]; data?: T[]; items?: T[] };

export function unwrapList<T>(respuesta: ListResponse<T>): T[] {
  if (Array.isArray(respuesta)) return respuesta;
  return respuesta.content || respuesta.data || respuesta.items || [];
}
