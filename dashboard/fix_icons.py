import re

path = 'src/sections/account/account-change-password.tsx'
with open(path, 'r') as f:
    content = f.read()

# Replace icon="xxx" with icon={"xxx" as any}
# But only for those that are not standard (we'll just do it for the ones failing)
failed_icons = [
    "solar:star-bold",
    "solar:danger-circle-bold",
    "solar:shield-check-bold-duotone",
    "solar:history-bold-duotone",
    "logos:chrome",
    "logos:android-icon",
    "solar:laptop-minimalistic-bold-duotone",
    "solar:fingerprint-bold-duotone"
]

for icon in failed_icons:
    content = content.replace(f'icon="{icon}"', f'icon={{"{icon}" as any}}')

with open(path, 'w') as f:
    f.write(content)
