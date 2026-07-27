import os
import glob

def get_all_ts_files(directory):
    files = []
    for ext in ('*.ts', '*.tsx'):
        files.extend(glob.glob(os.path.join(directory, '**', ext), recursive=True))
    return files

def main():
    src_dir = 'src'
    all_files = get_all_ts_files(src_dir)
    
    target_dirs = [
        'src/sections/user',
        'src/sections/account'
    ]
    
    targets = []
    for f in all_files:
        if any(f.startswith(d) for d in target_dirs):
            targets.append(f)
            
    zombies = []
    for target in targets:
        if target.endswith('index.ts') or target.endswith('index.tsx') or target.endswith('view.tsx'):
            continue
            
        stem = os.path.splitext(os.path.basename(target))[0]
        
        found = False
        for f in all_files:
            if f == target:
                continue
            
            try:
                with open(f, 'r') as file:
                    content = file.read()
                    if f"'{stem}'" in content or f'"{stem}"' in content or f"./{stem}" in content or f"/{stem}" in content:
                        found = True
                        break
            except:
                pass
                
        if not found:
            zombies.append(target)
            
    print("Potential Zombies in UI Sections:")
    for z in zombies:
        print(f" - {z}")

if __name__ == '__main__':
    main()
