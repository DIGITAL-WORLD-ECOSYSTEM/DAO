import { Result } from '../../../shared/kernel/Result';
import { IJwtService } from '../../../application/ports/security/IJwtService';
import { ISessionRepository } from '../../../application/ports/output/ISessionRepository';

export interface SessionUserInfo {
  userId: number;
  email: string;
  role: string;
  aal: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  tokenVersion: number;
  ip: string;
  userAgent: string;
}

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export class IssueSessionUseCase {
  constructor(
    private sessionRepository: ISessionRepository,
    private jwtService: IJwtService,
    private jwtSecretKey: string,
    private kid: string
  ) {}

  async execute(userInfo: SessionUserInfo): Promise<Result<SessionTokens>> {
    // 1. Gerar identificadores únicos
    const sessionId = crypto.randomUUID();
    const jti = crypto.randomUUID();
    const refreshToken = crypto.randomUUID();
    const refreshTokenHash = await this.hashString(refreshToken);

    // 2. Persistir sessão no repository
    const createdAt = new Date();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias

    await this.sessionRepository.createSession({
      id: sessionId,
      userId: userInfo.userId,
      jti,
      ip: userInfo.ip,
      userAgent: userInfo.userAgent,
      refreshTokenHash,
      aal: userInfo.aal,
      authEpoch: userInfo.tokenVersion || 1,
      createdAt,
      expiresAt,
    });

    // 3. Assinar Access Token
    const accessToken = await this.jwtService.sign(
      {
        iss: 'asppibra-dao',
        aud: 'asppibra-app',
        sub: userInfo.email,
        userId: userInfo.userId,
        role: userInfo.role,
        aal: userInfo.aal,
        jti,
        sessionId,
        sid: sessionId,
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || '',
        username: userInfo.username || '',
        tokenVersion: userInfo.tokenVersion,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15 minutos
      },
      this.jwtSecretKey,
      this.kid
    );

    return Result.ok({ accessToken, refreshToken });
  }

  private async hashString(str: string): Promise<string> {
    const utf8 = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}
