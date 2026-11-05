import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { invoke } from "@tauri-apps/api/core";
import { Plus, DollarSign, FileText, Calendar, TrendingUp, TrendingDown } from "lucide-react";

interface FinanceRecord {
  id: number;
  type: string;
  amount: number;
  description: string;
  date: string;
  status: string;
}

export default function FinanceOverview() {
  const { t } = useTranslation();
  
  const [transactions, setTransactions] = useState<FinanceRecord[]>([]);
  const [recordType, setRecordType] = useState("Income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [systemMessage, setSystemMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRealFinances();
  }, []);

  async function fetchRealFinances() {
    try {
      // Real logic: Calling the Rust backend to read from the local SQLCipher database
      const realFinances = await invoke<FinanceRecord[]>("get_all_finances");
      setTransactions(realFinances);
      setSystemMessage(null);
    } catch (err) {
      // Functional safety fallback if the Rust database file is not yet built
      setSystemMessage("Local database connection pending. Displaying empty records safely.");
      setTransactions([]);
    }
  }

  async function handleSaveTransaction(event: React.FormEvent) {
    event.preventDefault();
    if (!amount || !description || !transactionDate) return;

    try {
      // Real logic: Sending form data to Rust backend to save in local encrypted database
      await invoke("add_new_finance_record", { 
        recordType: recordType, 
        amount: parseFloat(amount), 
        description: description, 
        date: transactionDate 
      });
      
      setAmount("");
      setDescription("");
      setTransactionDate("");
      
      await fetchRealFinances();
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
        <h2 className="text-2xl font-semibold text-brand-white">{t('finance', 'Money')} - Records</h2>
        <p className="text-sm text-brand-silver mt-1">
          {systemMessage ? systemMessage : "Track company income, expenses, and pending payments securely."}
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
          <h3 className="text-base font-medium text-brand-white mb-4">Add Money Record</h3>
          
          <form onSubmit={handleSaveTransaction} className="space-y-4">
            <div>
              <label className="block text-sm text-brand-silver mb-1">Record Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRecordType("Income")}
                  className={`py-2 text-sm rounded border ${
                    recordType === "Income" 
                      ? "bg-brand-blueTint text-brand-blue border-brand-blue" 
                      : "bg-brand-input text-brand-silver border-brand-border hover:bg-brand-elevated"
                  }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setRecordType("Expense")}
                  className={`py-2 text-sm rounded border ${
                    recordType === "Expense" 
                      ? "bg-brand-elevated text-status-lost border-status-lost" 
                      : "bg-brand-input text-brand-silver border-brand-border hover:bg-brand-elevated"
                  }`}
                >
                  Expense
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-brand-silver mb-1">Amount</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-3 text-brand-muted" />
                <input 
                  type="number" 
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-brand-input border border-brand-border text-brand-white text-sm rounded px-10 py-2.5 focus:border-brand-blueFocus"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-brand-silver mb-1">Reason</label>
              <div className="relative">
                <FileText size={16} className="absolute left-3 top-3 text-brand-muted" />
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-brand-input border border-brand-border text-brand-white text-sm rounded px-10 py-2.5 focus:border-brand-blueFocus"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-brand-silver mb-1">Date</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-3 text-brand-muted" />
                <input 
                  type="date" 
                  value={transactionDate}
                  onChange={(e) => setTransactionDate(e.target.value)}
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
          <h3 className="text-base font-medium text-brand-white mb-4">Money Records</h3>
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-brand-silver text-sm">
                <th className="pb-3 font-medium pl-2 w-10"></th>
                <th className="pb-3 font-medium">Reason</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right pr-2">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm text-brand-white">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-brand-muted">
                    No records found.
                  </td>
                </tr>
              ) : (
                transactions.map((record) => (
                  <tr key={record.id} className="border-b border-brand-border hover:bg-brand-elevated transition-colors">
                    <td className="py-3 pl-2">
                      {record.type === "Income" ? (
                        <TrendingUp size={16} className="text-status-won" />
                      ) : (
                        <TrendingDown size={16} className="text-status-lost" />
                      )}
                    </td>
                    <td className="py-3">{record.description}</td>
                    <td className="py-3">{record.date}</td>
                    <td className="py-3">
                      <span className="text-brand-silver">{record.status || "Completed"}</span>
                    </td>
                    <td className={`py-3 text-right pr-2 font-medium ${record.type === "Income" ? "text-status-won" : "text-brand-white"}`}>
                      {record.type === "Income" ? "+" : "-"} ₹{record.amount.toFixed(2)}
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