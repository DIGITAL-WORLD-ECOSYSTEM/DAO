#!/bin/bash
# 🧙‍♂️ Script de Coordenação de Auditoria Alpha Elite

echo "🚀 Iniciando Serviços de Auditoria..."
pkill -f wrangler || true
cd backend
npx wrangler dev --port 8788 --ip 127.0.0.1 > /tmp/wrangler_audit.log 2>&1 &
WRANGLER_PID=$!

echo "⏳ Aguardando Backend estabilizar (8s)..."
sleep 8

echo "🕵️ Rodando Auditoria E2E..."
cd ..
npx tsx audit_elite.ts

echo "🧹 Limpando ambiente..."
kill $WRANGLER_PID
pkill -f wrangler
echo "✅ Auditoria Completa."
