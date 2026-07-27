import re

path = 'src/sections/account/account-change-password.tsx'
with open(path, 'r') as f:
    content = f.read()

# Replace <Grid item xs={12}> with <Grid size={{ xs: 12 }}>
content = re.sub(r'<Grid\s+item\s+xs={(\d+)}>', r'<Grid size={{ xs: \1 }}>', content)

# Replace <Grid item xs={12} md={8}> with <Grid size={{ xs: 12, md: 8 }}>
content = re.sub(r'<Grid\s+item\s+xs={(\d+)}\s+md={(\d+)}>', r'<Grid size={{ xs: \1, md: \2 }}>', content)

# Replace <Grid item xs={12} sm={6}> with <Grid size={{ xs: 12, sm: 6 }}>
content = re.sub(r'<Grid\s+item\s+xs={(\d+)}\s+sm={(\d+)}>', r'<Grid size={{ xs: \1, sm: \2 }}>', content)

# Fix fontWeight="bold" to sx={{ fontWeight: 'bold' }} in Typography
content = content.replace('fontWeight="bold"', 'sx={{ fontWeight: \'bold\' }}')

with open(path, 'w') as f:
    f.write(content)
