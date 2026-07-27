import type { IChatParticipant, IChatConversation } from 'src/types/chat';

import { fSub, today } from 'src/utils/format-time';

const _mock = {
  id: (index: number) => `participant-${index}`,
  name: {
    fullName: (index: number) =>
      ['João Silva', 'Maria Souza', 'Sistema ASPPIBRA', 'Suporte Técnico', 'DAO Governante'][
        index % 5
      ],
  },
  image: {
    avatar: (index: number) => `/assets/images/avatar/avatar-${index + 1}.webp`,
  },
};

const _contacts: IChatParticipant[] = [...Array(12)].map((_, index) => ({
  id: _mock.id(index),
  name: _mock.name.fullName(index),
  role: 'User',
  email: `user${index}@example.com`,
  address: '0x123...abc',
  avatarUrl: _mock.image.avatar(index),
  phoneNumber: '+5511999999999',
  lastActivity: today(),
  status: index % 3 === 0 ? 'online' : 'offline',
  presenceStatus: index % 3 === 0 ? 'online' : index % 4 === 0 ? 'busy' : 'offline',
}));

export const _conversations: IChatConversation[] = [
  {
    id: 'room-ai',
    chatCategory: 'ai',
    type: 'single',
    unreadCount: 0,
    participants: [
      _contacts[0],
      { ..._contacts[1], name: 'AI Assistant', avatarUrl: '/assets/icons/chat/ic-ai.svg' },
    ],
    messages: [
      {
        id: 'm1',
        body: 'Olá! Como posso ajudar com sua conta hoje?',
        senderId: _contacts[1].id,
        contentType: 'text',
        createdAt: fSub({ hours: 2 }),
        attachments: [],
        messageType: 'text',
        readReceipt: 'read',
      },
    ],
  },
  {
    id: 'TKT-1042',
    chatCategory: 'ticket',
    type: 'single',
    unreadCount: 1,
    ticketSla: '2h',
    ticketStatus: 'Aberto',
    participants: [_contacts[0], { ..._contacts[2], name: 'Suporte L2' }],
    messages: [
      {
        id: 'm2',
        body: 'Estou com problema num Pix',
        senderId: _contacts[0].id,
        contentType: 'text',
        createdAt: fSub({ hours: 1 }),
        attachments: [],
        messageType: 'text',
        readReceipt: 'read',
      },
      {
        id: 'm3',
        body: 'Por favor, aguarde enquanto verifico.',
        senderId: _contacts[2].id,
        contentType: 'text',
        createdAt: fSub({ minutes: 5 }),
        attachments: [],
        messageType: 'text',
        readReceipt: 'delivered',
      },
    ],
  },
  {
    id: 'room-p2p',
    chatCategory: 'p2p',
    type: 'single',
    unreadCount: 0,
    participants: [_contacts[0], _contacts[3]],
    messages: [
      {
        id: 'm4',
        body: 'Manda o pagamento',
        senderId: _contacts[3].id,
        contentType: 'text',
        createdAt: fSub({ days: 1 }),
        attachments: [],
        messageType: 'text',
        readReceipt: 'read',
      },
      {
        id: 'm5',
        body: 'Invoice gerada',
        senderId: _contacts[0].id,
        contentType: 'invoice',
        createdAt: fSub({ hours: 5 }),
        attachments: [],
        messageType: 'invoice',
        readReceipt: 'read',
        systemData: { amount: 500, currency: 'USDT' },
      },
    ],
  },
  {
    id: 'room-dao',
    chatCategory: 'dao',
    type: 'group',
    unreadCount: 5,
    participants: [_contacts[0], _contacts[2], _contacts[4]],
    messages: [
      {
        id: 'm6',
        body: 'Nova proposta votada',
        senderId: _contacts[4].id,
        contentType: 'proposal',
        createdAt: fSub({ hours: 10 }),
        attachments: [],
        messageType: 'proposal',
        readReceipt: 'read',
        systemData: { proposalId: 15, title: 'Atualização do Tesouro' },
      },
    ],
  },
  {
    id: 'room-system',
    chatCategory: 'system',
    type: 'single',
    unreadCount: 2,
    participants: [
      _contacts[0],
      { ..._contacts[1], name: 'Sistema ASPPIBRA', avatarUrl: '/assets/icons/chat/ic-system.svg' },
    ],
    messages: [
      {
        id: 'm7',
        body: 'Pix Recebido',
        senderId: _contacts[1].id,
        contentType: 'system',
        createdAt: fSub({ minutes: 1 }),
        attachments: [],
        messageType: 'system',
        readReceipt: 'delivered',
        systemData: { action: 'pix_in', amount: 1500.0, transactionId: 'TX-10923' },
      },
    ],
  },
];

export const _chatContacts = _contacts;
