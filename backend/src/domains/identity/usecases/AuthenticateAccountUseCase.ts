import { IAccountRepository } from '../repositories/AccountRepository';
import { verifyPassword } from '../../../routes/core/identity/local';

export class AuthenticateAccountUseCase {
  constructor(private accountRepo: IAccountRepository) {}

  async execute(input: any) {
    const { email, password } = input;
    
    const account = await this.accountRepo.findByEmail(email);

    if (!account || !account.password) {
      return { success: false, message: 'Conta Inexistente ou Incompatível com o modelo Manual de Login.', status: 401 };
    }

    if (!account.password.includes(':')) {
      return { success: false, message: 'Este e-mail está emparelhado a um provedor OAuth ou Web3. Efetue Login por lá.', status: 401 };
    }

    const isMatched = await verifyPassword(password, account.password);

    if (!isMatched) {
      return { success: false, message: 'As Credenciais de Acesso não batem.', status: 401 };
    }

    const userRole =
      account.email === 'dev@asppibra.com'
        ? 'dev'
        : account.role === 'citizen'
          ? 'user'
          : account.role || 'user';

    return {
      success: true,
      message: 'Credenciais Manuais Válidas',
      accountData: {
        userId: account.id,
        email: account.email,
        role: userRole,
        aal: 1,
        firstName: account.firstName || '',
        lastName: account.lastName || '',
        username: account.username || '',
      }
    };
  }
}
