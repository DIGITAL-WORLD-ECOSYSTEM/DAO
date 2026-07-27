import re

path = 'src/sections/account/account-notifications.tsx'
with open(path, 'r') as f:
    content = f.read()

def replace_stack(match):
    tag = match.group(0)
    
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
    
    sx_match = re.search(r'sx={{([^}]+)}}', tag)
    if sx_match:
        existing_sx = sx_match.group(1)
        new_sx = f'sx={{{existing_sx}, {sx_string}}}'
        tag = tag.replace(f'sx={{{existing_sx}}}', new_sx)
    else:
        tag = tag.replace('>', f' sx={{{{ {sx_string} }}}}>')
        
    return tag

content = re.sub(r'<Stack[^>]+>', replace_stack, content)

with open(path, 'w') as f:
    f.write(content)
