import { useMemo, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import InputAdornment from '@mui/material/InputAdornment';
import TablePagination from '@mui/material/TablePagination';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useGetCitizens } from 'src/actions/identity';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// ----------------------------------------------------------------------

interface IBoletoItem {
  id: string;
  citizenId: string;
  citizenName: string;
  citizenEmail: string;
  amount: number;
  dueDate: string;
  createdAt: string;
  status: 'pago' | 'pendente' | 'vencido';
  barcode: string;
  lineCode: string;
  notes?: string;
}

const DEFAULT_BOLETOS: IBoletoItem[] = [
  {
    id: 'BOL-002194',
    citizenId: '1',
    citizenName: 'Andressa de Lima Ferreira',
    citizenEmail: 'andressa.ferreira@email.com',
    amount: 150000, // R$ 1.500,00
    dueDate: '2026-07-15',
    createdAt: '2026-07-01',
    status: 'pendente',
    barcode: '001900000902194000001500000000000000000000',
    lineCode: '00190.00009 02194.000005 15000.000007 9 00000000000000',
    notes: 'Mensalidade do plano de associado ASPPIBRA',
  },
  {
    id: 'BOL-002193',
    citizenId: '2',
    citizenName: 'Marcos Vinicius Souza',
    citizenEmail: 'marcos.souza@gmail.com',
    amount: 320000, // R$ 3.200,00
    dueDate: '2026-06-30',
    createdAt: '2026-06-15',
    status: 'pago',
    barcode: '001900000902193000003200000000000000000000',
    lineCode: '00190.00009 02193.000005 32000.000007 9 00000000000000',
    notes: 'Adesão de nova cota institucional',
  },
  {
    id: 'BOL-002192',
    citizenId: '3',
    citizenName: 'Patricia Goulart Silveira',
    citizenEmail: 'patricia.goulart@outlook.com',
    amount: 85000, // R$ 850,00
    dueDate: '2026-06-10',
    createdAt: '2026-05-25',
    status: 'vencido',
    barcode: '001900000902192000008500000000000000000000',
    lineCode: '00190.00009 02192.000005 85000.000007 9 00000000000000',
    notes: 'Taxa de manutenção anual corporativa',
  },
];

const TABLE_HEAD = [
  { id: 'id', label: 'ID/Cobrança' },
  { id: 'citizenName', label: 'Cidadão/Pagador' },
  { id: 'dueDate', label: 'Vencimento' },
  { id: 'amount', label: 'Valor' },
  { id: 'status', label: 'Status', align: 'center' as const },
  { id: 'actions', label: 'Ações', align: 'right' as const },
];

