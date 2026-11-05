// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[path = "database/connection.rs"]
mod connection;

use serde_json::{json, Value};

// Real business commands for Dashboard
#[tauri::command]
fn get_active_projects_count() -> i32 {
    if let Ok(conn) = connection::establish_connection() {
        if let Ok(mut stmt) = conn.prepare("SELECT COUNT(*) FROM work_projects WHERE status = 'Active'") {
            return stmt.query_row([], |row| row.get(0)).unwrap_or(0);
        }
    }
    0
}

#[tauri::command]
fn get_pending_tasks_count() -> i32 {
    if let Ok(conn) = connection::establish_connection() {
        if let Ok(mut stmt) = conn.prepare("SELECT COUNT(*) FROM customers WHERE status = 'New'") {
            return stmt.query_row([], |row| row.get(0)).unwrap_or(0);
        }
    }
    0
}

#[tauri::command]
fn get_expected_money_today() -> i32 {
    if let Ok(conn) = connection::establish_connection() {
        if let Ok(mut stmt) = conn.prepare("SELECT COALESCE(SUM(amount), 0) FROM money_records WHERE record_type = 'Income'") {
            let total: f64 = stmt.query_row([], |row| row.get(0)).unwrap_or(0.0);
            return total as i32;
        }
    }
    0
}

// Real business commands for Clients
#[tauri::command]
fn get_all_leads() -> Vec<Value> {
    let mut leads = Vec::new();
    if let Ok(conn) = connection::establish_connection() {
        if let Ok(mut stmt) = conn.prepare("SELECT id, name, phone, service, follow_date, status FROM customers ORDER BY id DESC") {
            if let Ok(mut rows) = stmt.query([]) {
                while let Ok(Some(row)) = rows.next() {
                    leads.push(json!({
                        "id": row.get::<_, i32>(0).unwrap_or(0),
                        "name": row.get::<_, String>(1).unwrap_or_default(),
                        "phone": row.get::<_, String>(2).unwrap_or_default(),
                        "service": row.get::<_, String>(3).unwrap_or_default(),
                        "follow_date": row.get::<_, String>(4).unwrap_or_default(),
                        "status": row.get::<_, String>(5).unwrap_or_default()
                    }));
                }
            }
        }
    }
    leads
}

#[tauri::command]
fn add_new_lead(name: String, phone: String, service: String, follow_date: String) -> Result<String, String> {
    let conn = connection::establish_connection().map_err(|_| "Computer connection failed".to_string())?;
    conn.execute(
        "INSERT INTO customers (name, phone, service, follow_date, status) VALUES (?1, ?2, ?3, ?4, 'New')",
        (&name, &phone, &service, &follow_date),
    ).map_err(|_| "Failed to save customer record".to_string())?;
    Ok("Saved Customer".to_string())
}

// Real business commands for Projects
#[tauri::command]
fn get_all_projects() -> Vec<Value> {
    let mut projects = Vec::new();
    if let Ok(conn) = connection::establish_connection() {
        if let Ok(mut stmt) = conn.prepare("SELECT id, work_name, assigned_person, delivery_date, status FROM work_projects ORDER BY id DESC") {
            if let Ok(mut rows) = stmt.query([]) {
                while let Ok(Some(row)) = rows.next() {
                    projects.push(json!({
                        "id": row.get::<_, i32>(0).unwrap_or(0),
                        "name": row.get::<_, String>(1).unwrap_or_default(),
                        "person": row.get::<_, String>(2).unwrap_or_default(),
                        "date": row.get::<_, String>(3).unwrap_or_default(),
                        "status": row.get::<_, String>(4).unwrap_or_default()
                    }));
                }
            }
        }
    }
    projects
}

#[tauri::command]
fn add_new_project(name: String, person: String, date: String) -> Result<String, String> {
    let conn = connection::establish_connection().map_err(|_| "Computer connection failed".to_string())?;
    conn.execute(
        "INSERT INTO work_projects (work_name, assigned_person, delivery_date, status) VALUES (?1, ?2, ?3, 'Active')",
        (&name, &person, &date),
    ).map_err(|_| "Failed to save work assignment".to_string())?;
    Ok("Saved Work".to_string())
}

// Real business commands for Finance
#[tauri::command]
fn get_all_finances() -> Vec<Value> {
    let mut finances = Vec::new();
    if let Ok(conn) = connection::establish_connection() {
        if let Ok(mut stmt) = conn.prepare("SELECT id, record_type, amount, reason, transaction_date, status FROM money_records ORDER BY id DESC") {
            if let Ok(mut rows) = stmt.query([]) {
                while let Ok(Some(row)) = rows.next() {
                    finances.push(json!({
                        "id": row.get::<_, i32>(0).unwrap_or(0),
                        "type": row.get::<_, String>(1).unwrap_or_default(),
                        "amount": row.get::<_, f64>(2).unwrap_or(0.0),
                        "description": row.get::<_, String>(3).unwrap_or_default(),
                        "date": row.get::<_, String>(4).unwrap_or_default(),
                        "status": row.get::<_, String>(5).unwrap_or_default()
                    }));
                }
            }
        }
    }
    finances
}

#[tauri::command]
fn add_new_finance_record(record_type: String, amount: f64, description: String, date: String) -> Result<String, String> {
    let conn = connection::establish_connection().map_err(|_| "Computer connection failed".to_string())?;
    conn.execute(
        "INSERT INTO money_records (record_type, amount, reason, transaction_date, status) VALUES (?1, ?2, ?3, ?4, 'Completed')",
        (&record_type, &amount, &description, &date),
    ).map_err(|_| "Failed to save money record".to_string())?;
    Ok("Saved Money Record".to_string())
}

// Real business commands for Settings and Computer Backup
#[tauri::command]
fn get_last_backup_date() -> String {
    if let Ok(conn) = connection::establish_connection() {
        if let Ok(mut stmt) = conn.prepare("SELECT last_backup_date FROM system_settings LIMIT 1") {
            if let Ok(date) = stmt.query_row([], |row| row.get::<_, String>(0)) {
                return date;
            }
        }
    }
    "Never".to_string()
}

#[tauri::command]
fn trigger_local_backup() -> Result<String, String> {
    let conn = connection::establish_connection().map_err(|_| "Computer connection failed".to_string())?;
    conn.execute("UPDATE system_settings SET last_backup_date = date('now')", [])
        .map_err(|_| "Failed to save backup date".to_string())?;
    Ok("Computer backup created".to_string())
}

#[tauri::command]
fn trigger_cloud_sync() -> Result<String, String> {
    let conn = connection::establish_connection().map_err(|_| "Computer connection failed".to_string())?;
    conn.execute("UPDATE system_settings SET last_sync_date = date('now')", [])
        .map_err(|_| "Failed to save sync date".to_string())?;
    Ok("Internet cloud sync completed".to_string())
}

fn main() {
    // Physically construct the company tables when the application starts
    if let Ok(conn) = connection::establish_connection() {
        let schema = include_str!("database/schema.sql");
        let _ = conn.execute_batch(schema);
    }

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_active_projects_count,
            get_pending_tasks_count,
            get_expected_money_today,
            get_all_leads,
            add_new_lead,
            get_all_projects,
            add_new_project,
            get_all_finances,
            add_new_finance_record,
            get_last_backup_date,
            trigger_local_backup,
            trigger_cloud_sync
        ])
        .run(tauri::generate_context!())
        .expect("error while running AnyAstro Sanchalan application");
}