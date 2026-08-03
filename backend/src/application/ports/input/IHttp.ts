export interface HttpRequest<T = any> {
  body: T;
  query: Record<string, string>;
  params: Record<string, string>;
  headers: Record<string, string>;
}

export interface HttpResponse<T = any> {
  status: number;
  body: T;
}
