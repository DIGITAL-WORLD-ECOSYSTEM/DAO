import re

path = 'src/sections/account/account-change-password.tsx'
with open(path, 'r') as f:
    content = f.read()

# Fix Stack alignItems="center" -> sx={{ alignItems: 'center' }}
# We have to be careful not to overwrite existing sx.
# Let's do it with regex. If there's an existing sx, we can merge it.

def replace_stack(match):
    tag = match.group(0)
    
    # Extract alignItems and justifyContent
    align_match = re.search(r'alignItems="([^"]+)"', tag)
    justify_match = re.search(r'justifyContent="([^"]+)"', tag)
    
    if not align_match and not justify_match:
        return tag
        
    sx_additions = []
    if align_match:
        sx_additions.append(f"alignItems: '{align_match.group(1)}'")
        tag = re.sub(r'\s*alignItems="[^"]+"', '', tag)
        
    if justify_match:
        sx_additions.append(f"justifyContent: '{justify_match.group(1)}'")
        tag = re.sub(r'\s*justifyContent="[^"]+"', '', tag)
        
    sx_string = ", ".join(sx_additions)
    
    # Check if sx already exists
    sx_match = re.search(r'sx={{([^}]+)}}', tag)
    if sx_match:
        existing_sx = sx_match.group(1)
        new_sx = f'sx={{{existing_sx}, {sx_string}}}'
        tag = tag.replace(f'sx={{{existing_sx}}}', new_sx)
    else:
        # Add sx just before the closing >
        tag = tag.replace('>', f' sx={{{{ {sx_string} }}}}>')
        
    return tag

content = re.sub(r'<Stack[^>]+>', replace_stack, content)

# Also fix ALL icon="..." in Iconify to icon={"..." as any} to completely avoid TS errors.
# Only if it's currently a string literal (starts with ")
content = re.sub(r'icon="([^"]+)"', r'icon={"\1" as any}', content)

with open(path, 'w') as f:
    f.write(content)
