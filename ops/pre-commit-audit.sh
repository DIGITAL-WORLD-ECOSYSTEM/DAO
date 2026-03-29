#!/bin/bash
# ----------------------------------------------------------------------
# Project: ASPPIBRA DAO
# Role: Pre-commit Audit Gate (The Auditor Agent)
# ----------------------------------------------------------------------

echo "🔍 Starting Security and Governance Audit..."

# 1. Check for hardcoded secrets/tokens
echo "   [1/3] Scanning for secrets..."
GREP_SECRETS=$(grep -rE "AIza[0-9A-Za-z-_]{35}|xox[bapz]-[0-9]{12}|ghp_[0-9A-Za-z]{36}|SG\.[0-9A-Za-z]{22}" src/ backend/ frontend/ 2>/dev/null)
if [ ! -z "$GREP_SECRETS" ]; then
    echo "❌ ERROR: Hardcoded secrets detected!"
    echo "$GREP_SECRETS"
    exit 1
fi

# 2. Check for anti-patterns
echo "   [2/3] Checking for known anti-patterns..."
if grep -r "process.env" frontend/src/ --exclude="layout.tsx" 2>/dev/null; then
    echo "⚠️  WARNING: Direct process.env usage detected outside of layout.tsx. Consider using CONFIG."
fi

# 3. Verify Skill Metadata
echo "   [3/3] Validating Skill Files metadata..."
for file in skills/*.md; do
    # Using -- to ensure grep treats "---" as a pattern, not an option
    if ! head -n 1 "$file" | grep -q -- "---"; then
        echo "❌ ERROR: Skill file $file is missing YAML metadata header."
        exit 1
    fi
done

echo "✅ Audit Passed. Proseguindo com o commit."
exit 0
