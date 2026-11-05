import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { invoke } from "@tauri-apps/api/core";
import { Plus, User, Phone, Briefcase, Calendar } from "lucide-react";

interface LeadRecord {
  id: number;
  name: string;
  phone: string;
  service: string;
  follow_date: string;
  status: string;
}

export default function LeadManager() {
  const { t } = useTranslation();
  
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [serviceNeeded, setServiceNeeded] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [systemMessage, setSystemMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRealLeads();
  }, []);

  async function fetchRealLeads() {
    try {
      // Real logic: Calling the Rust backend to read from the local SQLCipher database
      const realLeads = await invoke<LeadRecord[]>("get_all_leads");
      setLeads(realLeads);
      setSystemMessage(null);
    } catch (err) {
      // Functional safety fallback if the Rust database file is not yet built
      setSystemMessage("Local database connection pending. Displaying empty records safely.");
      setLeads([]);
    }
  }

  async function handleSaveCustomer(event: React.FormEvent) {
    event.preventDefault();
    if (!customerName || !customerPhone) return;

    try {
      // Real logic: Sending form data to Rust backend to save in local database
      await invoke("add_new_lead", { 
        name: customerName, 
        phone: customerPhone, 
        service: serviceNeeded, 
        followDate: followUpDate 
      });
      
      setCustomerName("");
      setCustomerPhone("");
      setServiceNeeded("");
      setFollowUpDate("");
      
      await fetchRealLeads();
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
        <h2 className="text-2xl font-semibold text-brand-white">{t('business', 'Work')} - Clients</h2>
        <p className="text-sm text-brand-silver mt-1">
          {systemMessage ? systemMessage : "Manage new customer inquiries and follow-up dates."}
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
          <h3 className="text-base font-medium text-brand-white mb-4">Add New Customer</h3>
          
          <form onSubmit={handleSaveCustomer} className="space-y-4">
            <div>
              <label className="block text-sm text-brand-silver mb-1">Customer Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-brand-muted" />
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-brand-input border border-brand-border text-brand-white text-sm rounded px-10 py-2.5 focus:border-brand-blueFocus"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-brand-silver mb-1">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-3 text-brand-muted" />
                <input 
                  type="text" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-brand-input border border-brand-border text-brand-white text-sm rounded px-10 py-2.5 focus:border-brand-blueFocus"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-brand-silver mb-1">Work Required</label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3 top-3 text-brand-muted" />
                <input 
                  type="text" 
                  value={serviceNeeded}
                  onChange={(e) => setServiceNeeded(e.target.value)}
                  className="w-full bg-brand-input border border-brand-border text-brand-white text-sm rounded px-10 py-2.5 focus:border-brand-blueFocus"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-brand-silver mb-1">Follow-up Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-3 text-brand-muted" />
                <input 
                  type="date" 
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full bg-brand-input border border-brand-border text-brand-white text-sm rounded px-10 py-2.5 focus:border-brand-blueFocus"
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
          <h3 className="text-base font-medium text-brand-white mb-4">Customer Records</h3>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-brand-silver text-sm">
                <th className="pb-3 font-medium pl-2">Name</th>
                <th className="pb-3 font-medium">Number</th>
                <th className="pb-3 font-medium">Work</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium text-right pr-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-brand-white">
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-brand-muted">
                    No records found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-brand-border hover:bg-brand-elevated transition-colors">
                    <td className="py-3 pl-2">{lead.name}</td>
                    <td className="py-3">{lead.phone}</td>
                    <td className="py-3">{lead.service}</td>
                    <td className="py-3">{lead.follow_date}</td>
                    <td className="py-3 text-right pr-2">
                      <span className="bg-status-new text-brand-white text-xs px-2 py-1 rounded">
                        {lead.status}
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