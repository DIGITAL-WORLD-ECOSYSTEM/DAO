import os
import glob

def get_all_ts_files(directory):
    files = []
    for ext in ('*.ts', '*.tsx'):
        files.extend(glob.glob(os.path.join(directory, '**', ext), recursive=True))
    return files

def get_exports(filepath):
    exports = []
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            # Simplistic parsing, just grab filename stem
            stem = os.path.splitext(os.path.basename(filepath))[0]
            if stem == 'index':
                stem = os.path.basename(os.path.dirname(filepath))
            return stem
    except:
        return ""

def main():
    src_dir = 'src'
    all_files = get_all_ts_files(src_dir)
    
    # We want to check specifically files in:
    # src/pages/dashboard/user
    # src/sections/account
    # src/sections/user
    
    target_dirs = [
        'src/pages/dashboard/user',
        'src/sections/account',
        'src/sections/user'
    ]
    
    targets = []
    for f in all_files:
        if any(f.startswith(d) for d in target_dirs):
            targets.append(f)
            
    print(f"Found {len(targets)} files to audit.")
    
    zombies = []
    for target in targets:
        # Skip view wrappers and index files that just export things
        if target.endswith('index.ts') or target.endswith('index.tsx'):
            continue
            
        stem = os.path.splitext(os.path.basename(target))[0]
        
        # Search for this stem (as an import) in all other files
        found = False
        for f in all_files:
            if f == target:
                continue
            
            try:
                with open(f, 'r') as file:
                    content = file.read()
                    if stem in content:
                        found = True
                        break
            except:
                pass
                
        if not found:
            zombies.append(target)
            
    print("Potential Zombies (no direct import found by stem):")
    for z in zombies:
        print(f" - {z}")

if __name__ == '__main__':
    main()