export function AnalyticsPaymentsView() {
  const { citizens } = useGetCitizens();

  const [boletos, setBoletos] = useState<IBoletoItem[]>([]);
  const [selectedBoleto, setSelectedBoleto] = useState<IBoletoItem | null>(null);
  const [openBoletoModal, setOpenBoletoModal] = useState(false);

  // Form states
  const [formCitizenId, setFormCitizenId] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Table pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dao:boletos');
    if (saved) {
      try {
        setBoletos(JSON.parse(saved));
      } catch {
        setBoletos(DEFAULT_BOLETOS);
      }
    } else {
      setBoletos(DEFAULT_BOLETOS);
      localStorage.setItem('dao:boletos', JSON.stringify(DEFAULT_BOLETOS));
    }
  }, []);

  // Save to localStorage helper
  const saveBoletos = (updatedList: IBoletoItem[]) => {
    setBoletos(updatedList);
    localStorage.setItem('dao:boletos', JSON.stringify(updatedList));
  };

  // Summaries calculation
  const summary = useMemo(() => {
    let faturado = 0;
    let pago = 0;
    let pendente = 0;
    let vencido = 0;

    boletos.forEach((bol) => {
      faturado += bol.amount;
      if (bol.status === 'pago') {
        pago += bol.amount;
      } else if (bol.status === 'pendente') {
        pendente += bol.amount;
      } else if (bol.status === 'vencido') {
        vencido += bol.amount;
      }
    });

    return { faturado, pago, pendente, vencido };
  }, [boletos]);

  // Form submission
  const handleCreateBoleto = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formCitizenId || !formAmount || !formDueDate) {
      toast.error('Preencha todos os campos obrigatórios!');
      return;
    }

    const selectedCitizen = citizens.find((c) => c.id === formCitizenId);
    if (!selectedCitizen) {
      toast.error('Cidadão não encontrado!');
      return;
    }

    const numAmount = Math.round(parseFloat(formAmount.replace(',', '.')) * 100);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Insira um valor válido!');
      return;
    }

    const randomId = `BOL-${Math.floor(100000 + Math.random() * 900000)}`;
    const mockBarcode = `00190${Math.floor(Math.random() * 1000000000000000000000000000000000000)}`;
    const mockLineCode = `00190.00009 ${Math.floor(10000 + Math.random() * 90000)}.${Math.floor(100000 + Math.random() * 900000)} ${Math.floor(100000 + Math.random() * 900000)} 9 00000000000000`;

    const newBoleto: IBoletoItem = {
      id: randomId,
      citizenId: selectedCitizen.id,
      citizenName: selectedCitizen.name,
      citizenEmail:
        selectedCitizen.email ||
        `${selectedCitizen.name.toLowerCase().replace(/\s+/g, '')}@email.com`,
      amount: numAmount,
      dueDate: formDueDate,
      createdAt: fDate(new Date(), 'YYYY-MM-DD'),
      status: 'pendente',
      barcode: mockBarcode,
      lineCode: mockLineCode,
      notes: formNotes || undefined,
    };

    const updated = [newBoleto, ...boletos];
    saveBoletos(updated);

    toast.success('Cobrança gerada com sucesso!');
    setSelectedBoleto(newBoleto);
    setOpenBoletoModal(true);

    // Reset Form
    setFormCitizenId('');
    setFormAmount('');
    setFormDueDate('');
    setFormNotes('');
  };

  // Change status of boleto
  const handleToggleStatus = (id: string, currentStatus: 'pago' | 'pendente' | 'vencido') => {
    const nextStatusMap: Record<typeof currentStatus, typeof currentStatus> = {
      pendente: 'pago',
      pago: 'vencido',
      vencido: 'pendente',
    };
    const next = nextStatusMap[currentStatus];

    const updated = boletos.map((bol) => {
      if (bol.id === id) {
        return { ...bol, status: next };
      }
      return bol;
    });

    saveBoletos(updated);
    toast.success(`Status da cobrança alterado para ${next.toUpperCase()}`);
  };

  // Pagination handlers
  const handleChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  // Filter list
  const dataFiltered = boletos.filter((bol) => {
    const query = searchQuery.toLowerCase();
    return (
      bol.id.toLowerCase().includes(query) ||
      bol.citizenName.toLowerCase().includes(query) ||
      bol.notes?.toLowerCase().includes(query)
    );
  });

  const paginatedData = dataFiltered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <DashboardContent maxWidth="xl">
      <CustomBreadcrumbs
        heading="Cobranças & Boletos"
        action={
          <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1.5 }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon={'solar:share-bold-duotone' as any} />}
              onClick={() => {
                const url = `${window.location.origin}/share/payments`;
                navigator.clipboard.writeText(url);
                toast.success('Link de cobrança copiado!');
              }}
            >
              Compartilhar Link
            </Button>
          </Stack>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {/* Cartões de Métricas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total Faturado"
            percent={4.2}
            total={fCurrency(summary.faturado / 100)}
            color="primary"
            icon={<Iconify icon={'solar:bill-list-bold-duotone' as any} width={24} />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Recebido (Pago)"
            percent={1.8}
            total={fCurrency(summary.pago / 100)}
            color="success"
            icon={<Iconify icon={'solar:double-alt-arrow-up-bold-duotone' as any} width={24} />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="A Receber (Pendente)"
            percent={-0.5}
            total={fCurrency(summary.pendente / 100)}
            color="info"
            icon={<Iconify icon={'solar:clock-circle-bold-duotone' as any} width={24} />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Atrasado (Vencido)"
            percent={12.4}
            total={fCurrency(summary.vencido / 100)}
            color="error"
            icon={<Iconify icon={'solar:close-circle-bold-duotone' as any} width={24} />}
          />
        </Grid>
      </Grid>

      {/* Grid Principal */}
      <Grid container spacing={3}>
        {/* Coluna Esquerda: Listagem */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader
              title="Cobranças Emitidas"
              subheader="Acompanhe o faturamento de taxas e parcelas dos cidadãos"
              sx={{ mb: 3 }}
              action={
                <TextField
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(0);
                  }}
                  placeholder="Pesquisar pagador ou código..."
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify
                            icon={'eva:search-fill' as any}
                            sx={{ color: 'text.disabled' }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ width: 220 }}
                />
              }
            />

            <TableContainer sx={{ overflow: 'unset' }}>
              <Scrollbar>
                <Table sx={{ minWidth: 720 }}>
                  <TableHeadCustom headCells={TABLE_HEAD} />

                  <TableBody>
                    {paginatedData.map((row) => {
                      const isPaid = row.status === 'pago';
                      const isPending = row.status === 'pendente';

                      return (
                        <TableRow key={row.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                              {row.id}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Emissão: {fDate(row.createdAt, 'DD/MM/YYYY')}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                              {row.citizenName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                              {row.citizenEmail}
                            </Typography>
                          </TableCell>

                          <TableCell
                            sx={{ color: row.status === 'vencido' ? 'error.main' : 'text.primary' }}
                          >
                            {fDate(row.dueDate, 'DD/MM/YYYY')}
                          </TableCell>

                          <TableCell sx={{ fontWeight: 700 }}>
                            {fCurrency(row.amount / 100)}
                          </TableCell>

                          <TableCell align="center">
                            <Tooltip title="Clique para alternar o status" placement="top">
                              <IconButton
                                onClick={() => handleToggleStatus(row.id, row.status)}
                                size="small"
                              >
                                <Label
                                  variant="soft"
                                  color={isPaid ? 'success' : isPending ? 'warning' : 'error'}
                                  sx={{
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    fontWeight: 800,
                                  }}
                                >
                                  {row.status}
                                </Label>
                              </IconButton>
                            </Tooltip>
                          </TableCell>

                          <TableCell align="right">
                            <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
                              <Tooltip title="Visualizar Boleto" placement="top">
                                <IconButton
                                  onClick={() => {
                                    setSelectedBoleto(row);
                                    setOpenBoletoModal(true);
                                  }}
                                  color="primary"
                                >
                                  <Iconify
                                    icon={'solar:printer-minimalistic-bold-duotone' as any}
                                  />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {dataFiltered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ color: 'text.secondary', fontWeight: 600 }}
                          >
                            Nenhuma cobrança encontrada.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <TablePagination
              component="div"
              count={dataFiltered.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25]}
              labelRowsPerPage="Linhas por página:"
            />
          </Card>
        </Grid>

        {/* Coluna Direita: Formulário */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ p: 3 }}>
            <CardHeader
              title="Nova Cobrança"
              subheader="Emita faturas de boleto em tempo real"
              sx={{ p: 0, mb: 3 }}
            />

            <form onSubmit={handleCreateBoleto}>
              <Stack spacing={3}>
                <TextField
                  select
                  label="Selecionar Sacado / Cidadão"
                  value={formCitizenId}
                  onChange={(e) => setFormCitizenId(e.target.value)}
                  fullWidth
                  required
                >
                  {citizens.map((citizen) => (
                    <MenuItem key={citizen.id} value={citizen.id}>
                      {citizen.name} ({(citizen.role || 'citizen').toUpperCase()})
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Valor da Cobrança"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  placeholder="0,00"
                  slotProps={{
                    input: {
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    },
                  }}
                  fullWidth
                  required
                />

                <TextField
                  type="date"
                  label="Data de Vencimento"
                  value={formDueDate}
                  onChange={(e) => setFormDueDate(e.target.value)}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                  fullWidth
                  required
                />

                <TextField
                  label="Observações / Descrição"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Ex: Pagamento referente ao lote 02"
                  multiline
                  rows={3}
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="inherit"
                  size="large"
                  startIcon={<Iconify icon={'solar:card-send-bold-duotone' as any} />}
                  fullWidth
                >
                  Gerar Boleto
                </Button>
              </Stack>
            </form>
          </Card>
        </Grid>
      </Grid>

      {/* MODAL DO BOLETO IMPRIMÍVEL */}
      <Dialog
        open={openBoletoModal}
        onClose={() => setOpenBoletoModal(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              bgcolor: 'background.paper',
              borderRadius: 2,
              overflow: 'hidden',
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            bgcolor: 'grey.100',
            px: 3,
            py: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Visualizador do Boleto
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              color="inherit"
              size="small"
              startIcon={<Iconify icon={'solar:printer-minimalistic-bold-duotone' as any} />}
              onClick={() => window.print()}
            >
              Imprimir
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              size="small"
              onClick={() => setOpenBoletoModal(false)}
            >
              Fechar
            </Button>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: 4, bgcolor: 'common.white', color: 'common.black' }}>
          {selectedBoleto && (
            <Stack spacing={3} className="printable-boleto" sx={{ fontFamily: 'monospace' }}>
              {/* Top Banner Banco */}
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: 'flex-end', borderBottom: '3px solid black', pb: 1 }}
              >
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'common.black' }}>
                  DAO BANK
                </Typography>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderRightWidth: 2, borderColor: 'common.black', height: 28 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 900, color: 'common.black' }}>
                  001-9
                </Typography>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{ borderRightWidth: 2, borderColor: 'common.black', height: 28 }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 900,
                    flexGrow: 1,
                    textAlign: 'right',
                    fontSize: 13,
                    letterSpacing: 0.5,
                  }}
                >
                  {selectedBoleto.lineCode}
                </Typography>
              </Stack>

              {/* Ficha de Compensação */}
              <Grid
                container
                sx={{
                  border: '1px solid black',
                  '& .MuiGrid-root': {
                    borderRight: '1px solid black',
                    borderBottom: '1px solid black',
                    p: 1,
                  },
                }}
              >
                <Grid
                  size={{ xs: 8 }}
                  sx={{ borderRight: '1px solid black', borderBottom: '1px solid black' }}
                >
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    Local de Pagamento
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 11 }}>
                    PAGÁVEL EM QUALQUER BANCO OU CANAL DIGITAL ATÉ O VENCIMENTO
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4 }} sx={{ borderBottom: '1px solid black' }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    Vencimento
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'bold', fontSize: 11, textAlign: 'right' }}
                  >
                    {fDate(selectedBoleto.dueDate, 'DD/MM/YYYY')}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 8 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    Beneficiário / Cedente
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 11 }}>
                    ASPPIBRA TECNOLOGIA E GOVERNANÇA DAO - CNPJ: 12.345.678/0001-90
                  </Typography>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    Agência / Código Beneficiário
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'bold', fontSize: 11, textAlign: 'right' }}
                  >
                    3477-9 / 102409-X
                  </Typography>
                </Grid>

                <Grid size={{ xs: 3 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    Data do Documento
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 11 }}>
                    {fDate(selectedBoleto.createdAt, 'DD/MM/YYYY')}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 3 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    Número do Doc.
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 11 }}>
                    {selectedBoleto.id}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    Espécie Doc.
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 11 }}>
                    DM
                  </Typography>
                </Grid>
                <Grid size={{ xs: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    Aceite
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 11 }}>
                    N
                  </Typography>
                </Grid>
                <Grid size={{ xs: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    Data Processam.
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 11 }}>
                    {fDate(selectedBoleto.createdAt, 'DD/MM/YYYY')}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 3 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    Uso do Banco
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 11 }} />
                </Grid>
                <Grid size={{ xs: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    Carteira
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 11 }}>
                    18
                  </Typography>
                </Grid>
                <Grid size={{ xs: 2 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    Espécie
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 11 }}>
                    R$
                  </Typography>
                </Grid>
                <Grid size={{ xs: 1 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    Qtd.
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 11 }} />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    Valor do Documento
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'bold', fontSize: 11, textAlign: 'right' }}
                  >
                    {fCurrency(selectedBoleto.amount / 100)}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 8 }} sx={{ height: 100 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    Instruções (Todas as informações deste boleto são de exclusiva responsabilidade
                    do cedente)
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 10, mt: 1 }}>
                    - Cobrança referente a associados cadastrados na ASPPIBRA.
                  </Typography>
                  {selectedBoleto.notes && (
                    <Typography variant="body2" sx={{ fontSize: 10, fontWeight: 'bold', mt: 0.5 }}>
                      - OBS: {selectedBoleto.notes}
                    </Typography>
                  )}
                </Grid>
                <Grid size={{ xs: 4 }} sx={{ height: 100 }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    (-) Descontos / Abatimento
                  </Typography>
                  <Divider sx={{ my: 1, borderColor: 'common.black' }} />
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    (+) Mora / Multa
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12 }} sx={{ borderBottom: 'none !important' }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', fontSize: 9, fontWeight: 'bold' }}
                  >
                    Sacado / Pagador
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 11 }}>
                    {selectedBoleto.citizenName}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 10 }}>
                    E-mail: {selectedBoleto.citizenEmail}
                  </Typography>
                  <Typography variant="body2" sx={{ fontSize: 10 }}>
                    Endereço: Av. Paulista, 1000 - Bela Vista, São Paulo - SP, CEP: 01310-100
                  </Typography>
                </Grid>
              </Grid>

              {/* Linha Código de Barras Visual */}
              <Stack spacing={1} sx={{ alignItems: 'center', pt: 2 }}>
                {/* Linha estilizada simulando código de barras */}
                <Stack
                  direction="row"
                  spacing={0}
                  sx={{
                    height: 60,
                    bgcolor: 'common.black',
                    width: '100%',
                    maxWidth: 500,
                    overflow: 'hidden',
                  }}
                >
                  {selectedBoleto.barcode.split('').map((char, index) => {
                    const width =
                      char === '0' || char === '1' || char === '2'
                        ? 2
                        : char === '3' || char === '4' || char === '5'
                          ? 4
                          : char === '6' || char === '7'
                            ? 1
                            : 6;
                    return (
                      <Divider
                        key={index}
                        orientation="vertical"
                        sx={{
                          borderRightWidth: width,
                          borderColor: index % 2 === 0 ? 'common.black' : 'common.white',
                          height: '100%',
                        }}
                      />
                    );
                  })}
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                  Código de Barras para leitura óptica
                </Typography>
              </Stack>

              {/* Botão de cópia rápida */}
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Iconify icon={'solar:copy-bold-duotone' as any} />}
                onClick={() => {
                  navigator.clipboard.writeText(selectedBoleto.lineCode);
                  toast.success('Linha digitável copiada!');
                }}
                sx={{
                  alignSelf: 'center',
                  color: 'common.black',
                  borderColor: 'common.black',
                  '&:hover': { borderColor: 'common.black', bgcolor: 'grey.100' },
                }}
              >
                Copiar Linha Digitável
              </Button>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </DashboardContent>
  );
}
