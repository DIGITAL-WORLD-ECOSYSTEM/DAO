import re

# Fix associate-search-card.tsx
with open("src/sections/overview/analytics/associate-search-card.tsx", "r") as f:
    card = f.read()

card = card.replace(
    'const { InputProps, ...rest } = params as any;',
    'const { InputProps, ...rest } = params as any;'
) # wait, didn't I plan to add the 'as any'?

card = card.replace(
    'renderInput={(params) => (',
    'renderInput={(params: any) => ('
)
card = card.replace('solar:magnifer-bold-duotone', 'eva:search-fill')
card = card.replace('solar:user-id-bold-duotone', 'solar:user-id-bold')

with open("src/sections/overview/analytics/associate-search-card.tsx", "w") as f:
    f.write(card)

# Fix analytics-ledger-view.tsx
with open("src/sections/overview/analytics/view/analytics-ledger-view.tsx", "r") as f:
    ledger = f.read()

ledger = ledger.replace(
    'tx.counterparty_name',
    'tx: any) => {\n        const searchLower = searchQuery.toLowerCase();\n        return (\n          tx.counterparty_name'
)
# Actually let's use regex for tx
ledger = re.sub(r'filter\(\(tx\) => \{', 'filter((tx: any) => {', ledger)

with open("src/sections/overview/analytics/view/analytics-ledger-view.tsx", "w") as f:
    f.write(ledger)

# Fix analytics-contract-view.tsx
with open("src/sections/overview/analytics/view/analytics-contract-view.tsx", "r") as f:
    contract = f.read()

contract = contract.replace(
    "import { AnalyticsFilters } from '../analytics-filters';",
    "import { AnalyticsFilters } from '../analytics-filters';\nimport { MOCK_FINANCIAL_PROFILES } from '../mock-financial-profile';"
)

contract = contract.replace(
    "<AnalyticsFilters",
    "<AnalyticsFilters\n        profile={MOCK_FINANCIAL_PROFILES[0]}"
)

with open("src/sections/overview/analytics/view/analytics-contract-view.tsx", "w") as f:
    f.write(contract)

