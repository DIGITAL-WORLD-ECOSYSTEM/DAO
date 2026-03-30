#!/bin/bash
# ----------------------------------------------------------------------
# Project: ASPPIBRA DAO
# Role: Pre-commit Audit Gate (The Auditor Agent)
# ----------------------------------------------------------------------

echo "🔍 Starting Security and Governance Audit (Monorepo v2.2)..."

# 1. Check for hardcoded secrets/tokens
echo "   [1/4] Scanning for secrets..."
# Scan all source and governance files
GREP_SECRETS=$(grep -rE "AIza[0-9A-Za-z-_]{35}|xox[bapz]-[0-9]{12}|ghp_[0-9A-Za-z]{36}|SG\.[0-9A-Za-z]{22}" frontend/src/ backend/src/ governance/ 2>/dev/null)
if [ ! -z "$GREP_SECRETS" ]; then
    echo "❌ ERROR: Hardcoded secrets detected!"
    echo "$GREP_SECRETS"
    exit 1
fi

# 2. Check for staged .env files
echo "   [2/4] Verifying staged files for credentials..."
if git diff --cached --name-only | grep -E "\.env|\.dev\.vars|\.pem$"; then
    echo "❌ ERROR: Attempted to commit sensitive files! (.env, .dev.vars, .pem)"
    exit 1
fi

# 3. Run Shared Package Tests
echo "   [3/4] Running Shared Package Tests..."
pnpm --filter @dao/shared test || { echo "❌ ERROR: Shared tests failed!"; exit 1; }

# 3.5 Run Backend Unit Tests (Certified 2026)
echo "   [3.5/4] Running Backend Unit Tests..."
pnpm --filter gov-system-backend test || { echo "❌ ERROR: Backend tests failed!"; exit 1; }

# 4. Verify Skill Metadata
echo "   [4/4] Validating Skill Files metadata..."
# Check the new governance path
for file in governance/agents/skills/*.md; do
    if [ -f "$file" ]; then
        if ! head -n 1 "$file" | grep -q -- "---"; then
            echo "❌ ERROR: Skill file $file is missing YAML metadata header."
            exit 1
        fi
    fi
done

echo "✅ Audit Passed. Proceeding with the commit."
exit 0
