const { execSync } = require('child_process');

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Error: You must provide a migration name.');
  process.exit(1);
}

try {
  const command = `npm run typeorm migration:generate -n src/database/migrations/${migrationName}`;
  console.log(`Running command: ${command}`);
  execSync(command, { stdio: 'inherit' });
} catch (error) {
  console.error('Error while generating migration:', error.message);
  process.exit(1);
}
