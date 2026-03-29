'use client';

import React, { useState } from 'react';
import { Container, Typography, Box, Stepper, Step, StepLabel } from '@mui/material';
import { CryptoCore } from '@dao/shared';
import { EntropyCollector } from '../components/EntropyCollector';
import { MnemonicView } from '../components/MnemonicView';
import { SplashScreen } from 'src/components/loading-screen';

/**
 * RegisterGenesisView: Orquestrador da criação de identidade SSI.
 * Fluxo: Captura de Entropia -> Exibição de Mnemônico -> Seed Derivada.
 */
import { TextField, Button, Alert, CircularProgress } from '@mui/material';
import axios from 'src/lib/axios'; // Usando o axios configurado do projeto
import { endpoints } from 'src/lib/axios';

import { LocalVault } from '../services/LocalVault';
import { PasskeyService } from '../services/PasskeyService';

/**
 * RegisterGenesisView: Orquestrador da criação de identidade SSI.
 * Fluxo: Handle -> Entropia -> Mnemônico -> Fortress (PIN) -> Passkey -> Ativação.
 */
export function RegisterGenesisView() {
  const [activeStep, setActiveStep] = useState(0);
  const [username, setUsername] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [pin, setPin] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartGenesis = () => {
    if (!username || username.length < 3) {
      setError('O username deve ter pelo menos 3 caracteres.');
      return;
    }
    setError(null);
    setActiveStep(1);
  };

  const handleEntropyComplete = (entropy: string) => {
    setIsGenerating(true);
    setError(null);
    setTimeout(async () => {
      try {
        const newMnemonic = CryptoCore.generateMnemonic();
        setMnemonic(newMnemonic);
        setIsGenerating(false);
        setActiveStep(2);
      } catch (e) {
        setError('Erro ao gerar chaves criptográficas.');
        setIsGenerating(false);
      }
    }, 1500);
  };

  const handleMnemonicConfirmed = () => {
    // 🛡️ Mnemonic Backup Challenge
    const words = mnemonic.split(' ');
    const check = prompt(`Para sua segurança, digite a 1ª e a 24ª palavra do seu mnemônico (separadas por espaço):`);
    
    if (check !== `${words[0]} ${words[23]}`) {
      setError('Verificação de backup falhou! Por favor, anote as palavras corretamente.');
      return;
    }
    
    setError(null);
    setActiveStep(3); // Ir para Fortress (PIN)
  };

  const handleFortressComplete = async () => {
    if (pin.length < 4) {
      setError('O PIN deve ter pelo menos 4 dígitos.');
      return;
    }
    setIsGenerating(true);
    try {
      // 1. Salvar no LocalVault (Criptografado)
      await LocalVault.saveMnemonic(mnemonic, pin);
      
      // 2. Registrar na DAO (D1)
      const challengeRes = await axios.get(`${endpoints.auth.signUp.replace('register', 'challenge')}/${username}`);
      const { challenge } = challengeRes.data;
      const seed = await CryptoCore.deriveSeed(mnemonic, '');
      const { priv, pub } = CryptoCore.getEd25519KeyPair(seed);
      const signature = CryptoCore.sign(new TextEncoder().encode(challenge), priv);

      await axios.post(endpoints.auth.signUp, {
        username,
        publicKey: JSON.stringify(Array.from(pub)),
        signature: JSON.stringify(Array.from(signature)),
        challenge
      });

      setActiveStep(4); // Passkey (Opcional)
    } catch (e: any) {
      setError(e.response?.data?.message || 'Erro ao ativar sua identidade.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSkipPasskey = () => setActiveStep(5);

  const handleAddPasskey = async () => {
    setIsGenerating(true);
    try {
      const credential: any = await PasskeyService.register(username);
      await axios.post('/api/core/identity/passkey/bind', {
        username,
        credentialId: credential.id,
        publicKey: JSON.stringify(Array.from(new Uint8Array(credential.response.getPublicKey())))
      });
      setActiveStep(5);
    } catch (e: any) {
      setError('Erro ao vincular biometria. Você pode fazer isso depois nas configurações.');
      setActiveStep(5);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) return <SplashScreen />;

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>Gênese do Cidadão</Typography>
        <Typography variant="body1" color="textSecondary">
          Nível de Segurança: <b>Cofre de Elite (SSI)</b>
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} sx={{ mb: 8 }}>
        <Step><StepLabel>Handle</StepLabel></Step>
        <Step><StepLabel>Entropia</StepLabel></Step>
        <Step><StepLabel>Cofre</StepLabel></Step>
        <Step><StepLabel>Segurança</StepLabel></Step>
        <Step><StepLabel>Passkey</StepLabel></Step>
        <Step><StepLabel>Ativado</StepLabel></Step>
      </Stepper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {activeStep === 0 && (
        <Box sx={{ textAlign: 'center' }}>
          <TextField fullWidth label="Seu Handle (Username)" value={username} onChange={(e) => setUsername(e.target.value)} sx={{ mb: 3 }} />
          <Button variant="contained" size="large" onClick={handleStartGenesis} disabled={!username}>Iniciar Gênese</Button>
        </Box>
      )}

      {activeStep === 1 && <EntropyCollector onComplete={handleEntropyComplete} />}
      {activeStep === 2 && <MnemonicView mnemonic={mnemonic} onConfirm={handleMnemonicConfirmed} />}

      {activeStep === 3 && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>🏰 Proteja seu Cofre</Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>Defina um PIN para criptografar suas chaves localmente no navegador.</Typography>
          <TextField fullWidth type="password" label="PIN de Segurança" value={pin} onChange={(e) => setPin(e.target.value)} sx={{ mb: 3 }} />
          <Button variant="contained" size="large" onClick={handleFortressComplete}>Ativar Fortress</Button>
        </Box>
      )}

      {activeStep === 4 && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ mb: 2 }}>☝️ Ativar Biometria?</Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>Deseja usar FaceID ou TouchID para logins rápidos no futuro?</Typography>
          <Button variant="contained" size="large" onClick={handleAddPasskey} sx={{ mr: 2 }}>Sim, Ativar Passkey</Button>
          <Button variant="text" onClick={handleSkipPasskey}>Pular por enquanto</Button>
        </Box>
      )}

      {activeStep === 5 && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5">🎉 Identidade Ativada!</Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>Seu DID é: <b>did:dao:asppibra:{username}</b></Typography>
          <Button variant="outlined" sx={{ mt: 4 }} href="/identity/sign-in">Acessar Ecossistema</Button>
        </Box>
      )}
    </Container>
  );
}
