import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { invoke } from "@tauri-apps/api/core";
import { Save, Cloud, Shield, RefreshCw } from "lucide-react";

export default function Settings() {
  const { t } = useTranslation();
  
  const [lastBackupDate, setLastBackupDate] = useState<string>("Never");
  const [syncStatus, setSyncStatus] = useState<string>("Ready");
  const [systemMessage, setSystemMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchBackupStatus();
  }, []);

  async function fetchBackupStatus() {
    try {
      // Real logic: Calling the Rust backend to check when the last SQLCipher backup was made
      const date = await invoke<string>("get_last_backup_date");
      setLastBackupDate(date);
      setSystemMessage(null);
    } catch (err) {
      // Functional safety fallback if the Rust database logic is not yet built
      setSystemMessage("Local database connection pending. Showing safe default status.");
      setLastBackupDate("Pending System Connection");
    }
  }

  async function handleCreateBackup() {
    setIsProcessing(true);
    setSystemMessage("Creating secure computer backup...");
    try {
      // Real logic: Triggering Rust backend to copy and encrypt the SQLite file
      await invoke("trigger_local_backup");
      setSystemMessage("Computer backup created successfully.");
      await fetchBackupStatus();
    } catch (err) {
      setSystemMessage("Backup action failed. Please verify the local database connection.");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleCloudSync() {
    setIsProcessing(true);
    setSyncStatus("Syncing...");
    setSystemMessage("Sending records to the internet cloud securely...");
    try {
      // Real logic: Triggering Rust backend to push pending records to Firebase Firestore
      await invoke("trigger_cloud_sync");
      setSyncStatus("Updated Today");
      setSystemMessage("Internet cloud sync completed successfully.");
    } catch (err) {
      setSyncStatus("Failed");
      setSystemMessage("Sync action failed. Please check your internet connection.");
    } finally {
      setIsProcessing(false);
    }
  }

  const containerAnimations = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-brand-white">{t('settings', 'Settings')}</h2>
        <p className="text-sm text-brand-silver mt-1">
          {systemMessage ? systemMessage : "Manage your computer backups, internet sync, and safety rules."}
        </p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerAnimations}
        initial="hidden"
        animate="visible"
      >
        {/* Computer Backup Section */}
        <motion.div className="p-6 rounded-lg bg-brand-card border border-brand-border hover:border-brand-blue transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Save size={24} className="text-brand-blue" />
            <h3 className="text-lg font-medium text-brand-white">Computer Backup</h3>
          </div>
          <p className="text-sm text-brand-silver mb-4">
            Save a safe, locked copy of all your work and money records directly on this computer.
          </p>
          <div className="mb-6">
            <span className="block text-xs text-brand-muted uppercase tracking-wider mb-1">Last Saved</span>
            <span className="text-sm font-medium text-brand-white">{lastBackupDate}</span>
          </div>
          <button 
            onClick={handleCreateBackup}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 w-full bg-brand-input border border-brand-border text-brand-white px-4 py-2.5 rounded hover:bg-brand-elevated transition-colors disabled:opacity-50"
          >
            <Shield size={16} />
            <span className="text-sm font-medium">Save Computer Backup</span>
          </button>
        </motion.div>

        {/* Internet Cloud Sync Section */}
        <motion.div className="p-6 rounded-lg bg-brand-card border border-brand-border hover:border-brand-blue transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Cloud size={24} className="text-brand-blue" />
            <h3 className="text-lg font-medium text-brand-white">Internet Cloud Sync</h3>
          </div>
          <p className="text-sm text-brand-silver mb-4">
            Send a safe copy of your records to the internet so you can view them on your mobile phone.
          </p>
          <div className="mb-6">
            <span className="block text-xs text-brand-muted uppercase tracking-wider mb-1">Status</span>
            <span className={`text-sm font-medium ${syncStatus === "Failed" ? "text-status-lost" : "text-brand-white"}`}>
              {syncStatus}
            </span>
          </div>
          <button 
            onClick={handleCloudSync}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 w-full bg-brand-blue text-brand-white px-4 py-2.5 rounded hover:bg-brand-blueHover transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={isProcessing ? "animate-spin" : ""} />
            <span className="text-sm font-medium">Send to Internet Cloud</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}