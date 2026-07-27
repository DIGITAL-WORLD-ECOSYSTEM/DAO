import os
import re

def analyze_section(base_dir):
    data = []
    if not os.path.exists(base_dir):
        return data
        
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                path = os.path.join(root, file)
                with open(path, 'r') as f:
                    content = f.read()
                    
                # Find components used (Capitalized words in JSX)
                components = set(re.findall(r'<([A-Z][a-zA-Z0-9_]*)', content))
                # Find hooks
                hooks = set(re.findall(r'use[A-Z][a-zA-Z0-9_]*', content))
                # Find z. or zod
                zod = 'Sim' if 'z.' in content or 'zod' in content.lower() else 'Nao'
                # Find API calls or mutations
                api = set(re.findall(r'(?:axios\.|fetch\(|mutate\()', content))
                
                # Check UI/UX metrics loosely
                responsive = 'xs=' in content or 'sm=' in content or 'md=' in content
                
                data.append({
                    'file': os.path.relpath(path, base_dir),
                    'components': len(components),
                    'hooks': len(hooks),
                    'zod': zod,
                    'api': len(api),
                    'responsive': responsive
                })
    return data

def analyze_hooks():
    hooks_dir = '/home/sandro/DAO/dashboard/src/hooks'
    hooks = []
    if os.path.exists(hooks_dir):
        for f in os.listdir(hooks_dir):
            if f.endswith('.ts'):
                hooks.append(f)
    return hooks
    
def analyze_contexts():
    contexts_dir = '/home/sandro/DAO/dashboard/src/auth/context'
    contexts = []
    if os.path.exists(contexts_dir):
        for root, _, files in os.walk(contexts_dir):
            for f in files:
                if f.endswith('.tsx') or f.endswith('.ts'):
                    contexts.append(os.path.relpath(os.path.join(root, f), contexts_dir))
    return contexts

def main():
    print("--- FASE 3: IDENTITY DIGITAL ---")
    account = analyze_section('/home/sandro/DAO/dashboard/src/sections/account')
    for item in account:
        print(item)
        
    print("\n--- FASE 4: USER DIRECTORY ---")
    user = analyze_section('/home/sandro/DAO/dashboard/src/sections/user')
    for item in user:
        print(item)
        
    print("\n--- FASE 6: DEVOS ---")
    devos = analyze_section('/home/sandro/DAO/dashboard/src/pages/devos')
    for item in devos:
        print(item)
        
    print("\n--- FASE 8: HOOKS E CONTEXTS ---")
    print("Hooks:", analyze_hooks())
    print("Contexts:", analyze_contexts())

if __name__ == '__main__':
    main()
