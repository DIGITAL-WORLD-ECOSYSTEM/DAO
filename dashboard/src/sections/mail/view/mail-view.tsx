import { toast } from 'sonner';
import { useBoolean } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';

import { DashboardContent } from 'src/layouts/dashboard';
import { syncEmails, useGetMails, useGetLabels, useGetAccounts } from 'src/actions/mail';

import { MailNav } from '../mail-nav';
import { MailLayout } from '../layout';
import { MailList } from '../mail-list';
import { MailHeader } from '../mail-header';
import { MailTopBar } from '../mail-topbar';
import { MailCompose } from '../mail-compose';
import { MailDetails } from '../mail-details';
import { MailDashboard } from '../mail-dashboard';

// ----------------------------------------------------------------------

const LABEL_INDEX = 'all';

export function MailView() {
  const mdUp = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const [selectedLabelId, setSelectedLabelId] = useState(LABEL_INDEX);
  const [selectedMailId, setSelectedMailId] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  const openNav = useBoolean();
  const openMail = useBoolean();
  const openCompose = useBoolean();

  const { accounts, accountsLoading } = useGetAccounts();
  const { labels, labelsLoading, labelsEmpty } = useGetLabels(selectedAccountId);

  // Set default account when loaded
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  const { mails, mailsLoading, mailsError, mailsEmpty, refetchMails } = useGetMails(
    selectedLabelId,
    selectedAccountId
  );

  const mail = mails.byId[selectedMailId];
  const mailLoading = mailsLoading;
  const mailError = mailsError;

  const firstMailId = mails.allIds[0] || '';

  const handleToggleCompose = useCallback(() => {
    if (openNav.value) {
      openNav.onFalse();
    }
    openCompose.onToggle();
  }, [openCompose, openNav]);

  const handleClickLabel = useCallback(
    (labelId: string) => {
      if (!mdUp) {
        openNav.onFalse();
      }
      setSelectedLabelId(labelId);
    },
    [mdUp, openNav]
  );

  const handleClickMail = useCallback(
    (mailId: string) => {
      if (!mdUp) {
        openMail.onFalse();
      }
      setSelectedMailId(mailId);
    },
    [mdUp, openMail]
  );

  const handleSync = useCallback(async () => {
    if (!selectedAccountId) return;
    try {
      setIsSyncing(true);
      const res = await syncEmails(selectedAccountId);
      toast.success(`Sincronização concluída! ${res.count} novos e-mails.`);
      if (refetchMails) {
        refetchMails();
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao sincronizar e-mails.');
    } finally {
      setIsSyncing(false);
    }
  }, [selectedAccountId, refetchMails]);

  useEffect(() => {
    if (!selectedMailId && firstMailId) {
      handleClickMail(firstMailId);
    }
  }, [firstMailId, handleClickMail, selectedMailId]);

  return (
    <>
      <DashboardContent
        maxWidth={false}
        sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}
      >
        <MailTopBar
          selectedAccountId={selectedAccountId}
          onChangeAccount={setSelectedAccountId}
          onToggleCompose={handleToggleCompose}
          onSync={handleSync}
          isSyncing={isSyncing}
        />

        <MailDashboard mails={mails} />

        <MailLayout
          sx={{
            p: 1,
            borderRadius: 2,
            flex: '1 1 auto',
            bgcolor: 'background.neutral',
          }}
          slots={{
            header: (
              <MailHeader
                onOpenNav={openNav.onTrue}
                onOpenMail={mailsEmpty ? undefined : openMail.onTrue}
                sx={{ display: { md: 'none' } }}
              />
            ),
            nav: (
              <MailNav
                labels={labels}
                isEmpty={labelsEmpty}
                loading={labelsLoading}
                openNav={openNav.value}
                onCloseNav={openNav.onFalse}
                selectedLabelId={selectedLabelId}
                onClickLabel={handleClickLabel}
                onToggleCompose={handleToggleCompose}
              />
            ),
            list: (
              <MailList
                mails={mails}
                isEmpty={mailsEmpty}
                loading={mailsLoading}
                openMail={openMail.value}
                onCloseMail={openMail.onFalse}
                onClickMail={handleClickMail}
                selectedLabelId={selectedLabelId}
                selectedMailId={selectedMailId}
              />
            ),
            details: (
              <MailDetails
                mail={mail}
                error={mailError?.message}
                loading={mailsLoading || mailLoading}
                renderLabel={(id: string) => labels.find((label) => label.id === id)}
              />
            ),
          }}
          slotProps={{
            list: {
              sx: [mailsEmpty && { display: 'flex', flex: '1 1 auto' }],
            },
            details: {
              sx: [mailsEmpty && { display: 'none' }],
            },
          }}
        />
      </DashboardContent>

      {openCompose.value && <MailCompose onCloseCompose={openCompose.onFalse} />}
    </>
  );
}
