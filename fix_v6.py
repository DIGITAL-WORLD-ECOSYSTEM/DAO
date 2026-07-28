import re
import os

files_to_fix = [
    "src/sections/blog/_components/PostAuthors.tsx",
    "src/sections/blog/_components/PostFeatured.tsx",
    "src/sections/blog/_components/PostSearch.tsx",
    "src/sections/blog/_components/PostVideo.tsx",
    "src/sections/blog/_forms/PostNewsletter.tsx",
    "src/sections/home/_components/HomeCommunity.tsx",
    "src/sections/home/_components/HomeCountdownDialog.tsx",
    "src/sections/home/_components/HomeEcosystem.tsx",
    "src/sections/home/_components/HomeHero.tsx",
    "src/sections/home/_components/HomeHeroSvg.tsx",
    "src/sections/home/_components/HomeIntegrations.tsx",
    "src/sections/home/_components/HomeLatestNews.tsx",
    "src/sections/home/_components/HomeRoadmap.tsx",
    "src/sections/home/_components/HomeTeam.tsx",
    "src/sections/team/_view/TeamView.tsx"
]

def fix_component_props(content):
    # For every property we want to move: alignItems, justifyContent, flexWrap, textAlign, display, gridColumn
    props_to_move = ['alignItems', 'justifyContent', 'flexWrap', 'textAlign', 'display', 'gridColumn']
    
    # We will look for <Stack ... or <Grid ... that has these props.
    # It's easier to just find the prop assignments and move them to the closest sx={{...}}
    # But since regex on HTML is hard, let's do this:
    # Find all occurrences of e.g. `alignItems="center"`
    # Replace it with nothing, and insert `alignItems: 'center',` into the very next `sx={{` block
    
    # A safer regex approach:
    # Match a JSX tag block: <Stack ... > or <Grid ... >
    # This might span multiple lines.
    
    def tag_replacer(match):
        tag_content = match.group(0)
        
        # Extract props to move
        moved_props = []
        for prop in props_to_move:
            # Match prop="value"
            p = re.compile(rf'\b{prop}="([^"]+)"')
            m = p.search(tag_content)
            if m:
                moved_props.append(f"{prop}: '{m.group(1)}'")
                tag_content = p.sub('', tag_content)
            
            # Match prop={{ xs: '...', md: '...' }}
            p2 = re.compile(rf'\b{prop}={{\{{([^}}]+)\}}}}')
            m2 = p2.search(tag_content)
            if m2:
                moved_props.append(f"{prop}: {{{m2.group(1)}}}")
                tag_content = p2.sub('', tag_content)
        
        if not moved_props:
            return tag_content
            
        props_str = ", ".join(moved_props) + ", "
        
        # Now find sx={{ and insert the props
        if 'sx={{' in tag_content:
            tag_content = tag_content.replace('sx={{', f'sx={{{props_str}', 1)
        else:
            # If there's no sx={{, we append it before the closing >
            # Check if self-closing /> or >
            if tag_content.endswith('/>'):
                tag_content = tag_content[:-2] + f' sx={{{{{props_str}}}}} />'
            else:
                tag_content = tag_content[:-1] + f' sx={{{{{props_str}}}}} >'
                
        return tag_content

    # Regex to find <Stack ... > or <Grid ... > or <Box ... >
    # This is a bit naive but should work for formatted code
    pattern = re.compile(r'<(Stack|Grid2?|Box)\b[^>]*>', re.DOTALL)
    content = pattern.sub(tag_replacer, content)
    
    return content

for file_path in files_to_fix:
    full_path = os.path.join("frontend", file_path)
    if not os.path.exists(full_path):
        continue
        
    with open(full_path, "r") as f:
        content = f.read()
        
    new_content = fix_component_props(content)
    
    # Specific fixes for InputProps and PaperProps
    new_content = new_content.replace('InputProps={{', 'slotProps={{ input: {')
    new_content = new_content.replace('PaperProps={{', 'slotProps={{ paper: {')
    
    if new_content != content:
        with open(full_path, "w") as f:
            f.write(new_content)
        print(f"Fixed {file_path}")

# Now fix the theme files
theme_files = [
    "src/theme/core/components/card.tsx",
    "src/theme/core/components/list.tsx",
    "src/theme/core/components/table.tsx"
]

for file_path in theme_files:
    full_path = os.path.join("frontend", file_path)
    if not os.path.exists(full_path):
        continue
    
    with open(full_path, "r") as f:
        content = f.read()
        
    if "card.tsx" in file_path:
        content = content.replace('titleTypographyProps:', 'slotProps: { title: ')
        # Need to balance the braces, this is tricky. Actually, for card.tsx, it's:
        # titleTypographyProps: { typography: 'h6' },
        # -> slotProps: { title: { typography: 'h6' } },
        content = re.sub(r'titleTypographyProps:\s*({[^}]+})', r'slotProps: { title: \1 }', content)
        content = re.sub(r'subheaderTypographyProps:\s*({[^}]+})', r'slotProps: { subheader: \1 }', content)
        
    if "list.tsx" in file_path:
        # primary: { typography: 'subtitle2' } -> slotProps: { primary: { typography: 'subtitle2' } } ???
        # Actually in ListItemText, v6 removed primaryTypographyProps?
        # Let's check TS errors: "Object literal may only specify known properties, and 'typography' does not exist in type 'TypographyProps...'"
        # Wait, the old code was `primary: { typography: 'subtitle2' }`. In v6, maybe `primaryTypographyProps` is STILL there, but they changed `defaultProps`.
        pass
        
    if "table.tsx" in file_path:
        content = re.sub(r'backIconButtonProps:\s*({[^}]+})', r'slotProps: { actions: { previousButton: \1 } }', content)
        content = re.sub(r'nextIconButtonProps:\s*({[^}]+})', r'slotProps: { actions: { nextButton: \1 } }', content)

    with open(full_path, "w") as f:
        f.write(content)
    print(f"Fixed {file_path}")

