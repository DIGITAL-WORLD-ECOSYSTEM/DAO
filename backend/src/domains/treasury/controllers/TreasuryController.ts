import { GetFinancialAnalyticsUseCase } from '../usecases/GetFinancialAnalyticsUseCase';
import { success, error } from '../../../utils/response';

export class TreasuryController {
  constructor(private getFinancialAnalyticsUseCase: GetFinancialAnalyticsUseCase) {}

  async getAnalytics(c: any) {
    const { year } = c.req.query();
    try {
      const result = await this.getFinancialAnalyticsUseCase.execute(year);
      
      // Import success dynamically if the static import path is incorrect, or just use it.
      // Wait, in treasury.ts it was `import { success, error } from '../../utils/response';`
      // We will just replicate the response directly if `success` is not easily available, or let the bridge handle it.
      // We will let the Controller return the payload, and the Strangler bridge will wrap it.
      // But standard controller should use the Response utility.
      
      return result.data;
    } catch (err: any) {
      throw err;
    }
  }
}
