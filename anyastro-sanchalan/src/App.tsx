import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import LeadManager from "./pages/crm/LeadManager";
import FinanceOverview from "./pages/finance/FinanceOverview";
import ProjectManager from "./pages/projects/ProjectManager";
import Tutorial from "./pages/help/Tutorial";
import Settings from "./pages/settings/Settings";
import "./App.css";

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/clients" element={<LeadManager />} />
        <Route path="/projects" element={<ProjectManager />} />
        <Route path="/money" element={<FinanceOverview />} />
        <Route path="/help" element={<Tutorial />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </MainLayout>
  );
}

export default App;