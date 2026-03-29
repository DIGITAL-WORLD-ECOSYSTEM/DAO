import { useState } from 'react';
import { ShamirCore } from '@dao/shared';
// Mock de componentes UI (deve ser substituído pelos reais do sistema)
// import { Button, Card, Typography, TextField } from '@mui/material'; 

export default function SocialRecoveryView() {
  const [shards, setShards] = useState<string[]>([]);
  const [threshold, setThreshold] = useState(2);
  const [step, setStep] = useState(1);

  const handleGenerateShards = async () => {
    const vaultData = localStorage.getItem('dao_vault');
    if (!vaultData) return alert('Vault não encontrado!');
    
    const { mnemonic } = JSON.parse(vaultData);
    const entropy = new TextEncoder().encode(mnemonic); // Simplificado para o PoC
    
    // Divide em 3 fragmentos com threshold de 2
    const splitShards = ShamirCore.split(entropy, 3, threshold);
    const shardsBase64 = splitShards.map(s => btoa(String.fromCharCode(...s)));
    
    setShards(shardsBase64);
    setStep(2);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>🛡️ Configurar Recuperação Social</h1>
      
      {step === 1 && (
        <div>
          <p>O Social Recovery permite que você recupere seu acesso mesmo se perder suas 24 palavras.</p>
          <p>Dividiremos sua chave em 3 fragmentos. Você precisará de {threshold} deles para recuperar.</p>
          <button onClick={handleGenerateShards} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Gerar Fragmentos de Segurança
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3>✅ Fragmentos Gerados com Sucesso!</h3>
          <p>Envie cada um desses fragmentos para um guardião diferente (amigo, familiar ou outro dispositivo).</p>
          
          {shards.map((shard, i) => (
            <div key={i} style={{ background: '#f0f0f0', padding: '10px', marginBottom: '10px', wordBreak: 'break-all' }}>
              <strong>Fragmento {i + 1}:</strong>
              <pre>{shard}</pre>
            </div>
          ))}
          
          <button onClick={() => alert('Setup Concluído!')} style={{ padding: '10px 20px' }}>
            Concluir Setup
          </button>
        </div>
      )}
    </div>
  );
}
