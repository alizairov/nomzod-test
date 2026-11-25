-- Nomzod kabinet — D1 sxemasi (qayta ishga tushirsa ham xavfsiz: IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  created_at TEXT,
  updated_at TEXT,
  vacancy TEXT,
  vacancy_title TEXT,
  fullname TEXT,
  phone TEXT,
  telegram TEXT,
  types TEXT,
  cv_key TEXT,
  cv_name TEXT,
  cv_mime TEXT,
  yn TEXT,
  answers TEXT,
  scores TEXT,
  ball INTEGER,
  xulosa TEXT,
  status TEXT DEFAULT 'yangi',
  position REAL DEFAULT 0,
  rating INTEGER,
  client TEXT,
  total_ms INTEGER,
  page TEXT,
  ua TEXT,
  archived INTEGER DEFAULT 0,
  screening TEXT
);
-- Eslatma: `screening` (HR saralash suhbati, JSON) ustuni keyin qo'shilgan. Eski (mavjud) bazalarda CREATE TABLE IF NOT EXISTS uni qo'shmaydi,
-- shuning uchun ularda bir marta qo'lda bajaring (ikkinchi marta bajarilsa "duplicate column" xatosi beradi — bu normal):
--   ALTER TABLE leads ADD COLUMN screening TEXT;
-- Yangi bazada bu kerak emas. schema.sql ni qayta ishga tushirish xavfsiz.
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status, position);
CREATE INDEX IF NOT EXISTS idx_leads_vacancy ON leads(vacancy);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id TEXT,
  at TEXT,
  type TEXT,
  text TEXT,
  from_status TEXT,
  to_status TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_lead ON events(lead_id, at);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- DISC testi natijalari (POST /api/disc, kabinetdagi "DISC" bo'limi)
CREATE TABLE IF NOT EXISTS disc_results (id TEXT PRIMARY KEY, created_at TEXT, lang TEXT, fullname TEXT, phone TEXT, telegram TEXT, position TEXT, company TEXT, answers TEXT, d INTEGER, i INTEGER, s INTEGER, c INTEGER, pct TEXT, primary_type TEXT, total_ms INTEGER, ua TEXT, note TEXT, archived INTEGER DEFAULT 0);
CREATE INDEX IF NOT EXISTS idx_disc_created ON disc_results(created_at);
