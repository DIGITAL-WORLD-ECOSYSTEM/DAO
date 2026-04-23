import type { IDateValue } from './common';

// ----------------------------------------------------------------------

export type ICitizenItem = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  did: string;
  avatarUrl: string;
  role: 'citizen' | 'partner' | 'admin' | 'system';
  kycStatus: 'none' | 'pending' | 'approved' | 'rejected';
  
  // Identidade Civil
  rg?: string;
  orgaoEmissor?: string;
  cpf?: string;
  nacionalidade?: string;
  dataNascimento?: string;
  estadoCivil?: string;
  profissao?: string;

  // Institucional
  cargoOsc?: string;
  cargoProjetos?: string; // mapping to DB: cargo_projects
  departamento?: string; // mapping to DB: department
  mandato?: string;      // mapping to DB: mandate
  seniorityLevel?: string;
  leadershipStyle?: string;

  // Profissional
  academicInfo?: string;
  professionalExperience?: string;
  profileTags?: string[];
  phoneNumber?: string;
  
  // Endereço (JSON ou Flat no DB, aqui tipado para UI)
  address?: {
    logradouro: string;
    numero: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
  };
};

export type IMembershipCard = {
  id: string;
  citizenId: string;
  cardHash: string;
  tier: 'citizen' | 'partner' | 'founder' | 'honorary';
  issueDate: IDateValue;
  expiryDate?: IDateValue;
  qrCodeUrl?: string;
  status: 'active' | 'expired' | 'revoked';
};
