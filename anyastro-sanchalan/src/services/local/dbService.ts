import { invoke } from "@tauri-apps/api/core";

// Dashboard Data Commands
export async function getActiveWorkCount(): Promise<number> {
  return await invoke("get_active_projects_count");
}

export async function getPendingTasksCount(): Promise<number> {
  return await invoke("get_pending_tasks_count");
}

export async function getExpectedMoneyToday(): Promise<number> {
  return await invoke("get_expected_money_today");
}

// Customer Record Commands
export async function getAllCustomers(): Promise<any[]> {
  return await invoke("get_all_leads");
}

export async function saveNewCustomer(name: string, phone: string, workNeeded: string, date: string): Promise<string> {
  return await invoke("add_new_lead", { name: name, phone: phone, service: workNeeded, followDate: date });
}

// Work Record Commands
export async function getAllWork(): Promise<any[]> {
  return await invoke("get_all_projects");
}

export async function saveNewWork(workName: string, person: string, date: string): Promise<string> {
  return await invoke("add_new_project", { name: workName, person: person, date: date });
}

// Money Record Commands
export async function getAllMoneyRecords(): Promise<any[]> {
  return await invoke("get_all_finances");
}

export async function saveMoneyRecord(recordType: string, amount: number, reason: string, date: string): Promise<string> {
  return await invoke("add_new_finance_record", { recordType: recordType, amount: amount, description: reason, date: date });
}

// Safety and Internet Cloud Commands
export async function getLastBackupDate(): Promise<string> {
  return await invoke("get_last_backup_date");
}

export async function saveComputerBackup(): Promise<string> {
  return await invoke("trigger_local_backup");
}

export async function sendToInternetCloud(): Promise<string> {
  return await invoke("trigger_cloud_sync");
}