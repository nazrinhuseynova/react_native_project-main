const fs = require('node:fs');
const path = require('node:path');

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error('SUPABASE_URL və SUPABASE_SERVICE_ROLE_KEY lazımdır.');
  process.exit(1);
}

const LANGUAGES = [
  { code: 'az', nativeName: 'Azərbaycanca', sortOrder: 0, file: 'az.json' },
  { code: 'en', nativeName: 'English', sortOrder: 1, file: 'en.json' },
  { code: 'ru', nativeName: 'Русский', sortOrder: 2, file: 'ru.json' },
];

const SOURCE_DIR = path.join(__dirname, 'translations');

async function main() {
  const rows = LANGUAGES.map((lang) => ({
    code: lang.code,
    native_name: lang.nativeName,
    sort_order: lang.sortOrder,
    is_active: true,
    strings: JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, lang.file), 'utf8')),
  }));

  const response = await fetch(`${url}/rest/v1/app_translations?on_conflict=code`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    console.error('Xəta:', response.status, await response.text());
    process.exit(1);
  }
  console.log(`Yükləndi: ${rows.map((row) => row.code).join(', ')}`);
}

main();