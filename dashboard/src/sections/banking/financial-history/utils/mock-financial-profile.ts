import type { ITreasuryTransaction } from 'src/actions/treasury';

export interface IAssociateProfile {
  id: string;
  name: string;
  cpf: string;
  rg: string;
  email: string;
  phone: string;
  category: string;
  photoURL?: string;
  status: 'active' | 'inactive' | 'suspended';
}

export interface IContractProfile {
  id: string;
  planName: string;
  contractedAmount: number;
  paidAmount: number;
  openAmount: number;
  status: 'Adimplente' | 'Em Atraso' | 'Em Negociação';
}

export interface IObligationProfile {
  nextDueDate: string;
  nextDueAmount: number;
  pendingInstallments: number;
  overdueInstallments: number;
}

export interface IFinancialProfile {
  associate: IAssociateProfile;
  contract: IContractProfile;
  obligations: IObligationProfile;
  transactions: ITreasuryTransaction[];
}

export const BLANK_FINANCIAL_PROFILE: IFinancialProfile = {
  associate: {
    id: '--',
    name: 'Aguardando seleção...',
    cpf: '-----------',
    rg: '---------',
    email: '-',
    phone: '-',
    category: '-',
    photoURL: '',
    status: 'inactive',
  },
  contract: {
    id: '-',
    planName: '-',
    contractedAmount: 0,
    paidAmount: 0,
    openAmount: 0,
    status: 'Adimplente',
  },
  obligations: {
    nextDueDate: '-',
    nextDueAmount: 0,
    pendingInstallments: 0,
    overdueInstallments: 0,
  },
  transactions: [],
};

export const MOCK_FINANCIAL_PROFILES: IFinancialProfile[] = [
  {
    associate: {
      id: '19',
      name: 'Paulo Roberto Batista Ferreira',
      cpf: '12345678900',
      rg: '123456789',
      email: 'paulo.roberto@email.com',
      phone: '+55 11 99999-9999',
      category: 'Associado',
      status: 'active',
    },
    contract: {
      id: 'CTR-001',
      planName: 'Plano Premium DAO',
      contractedAmount: 65000,
      paidAmount: 35823,
      openAmount: 29177,
      status: 'Adimplente',
    },
    obligations: {
      nextDueDate: '15/08/2026',
      nextDueAmount: 120.0,
      pendingInstallments: 2,
      overdueInstallments: 0,
    },
    transactions: [
      {
        id: 'tx-1',
        tenant_id: 'tenant-1',
        version: 1,
        created_at: '2026-07-10T10:00:00Z',
        updated_at: '2026-07-10T10:00:00Z',
        processed_at: '2026-07-10T10:00:00Z',
        amount: 120,
        currency: 'BRL',
        base_currency: 'BRL',
        base_amount: 120,
        exchange_rate: 1,
        type: 'income',
        direction: 'inbound',
        category: 'Mensalidade',
        tags: [],
        payer_id: '19',
        recipient_id: 'dao',
        counterparty_name: 'Paulo Roberto Batista Ferreira',
        origin_institution: 'Banco do Brasil',
        destination_institution: 'Conta DAO',
        payment_method: 'PIX',
        external_reference: null,
        status: 'confirmed',
        reconciliation_status: 'matched',
        risk_score: { level: 'low', score: 10 },
        integrity_hash: 'hash',
        documents: [],
        ai_flags: [],
        source_channel: 'app',
        notes: null,
      },
    ],
  },
  {
    associate: {
      id: '20',
      name: 'Paulo Henrique Souza',
      cpf: '98765432100',
      rg: '987654321',
      email: 'paulo.henrique@email.com',
      phone: '+55 21 98888-8888',
      category: 'Associado',
      status: 'active',
    },
    contract: {
      id: 'CTR-002',
      planName: 'Plano Standard DAO',
      contractedAmount: 25000,
      paidAmount: 25000,
      openAmount: 0,
      status: 'Adimplente',
    },
    obligations: {
      nextDueDate: '-',
      nextDueAmount: 0,
      pendingInstallments: 0,
      overdueInstallments: 0,
    },
    transactions: [
      {
        id: 'tx-2',
        tenant_id: 'tenant-1',
        version: 1,
        created_at: '2026-06-05T10:00:00Z',
        updated_at: '2026-06-05T10:00:00Z',
        processed_at: '2026-06-05T10:00:00Z',
        amount: 25000,
        currency: 'BRL',
        base_currency: 'BRL',
        base_amount: 25000,
        exchange_rate: 1,
        type: 'income',
        direction: 'inbound',
        category: 'Quitação de Contrato',
        tags: [],
        payer_id: '20',
        recipient_id: 'dao',
        counterparty_name: 'Paulo Henrique Souza',
        origin_institution: 'Itaú',
        destination_institution: 'Conta DAO',
        payment_method: 'TED',
        external_reference: null,
        status: 'confirmed',
        reconciliation_status: 'matched',
        risk_score: { level: 'low', score: 5 },
        integrity_hash: 'hash2',
        documents: [],
        ai_flags: [],
        source_channel: 'web',
        notes: null,
      },
    ],
  },
  {
    associate: {
      id: '21',
      name: 'Paulo César Lima',
      cpf: '11122233344',
      rg: '111222333',
      email: 'paulo.cesar@email.com',
      phone: '+55 31 97777-7777',
      category: 'Associado',
      status: 'suspended',
    },
    contract: {
      id: 'CTR-003',
      planName: 'Plano Premium DAO',
      contractedAmount: 65000,
      paidAmount: 10000,
      openAmount: 55000,
      status: 'Em Atraso',
    },
    obligations: {
      nextDueDate: '10/05/2026',
      nextDueAmount: 1500,
      pendingInstallments: 12,
      overdueInstallments: 3,
    },
    transactions: [
      {
        id: 'tx-3',
        tenant_id: 'tenant-1',
        version: 1,
        created_at: '2026-04-10T10:00:00Z',
        updated_at: '2026-04-10T10:00:00Z',
        processed_at: '2026-04-10T10:00:00Z',
        amount: 1500,
        currency: 'BRL',
        base_currency: 'BRL',
        base_amount: 1500,
        exchange_rate: 1,
        type: 'income',
        direction: 'inbound',
        category: 'Mensalidade',
        tags: [],
        payer_id: '21',
        recipient_id: 'dao',
        counterparty_name: 'Paulo César Lima',
        origin_institution: 'Nubank',
        destination_institution: 'Conta DAO',
        payment_method: 'PIX',
        external_reference: null,
        status: 'confirmed',
        reconciliation_status: 'matched',
        risk_score: { level: 'low', score: 10 },
        integrity_hash: 'hash3',
        documents: [],
        ai_flags: [],
        source_channel: 'app',
        notes: null,
      },
    ],
  },
];
