/**
 * O HonoAdapter atua como a fronteira protetora entre o Framework HTTP (Hono)
 * e os Controllers do domínio (Application Layer). 
 * Ele garante que o Controller receba apenas DTOs e devolva estruturas agnósticas.
 */
import { Result } from '../../shared/kernel/Result';
import { HttpRequest, HttpResponse } from '../../application/ports/input/IHttp';

export class HonoAdapter {
  /**
   * Adapta uma função de Controller pura para um handler do Hono.
   */
  static adapt<T>(controllerFn: (req: HttpRequest<T>) => Promise<HttpResponse>) {
    return async (c: any) => {
      const body = c.req.header('content-type')?.includes('application/json') 
        ? await c.req.json().catch(() => ({}))
        : {};
        
      // Opcionalmente, pode-ter c.req.valid('json') se a rota usar zValidator,
      // mas isso é responsabilidade da Rota, que passa o payload validado.
      const validBody = c.req.valid ? c.req.valid('json') : body;

      const httpRequest: HttpRequest<T> = {
        body: validBody as T,
        query: c.req.query(),
        params: c.req.param(),
        headers: c.req.header(),
      };

      try {
        const httpResponse = await controllerFn(httpRequest);
        return c.json(httpResponse.body, httpResponse.status as any);
      } catch (error: any) {
        // Fallback global de segurança para vazamentos
        return c.json({ success: false, message: 'Internal Server Error' }, 500);
      }
    };
  }

  /**
   * Helper para formatar o retorno dos Controllers usando Result<T>
   */
  static fromResult(result: Result<any>, statusOnSuccess: number = 200, statusOnFail: number = 400): HttpResponse {
    if (result.isSuccess) {
      return { status: statusOnSuccess, body: { success: true, data: result.getValue() } };
    } else {
      return { status: statusOnFail, body: { success: false, message: result.error } };
    }
  }
}
