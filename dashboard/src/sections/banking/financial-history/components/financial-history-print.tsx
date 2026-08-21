import type { ITreasuryTransaction } from 'src/actions/treasury';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { fNumber } from 'src/utils/format-number';

import { A4Page } from 'src/components/abnt-document/a4-page';

// ----------------------------------------------------------------------

const tokens = {
  brandGreen: '#10B981',
  brandDark: '#1A202C',
  textMain: '#2D3748',
  textMuted: '#718096',
  tableRowAlt: '#F8FAFC',
  dangerRed: '#E53E3E',
  borderGray: '#E2E8F0',
};

// ----------------------------------------------------------------------

const SectionTitle = ({ title, mt = 4 }: { title: string; mt?: number }) => (
  <Box sx={{ mt, mb: 2 }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: tokens.brandDark, mb: 0.5 }}>
      {title}
    </Typography>
    <Box sx={{ height: '3px', width: '100%', bgcolor: tokens.brandGreen }} />
  </Box>
);

// ----------------------------------------------------------------------

type Props = {
  transactions: ITreasuryTransaction[];
  profile?: any;
};

export function FinancialHistoryPrint({ transactions, profile }: Props) {
  const totalInflow = transactions
    .filter(tx => tx.direction === 'inbound' || tx.type === 'income')
    .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);

  const totalOutflow = transactions
    .filter(tx => tx.direction === 'outbound' || tx.type === 'expense')
    .reduce((acc, tx) => acc + (Number(tx.amount) || 0), 0);

  const contractTotal = profile?.contract_total || 65000;
  const totalPaid = profile?.total_paid ?? totalInflow;
  const outstandingBalance = profile?.outstanding_balance ?? Math.max(0, contractTotal - totalPaid);

  const headerContent = (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: `1px solid ${tokens.borderGray}`, pb: 2 }}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: tokens.brandDark }}>
          ASPPIBRA <span style={{ color: tokens.brandGreen }}>DAO</span>
        </Typography>
        <Typography variant="body2" sx={{ color: tokens.textMuted }}>
          Relatório Financeiro Consolidado
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: tokens.brandDark }}>
          Ref: {fDate(new Date(), 'YYYY-MM-A4')}
        </Typography>
        <Typography variant="caption" sx={{ color: tokens.textMuted }}>
          Período: Últimos 12 Meses
        </Typography>
      </Box>
    </Box>
  );

  const footerContent = (
    <Box sx={{ borderTop: `2px solid ${tokens.brandGreen}`, pt: 2, display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="caption" sx={{ color: tokens.textMuted }}>Gerado em: {fDate(new Date(), 'DD/MM/YYYY')}</Typography>
      <Typography variant="caption" sx={{ color: tokens.textMuted }}>Confidencial</Typography>
      <Typography variant="caption" sx={{ color: tokens.textMuted }}>Documento Oficial ASPPIBRA</Typography>
    </Box>
  );

  return (
    <A4Page headerContent={headerContent} footerContent={footerContent}>

      {/* 1. PERFIL DO TITULAR */}
      <Box sx={{ display: 'flex', gap: 3, mt: 1, border: `1px solid ${tokens.borderGray}`, borderRadius: 2, p: 2, alignItems: 'center' }}>
        <Box sx={{
          width: 70, height: 70, borderRadius: '50%', border: `3px solid ${tokens.brandGreen}`,
          bgcolor: '#E6F8F3', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: tokens.brandDark, fontWeight: 'bold', fontSize: '1.8rem'
        }}>
          AF
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: tokens.brandDark, lineHeight: 1 }}>ANDRESSA DE LIMA FERREIRA</Typography>
          <Typography variant="caption" sx={{ color: tokens.textMuted, display: 'block', mt: 1 }}>CONTA ASSOCIADA</Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: tokens.textMain }}>
            #2024001 <span style={{ color: tokens.brandGreen, fontSize: '0.75rem' }}>(Ativo)</span>
          </Typography>
          <Typography variant="caption" sx={{ color: tokens.textMuted, display: 'block', mt: 1 }}>CPF / CNPJ</Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: tokens.textMain }}>173.793.567-80</Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="caption" sx={{ color: tokens.textMuted, display: 'block' }}>CONTATO PRINCIPAL</Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: tokens.textMain, mb: 1.5 }}>andressa.ferreira@email.com</Typography>
          <Typography variant="caption" sx={{ color: tokens.textMuted, display: 'block' }}>ENDEREÇO CADASTRADO</Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: tokens.textMain }}>Rua Palmira F. De Carvalho, lote 05, Quadra D</Typography>
          <Typography variant="caption" sx={{ color: tokens.textMain }}>São José de Imbassaí, Maricá - RJ, 24912-000</Typography>
        </Box>
      </Box>

      {/* 2. RESUMO EXECUTIVO */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Box sx={{ flex: 1, border: `1px solid ${tokens.borderGray}`, borderLeft: `4px solid ${tokens.brandDark}`, p: 1.5, borderRadius: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: tokens.textMuted }}>VALOR TOTAL</Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: tokens.brandDark, mt: 0.5 }}>R$ {fNumber(contractTotal)}</Typography>
        </Box>
        <Box sx={{ flex: 1, border: `1px solid ${tokens.borderGray}`, borderLeft: `4px solid ${tokens.brandGreen}`, p: 1.5, borderRadius: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: tokens.textMuted }}>TOTAL PAGO</Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: tokens.brandGreen, mt: 0.5 }}>R$ {fNumber(totalPaid)}</Typography>
        </Box>
        <Box sx={{ flex: 1, border: `1px solid ${tokens.dangerRed}`, bgcolor: '#FFF5F5', p: 1.5, borderRadius: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: tokens.dangerRed }}>SALDO DEVEDOR</Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: tokens.dangerRed, mt: 0.5 }}>R$ {fNumber(outstandingBalance)}</Typography>
        </Box>
      </Box>

      {/* 3. LEDGER (TABELA ZEBRADA) */}
      <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse', mb: 4, mt: 4, tableLayout: 'fixed' }}>
        <Box component="thead">
          <Box component="tr" sx={{ bgcolor: tokens.brandDark }}>
            <Box component="th" sx={{ py: 1.5, px: 1.5, width: '12%', textAlign: 'left', typography: 'caption', fontSize: '0.65rem', fontWeight: 'bold', color: 'white' }}>Data</Box>
            <Box component="th" sx={{ py: 1.5, px: 1.5, width: '25%', textAlign: 'left', typography: 'caption', fontSize: '0.65rem', fontWeight: 'bold', color: 'white' }}>Contraparte</Box>
            <Box component="th" sx={{ py: 1.5, px: 1.5, width: '18%', textAlign: 'left', typography: 'caption', fontSize: '0.65rem', fontWeight: 'bold', color: 'white' }}>Origem</Box>
            <Box component="th" sx={{ py: 1.5, px: 1.5, width: '18%', textAlign: 'left', typography: 'caption', fontSize: '0.65rem', fontWeight: 'bold', color: 'white' }}>Destino</Box>
            <Box component="th" sx={{ py: 1.5, px: 1.5, width: '15%', textAlign: 'right', typography: 'caption', fontSize: '0.65rem', fontWeight: 'bold', color: 'white' }}>Valor ($)</Box>
            <Box component="th" sx={{ py: 1.5, px: 1.5, width: '12%', textAlign: 'center', typography: 'caption', fontSize: '0.65rem', fontWeight: 'bold', color: 'white' }}>Status</Box>
          </Box>
        </Box>
        <Box component="tbody">
          {transactions.map((row, index) => {
            const isAlt = index % 2 !== 0;
            const isOutbound = row.direction === 'outbound';
            return (
              <Box
                component="tr"
                key={row.id}
                sx={{
                  bgcolor: isAlt ? tokens.tableRowAlt : '#FFF',
                  borderBottom: `1px solid ${tokens.borderGray}`,
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid'
                }}
              >
                <Box component="td" sx={{ py: 1.5, px: 1.5, typography: 'caption', fontSize: '0.65rem', color: tokens.textMain, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                  {fDate(row.created_at, 'DD/MM/YYYY')}
                </Box>
                <Box component="td" sx={{ py: 1.5, px: 1.5, verticalAlign: 'middle', wordWrap: 'break-word' }}>
                  <Typography variant="subtitle2" sx={{ color: tokens.brandDark, fontWeight: 'bold', fontSize: '0.75rem', lineHeight: 1.2 }}>
                    {row.counterparty_name || 'N/A'}
                  </Typography>
                </Box>
                <Box component="td" sx={{ py: 1.5, px: 1.5, typography: 'caption', fontSize: '0.65rem', color: tokens.textMain, verticalAlign: 'middle', wordWrap: 'break-word' }}>
                  {row.origin_institution || 'N/A'}
                </Box>
                <Box component="td" sx={{ py: 1.5, px: 1.5, typography: 'caption', fontSize: '0.65rem', color: tokens.textMain, verticalAlign: 'middle', wordWrap: 'break-word' }}>
                  {row.destination_institution || 'N/A'}
                </Box>
                <Box
                  component="td"
                  sx={{
                    py: 1.5, px: 1.5, textAlign: 'right', verticalAlign: 'middle',
                    typography: 'subtitle2', fontFamily: 'monospace', fontSize: '0.75rem',
                    color: isOutbound ? tokens.dangerRed : tokens.brandGreen,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {fNumber(row.amount, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Box>
                <Box component="td" sx={{ py: 1.5, px: 1.5, textAlign: 'center', verticalAlign: 'middle' }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '0.65rem',
                      color: row.status === 'confirmed' ? tokens.brandGreen : (row.amount === 0 || row.category === 'Falta de Pagamento') ? tokens.dangerRed : tokens.textMuted
                    }}
                  >
                    {row.status === 'confirmed'
                      ? 'Concluído'
                      : (row.amount === 0 || row.category === 'Falta de Pagamento')
                        ? 'Falta de Pagamento'
                        : row.status === 'pending'
                          ? 'Pendente'
                          : 'Inadimplente'}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* 4. AVISO LEGAL */}
      <Box sx={{ mt: 5, p: 2, bgcolor: tokens.tableRowAlt, borderRadius: 1, border: `1px solid ${tokens.borderGray}` }}>
        <Typography variant="caption" sx={{ color: tokens.textMuted, display: 'block', textAlign: 'justify', lineHeight: 1.5 }}>
          <strong>AVISO LEGAL:</strong> Este documento foi gerado eletronicamente pelos sistemas da ASPPIBRA DAO e reflete os registros processados durante o período de referência. As informações apresentadas constituem demonstrativo informativo das operações vinculadas à execução contratual e poderão ser utilizadas como elemento de prova eletrônica, nos termos da Medida Provisória nº 2.200-2/2001, da Lei nº 14.063/2020 e da legislação aplicável. O conteúdo é confidencial e destinado exclusivamente ao titular da conta e às partes autorizadas. Para fins fiscais e tributários, consulte o Informe de Rendimentos disponibilizado na área segura da plataforma.
        </Typography>
      </Box>
    </A4Page>
  );
}
