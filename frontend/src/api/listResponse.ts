export type ListResponse<T> = T[] | { content?: T[]; data?: T[]; items?: T[] };

export function unwrapList<T>(response: ListResponse<T>): T[] {
  if (Array.isArray(response)) return response;
  return response.content || response.data || response.items || [];
}
