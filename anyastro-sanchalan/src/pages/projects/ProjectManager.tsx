import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { invoke } from "@tauri-apps/api/core";
import { Plus, Folder, User, Calendar } from "lucide-react";

interface ProjectRecord {
  id: number;
  name: string;
  person: string;
  date: string;
  status: string;
}

export default function ProjectManager() {
  const { t } = useTranslation();
  
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [workName, setWorkName] = useState("");
  const [assignedPerson, setAssignedPerson] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [systemMessage, setSystemMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRealProjects();
  }, []);

  async function fetchRealProjects() {
    try {
      // Real logic: Calling the Rust backend to read from the local SQLCipher database
      const realProjects = await invoke<ProjectRecord[]>("get_all_projects");
      setProjects(realProjects);
      setSystemMessage(null);
    } catch (err) {
      // Functional safety fallback if the Rust database file is not yet built
      setSystemMessage("Local database connection pending. Displaying empty records safely.");
      setProjects([]);
    }
  }

  async function handleSaveProject(event: React.FormEvent) {
    event.preventDefault();
    if (!workName || !targetDate) return;

    try {
      // Real logic: Sending form data to Rust backend to save in local database
      await invoke("add_new_project", { 
        name: workName, 
        person: assignedPerson, 
        date: targetDate 
      });
      
      setWorkName("");
      setAssignedPerson("");
      setTargetDate("");
      
      await fetchRealProjects();
    } catch (err) {
      setSystemMessage("Action failed. Please verify the local database connection.");
    }
  }

  const containerAnimations = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-brand-white">{t('projects', 'Projects')} - Work Manager</h2>
        <p className="text-sm text-brand-silver mt-1">
          {systemMessage ? systemMessage : "Manage active work, assign people, and track dates."}
        </p>
      </div>

      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        variants={containerAnimations}
        initial="hidden"
        animate="visible"
      >
        {/* Form Section */}
        <motion.div className="lg:col-span-1 p-6 rounded-lg bg-brand-card border border-brand-border">
          <h3 className="text-base font-medium text-brand-white mb-4">Add New Work</h3>
          
          <form onSubmit={handleSaveProject} className="space-y-4">
            <div>
              <label className="block text-sm text-brand-silver mb-1">Work Name</label>
              <div className="relative">
                <Folder size={16} className="absolute left-3 top-3 text-brand-muted" />
                <input 
                  type="text" 
                  value={workName}
                  onChange={(e) => setWorkName(e.target.value)}
                  className="w-full bg-brand-input border border-brand-border text-brand-white text-sm rounded px-10 py-2.5 focus:border-brand-blueFocus"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-brand-silver mb-1">Assigned Person</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-brand-muted" />
                <input 
                  type="text" 
                  value={assignedPerson}
                  onChange={(e) => setAssignedPerson(e.target.value)}
                  className="w-full bg-brand-input border border-brand-border text-brand-white text-sm rounded px-10 py-2.5 focus:border-brand-blueFocus"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-brand-silver mb-1">Delivery Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-3 text-brand-muted" />
                <input 
                  type="date" 
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-brand-input border border-brand-border text-brand-white text-sm rounded px-10 py-2.5 focus:border-brand-blueFocus"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-brand-blue text-brand-white px-4 py-2.5 rounded hover:bg-brand-blueHover transition-colors mt-2"
            >
              <Plus size={18} />
              <span className="text-sm font-medium">{t('new_record', 'Add New')}</span>
            </button>
          </form>
        </motion.div>

        {/* Table Section */}
        <motion.div className="lg:col-span-2 p-6 rounded-lg bg-brand-card border border-brand-border overflow-x-auto">
          <h3 className="text-base font-medium text-brand-white mb-4">Active Work Records</h3>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-brand-silver text-sm">
                <th className="pb-3 font-medium pl-2">Work Name</th>
                <th className="pb-3 font-medium">Person</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium text-right pr-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-brand-white">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-brand-muted">
                    No records found.
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="border-b border-brand-border hover:bg-brand-elevated transition-colors">
                    <td className="py-3 pl-2">{project.name}</td>
                    <td className="py-3">{project.person}</td>
                    <td className="py-3">{project.date}</td>
                    <td className="py-3 text-right pr-2">
                      <span className="bg-brand-blueTint text-brand-blue text-xs px-2 py-1 rounded">
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>
      </motion.div>
    </div>
  );
}