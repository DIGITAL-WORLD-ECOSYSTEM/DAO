import { Citizen } from '../../domains/citizens/entities/Citizen';

export class CitizenMapper {
  static toDomain(raw: any): Citizen {
    return Citizen.restore({
      id: raw.userId ?? raw.id,
      userId: raw.userId ?? raw.id,
      username: raw.username ?? '',
      firstName: raw.legalFirstName ?? raw.firstName,
      lastName: raw.legalLastName ?? raw.lastName,
      did: raw.did,
      cpf: raw.cpf,
      status: (raw.civilStatus || raw.status || 'PENDING').toUpperCase() as any,
      version: raw.version || 1,
    });
  }
}
