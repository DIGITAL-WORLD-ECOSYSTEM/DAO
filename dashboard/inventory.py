import os
import re

def count_files(base_dir):
    stats = {
        'total_files': 0,
        'pages': 0,
        'routes': 0,
        'components': 0,
        'hooks': 0,
        'contexts': 0,
        'sections': 0,
        'utils': 0
    }
    
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                stats['total_files'] += 1
                
                path = os.path.join(root, file)
                
                if '/pages/' in path:
                    stats['pages'] += 1
                if '/routes/' in path:
                    stats['routes'] += 1
                if '/components/' in path:
                    stats['components'] += 1
                if '/hooks/' in path:
                    stats['hooks'] += 1
                if '/context/' in path or '/contexts/' in path or file.endswith('Context.tsx') or file.endswith('context.tsx'):
                    stats['contexts'] += 1
                if '/sections/' in path:
                    stats['sections'] += 1
                if '/utils/' in path:
                    stats['utils'] += 1

    return stats

def map_routes(routes_file):
    if not os.path.exists(routes_file):
        return []
        
    routes = []
    with open(routes_file, 'r') as f:
        content = f.read()
        
    # Basic regex to find { path: '...', element: ... }
    matches = re.findall(r"path:\s*['\"]([^'\"]+)['\"]", content)
    for m in matches:
        if m not in routes:
            routes.append(m)
            
    return routes

def map_components(components_dir):
    if not os.path.exists(components_dir):
        return []
    
    components = []
    for item in os.listdir(components_dir):
        if os.path.isdir(os.path.join(components_dir, item)):
            components.append(item)
    return components

def main():
    src_dir = '/home/sandro/DAO/dashboard/src'
    
    print("--- FASE 1: INVENTARIO GLOBAL ---")
    stats = count_files(src_dir)
    for k, v in stats.items():
        print(f"{k}: {v}")
        
    print("\n--- FASE 2: MAPEAMENTO DE ROTAS ---")
    routes_file = os.path.join(src_dir, 'routes', 'sections', 'dashboard.tsx')
    routes = map_routes(routes_file)
    print(f"Encontradas {len(routes)} rotas definidas em dashboard.tsx:")
    for r in routes:
        print(f" - {r}")
        
    print("\n--- FASE 7: COMPONENT LIBRARY ---")
    components_dir = os.path.join(src_dir, 'components')
    comps = map_components(components_dir)
    print(f"Total de modulos de componentes: {len(comps)}")
    for c in comps:
        print(f" - {c}")

if __name__ == '__main__':
    main()
