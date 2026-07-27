import os
import re

def parse_db_schema():
    schema_path = '/home/sandro/DAO/backend/src/db/schema.ts'
    if not os.path.exists(schema_path):
        return []
    
    tables = []
    with open(schema_path, 'r') as f:
        content = f.read()
        
    # sqliteTable('table_name', ...)
    matches = re.findall(r"sqliteTable\(['\"]([^'\"]+)['\"]", content)
    for m in matches:
        if m not in tables:
            tables.append(m)
    return tables

def parse_backend_routes():
    routes_dir = '/home/sandro/DAO/backend/src/routes'
    if not os.path.exists(routes_dir):
        return {}
    
    endpoints = {}
    for root, dirs, files in os.walk(routes_dir):
        for file in files:
            if file.endswith('.ts'):
                path = os.path.join(root, file)
                with open(path, 'r') as f:
                    content = f.read()
                
                # app.get('/path'
                methods = ['get', 'post', 'put', 'patch', 'delete']
                found = []
                for method in methods:
                    matches = re.findall(rf"\.{method}\(['\"]([^'\"]+)['\"]", content)
                    for m in matches:
                        found.append(f"{method.upper()} {m}")
                if found:
                    endpoints[file] = found
    return endpoints

def parse_auth():
    auth_dir = '/home/sandro/DAO/backend/src/middleware'
    if not os.path.exists(auth_dir):
        return []
    
    auth_files = []
    for f in os.listdir(auth_dir):
        if f.endswith('.ts'):
            auth_files.append(f)
    return auth_files

def main():
    print("--- FASE 9: API LAYER ---")
    endpoints = parse_backend_routes()
    for file, rts in endpoints.items():
        print(f"[{file}]")
        for r in rts:
            print(f" - {r}")
            
    print("\n--- FASE 10: BANCO DE DADOS ---")
    tables = parse_db_schema()
    print(f"Total de Tabelas Mapeadas: {len(tables)}")
    for t in tables:
        print(f" - {t}")
        
    print("\n--- FASE 5: SISTEMA DE AUTENTICACAO (Middleware) ---")
    print(parse_auth())

if __name__ == '__main__':
    main()
