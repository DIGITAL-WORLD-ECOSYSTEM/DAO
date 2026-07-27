import re

with open('src/sections/overview/analytics/analytics-filters.tsx', 'r') as f:
    content = f.read()

# 1. Add useAuthContext import
import_statement = "import { useAuthContext } from 'src/auth/hooks/use-auth-context';\nimport { fDate } from 'src/utils/format-time';\n"
if "useAuthContext" not in content:
    content = content.replace("import { Label } from 'src/components/label';", import_statement + "\nimport { Label } from 'src/components/label';")

# 2. Inject hook in AnalyticsFilters
if "const { user } = useAuthContext();" not in content:
    content = content.replace("  const [showCnh, setShowCnh] = useState(false);", "  const [showCnh, setShowCnh] = useState(false);\n  const { user } = useAuthContext();")

# 3. Replace dynamic fields
replacements = {
    "ANDRESSA DE LIMA FERREIRA": "{user?.displayName || displayName}",
    "#2024001": "{`#${user?.id || '2024001'}`}",
    "Brasileira": "{user?.country || 'Não informado'}",
    "Feminino": "{user?.gender || 'Não informado'}",
    "22/06/1994": "{user?.birthDate ? fDate(user.birthDate, 'dd/MM/yyyy') : 'Não informado'}",
    "Solteira": "{user?.maritalStatus || 'Não informado'}",
    "Selma Augusta de Lima": "{user?.motherName || 'Não informado'}",
    "Marcus Antonio Pereira Ferreira": "{user?.fatherName || 'Não informado'}",
    "173.793.567-80": "{user?.cpf || 'Não informado'}",
    "***.793.567-**": "{user?.cpf ? user.cpf.replace(/(\\d{3})\\.(\\d{3})\\.(\\d{3})-(\\d{2})/, '***.$2.$3-**') : '***.***.***-**'}",
    "301461414 - Detran/RJ": "{user?.rg || 'Não informado'}",
    "***461414 - Detran/RJ": "{user?.rg ? `***${user.rg.slice(-6)}` : '***'}",
    "07949472319": "{user?.cnh || 'Não informado'}",
    "***494723**": "{user?.cnh ? `***${user.cnh.slice(3, -2)}**` : '***'}",
    "AB": "{user?.cnhCategory || 'Não Possui'}",
    "Manicure": "{user?.occupation || 'Não informado'}",
    "+55 (21) 96478-4089": "{user?.phoneNumber || 'Não informado'}",
    "andressa.ferreira@email.com": "{user?.email || 'Não informado'}",
    "@andressa.ferreira": "{user?.username ? `@${user.username}` : 'Não informado'}",
    "24912-000": "{user?.zipCode || 'Não informado'}",
    "Rua Palmira F. De Carvalho, lote 05, Quadra D": "{user?.physicalAddress || 'Não informado'}",
    "São José de Imbassaí": "{user?.neighborhood || 'Não informado'}",
    "Maricá - RJ": "{user?.city && user?.state ? `${user.city} - ${user.state}` : 'Não informado'}"
}

# The avatar initials need a fix to use user
avatar_logic = """  const avatarInitials = user?.displayName
    ? user.displayName.charAt(0).toUpperCase() + (user.displayName.split(' ')[1]?.charAt(0).toUpperCase() || '')
    : searchQuery
    ? searchQuery.charAt(0).toUpperCase() +
      (searchQuery.split(' ')[1]?.charAt(0).toUpperCase() || searchQuery.charAt(1)?.toLowerCase())
    : 'Ad';"""

content = re.sub(r"  const avatarInitials = searchQuery\n.*?\n.*?: 'Ad';", avatar_logic, content, flags=re.DOTALL)
content = content.replace(">AF<", ">{avatarInitials}<")

for old, new in replacements.items():
    # Only replace if it is exact and within JSX
    content = content.replace(f">{old}<", f">{new}<")
    # For the conditional ternary inside strings:
    content = content.replace(f"'{old}'", f"{new}")

# specifically for CNH:
# {showCnh ? '{user?.cnh || 'Não informado'}' : '{user?.cnh ? `***${user.cnh.slice(3, -2)}**` : '***'}'} is invalid syntax.
# The python replace might create nested curly braces.
# We will manually fix the eye toggles:
eye_cpf_old = "{showCpf ? '173.793.567-80' : '***.793.567-**'}"
eye_cpf_new = "{showCpf ? (user?.cpf || 'Não informado') : (user?.cpf ? user.cpf.replace(/^\\d{3}/, '***').replace(/\\d{2}$/, '**') : '***.***.***-**')}"
content = content.replace(eye_cpf_old, eye_cpf_new)

eye_rg_old = "{showRg ? '301461414 - Detran/RJ' : '***461414 - Detran/RJ'}"
eye_rg_new = "{showRg ? (user?.rg || 'Não informado') : (user?.rg ? `***${user.rg.slice(3)}` : '***')}"
content = content.replace(eye_rg_old, eye_rg_new)

eye_cnh_old = "{showCnh ? '07949472319' : '***494723**'}"
eye_cnh_new = "{showCnh ? (user?.cnh || 'Não informado') : (user?.cnh ? `***${user.cnh.slice(3, -2)}**` : '***')}"
content = content.replace(eye_cnh_old, eye_cnh_new)

# For "Maricá - RJ" it's >Maricá - RJ<
content = content.replace(">Maricá - RJ<", ">{user?.city && user?.state ? `${user.city} - ${user.state}` : 'Não informado'}<")

with open('src/sections/overview/analytics/analytics-filters.tsx', 'w') as f:
    f.write(content)

