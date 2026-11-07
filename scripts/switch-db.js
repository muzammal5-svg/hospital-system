const fs = require('fs');
const path = require('path');

const target = process.argv[2] || 'sqlite';
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const envPath = path.join(__dirname, '..', '.env');

if (target === 'postgresql' || target === 'postgres') {
  console.log('Switching Prisma schema to PostgreSQL...');
  let schema = fs.readFileSync(schemaPath, 'utf8');
  schema = schema.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
  fs.writeFileSync(schemaPath, schema);

  if (fs.existsSync(envPath)) {
    let env = fs.readFileSync(envPath, 'utf8');
    env = env.replace(/DATABASE_URL="[^"]*"/g, 'DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hospital_db?schema=public"');
    fs.writeFileSync(envPath, env);
  }
  console.log('Switched to PostgreSQL datasource successfully.');
} else {
  console.log('Switching Prisma schema to SQLite...');
  let schema = fs.readFileSync(schemaPath, 'utf8');
  schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
  fs.writeFileSync(schemaPath, schema);

  if (fs.existsSync(envPath)) {
    let env = fs.readFileSync(envPath, 'utf8');
    env = env.replace(/DATABASE_URL="[^"]*"/g, 'DATABASE_URL="file:./dev.db"');
    fs.writeFileSync(envPath, env);
  }
  console.log('Switched to SQLite datasource successfully.');
}
