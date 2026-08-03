import { Citizen } from '../../domains/citizens/entities/Citizen';

export class CitizenMapper {
  static toDomain(raw: any): Citizen {
    return Citizen.restore({
      id: raw.id,
      userId: raw.userId,
      username: raw.username,
      firstName: raw.firstName,
      lastName: raw.lastName,
      did: raw.did,
      cpf: raw.cpf
    });
  }
}
