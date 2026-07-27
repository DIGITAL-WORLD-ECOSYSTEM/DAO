import * as schema from './backend/src/db/schema';
console.log(Object.keys(schema));
const tbl = schema.users;
console.log(Object.getOwnPropertySymbols(tbl).map(s => String(s)));
