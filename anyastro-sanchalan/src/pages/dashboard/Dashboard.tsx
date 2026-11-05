import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { invoke } from "@tauri-apps/api/core";

export default function Dashboard() {
  const { t } = useTranslation();
  
  const [activeProjects, setActiveProjects] = useState<number | null>(null);
  const [pendingTasks, setPendingTasks] = useState<number | null>(null);
  const [expectedMoney, setExpectedMoney] = useState<number | null>(null);
  const [systemMessage, setSystemMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRealBusinessData() {
      try {
        // Real logic: Calling the Rust backend to read from the local SQLCipher database
        const projects = await invoke<number>("get_active_projects_count");
        const tasks = await invoke<number>("get_pending_tasks_count");
        const money = await invoke<number>("get_expected_money_today");
        
        setActiveProjects(projects);
        setPendingTasks(tasks);
        setExpectedMoney(money);
      } catch (err) {
        // Functional safety fallback: If the Rust database file is not yet built, prevent crash
        setSystemMessage("Local database connection pending. Showing safe empty records.");
        setActiveProjects(0);
        setPendingTasks(0);
        setExpectedMoney(0);
      }
    }
    
    fetchRealBusinessData();
  }, []);

  const containerAnimations = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardAnimations = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-brand-white">{t('dashboard')}</h2>
        <p className="text-sm text-brand-silver mt-1">
          {systemMessage ? systemMessage : "Central operational view for AnyAstro."}
        </p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerAnimations}
        initial="hidden"
        animate="visible"
      >
        {/* Active Projects Card */}
        <motion.div variants={cardAnimations} className="p-6 rounded-lg bg-brand-card border border-brand-border hover:border-brand-blue transition-colors">
          <h3 className="text-sm font-medium text-brand-silver mb-3">Active {t('projects')}</h3>
          <p className="text-5xl font-bold text-brand-white tracking-tight">
            {activeProjects === null ? "..." : activeProjects.toString().padStart(2, '0')}
          </p>
        </motion.div>

        {/* Pending Work Card */}
        <motion.div variants={cardAnimations} className="p-6 rounded-lg bg-brand-card border border-brand-border hover:border-status-hold transition-colors">
          <h3 className="text-sm font-medium text-brand-silver mb-3">Pending {t('business')}</h3>
          <p className="text-5xl font-bold text-brand-white tracking-tight">
            {pendingTasks === null ? "..." : pendingTasks.toString().padStart(2, '0')}
          </p>
        </motion.div>

        {/* Expected Money Card */}
        <motion.div variants={cardAnimations} className="p-6 rounded-lg bg-brand-card border border-brand-border hover:border-status-won transition-colors">
          <h3 className="text-sm font-medium text-brand-silver mb-3">Expected {t('finance')}</h3>
          <p className="text-5xl font-bold text-brand-white tracking-tight">
            {expectedMoney === null ? "..." : `₹${expectedMoney}`}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}