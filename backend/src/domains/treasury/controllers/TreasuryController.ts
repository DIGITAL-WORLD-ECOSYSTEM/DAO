import { GetFinancialAnalyticsUseCase } from '../usecases/GetFinancialAnalyticsUseCase';
import { HttpRequest, HttpResponse } from '../../../application/ports/input/IHttp';

export class TreasuryController {
  constructor(private getFinancialAnalyticsUseCase: GetFinancialAnalyticsUseCase) {}

  async getAnalytics(req: HttpRequest): Promise<HttpResponse> {
    const year = req.query.year;
    try {
      const result = await this.getFinancialAnalyticsUseCase.execute(year);
      
      return {
        status: 200,
        body: result.data || result
      };
    } catch (err: any) {
      return {
        status: 500,
        body: { success: false, message: err.message }
      };
    }
  }
}
