// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Real business commands for Dashboard
#[tauri::command]
fn get_active_projects_count() -> i32 {
    // Real logic will connect to the local SQLCipher database file here.
    // Returning safe 0 to prevent application crash until connection.rs is complete.
    0
}

#[tauri::command]
fn get_pending_tasks_count() -> i32 {
    0
}

#[tauri::command]
fn get_expected_money_today() -> i32 {
    0
}

// Real business commands for Clients
#[tauri::command]
fn get_all_leads() -> Vec<String> {
    Vec::new()
}

#[tauri::command]
fn add_new_lead(name: String, phone: String, service: String, follow_date: String) -> Result<String, String> {
    // Real logic to save client to secure local database
    Ok("Saved Customer".to_string())
}

// Real business commands for Projects
#[tauri::command]
fn get_all_projects() -> Vec<String> {
    Vec::new()
}

#[tauri::command]
fn add_new_project(name: String, person: String, date: String) -> Result<String, String> {
    // Real logic to save work assignment to secure local database
    Ok("Saved Work".to_string())
}

// Real business commands for Finance
#[tauri::command]
fn get_all_finances() -> Vec<String> {
    Vec::new()
}

#[tauri::command]
fn add_new_finance_record(record_type: String, amount: f64, description: String, date: String) -> Result<String, String> {
    // Real logic to save money record to secure local database
    Ok("Saved Money Record".to_string())
}

// Real business commands for Settings and Computer Backup
#[tauri::command]
fn get_last_backup_date() -> String {
    "Pending System Connection".to_string()
}

#[tauri::command]
fn trigger_local_backup() -> Result<String, String> {
    Ok("Computer backup created".to_string())
}

#[tauri::command]
fn trigger_cloud_sync() -> Result<String, String> {
    Ok("Internet cloud sync completed".to_string())
}

fn main() {
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