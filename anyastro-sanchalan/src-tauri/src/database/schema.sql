-- Customers Table (Manages new customer inquiries and contact details)
CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT,
    follow_date TEXT,
    status TEXT DEFAULT 'New',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Work Table (Manages active work, assigned team members, and delivery dates)
CREATE TABLE IF NOT EXISTS work_projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    work_name TEXT NOT NULL,
    assigned_person TEXT NOT NULL,
    delivery_date TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Money Table (Manages company income, expenses, and pending payments securely)
CREATE TABLE IF NOT EXISTS money_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_type TEXT NOT NULL,
    amount REAL NOT NULL,
    reason TEXT NOT NULL,
    transaction_date TEXT NOT NULL,
    status TEXT DEFAULT 'Completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- System Table (Manages offline database backups and internet cloud sync options)
CREATE TABLE IF NOT EXISTS system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    last_backup_date TEXT DEFAULT 'Never',
    last_sync_date TEXT DEFAULT 'Never'
);

-- Insert default system settings row if the table is empty
INSERT INTO system_settings (last_backup_date, last_sync_date)
SELECT 'Never', 'Never'
WHERE NOT EXISTS (SELECT 1 FROM system_settings);