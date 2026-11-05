import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Briefcase, DollarSign, Shield, Settings, Plus } from "lucide-react";

export default function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="w-64 border-r border-brand-border bg-brand-sidebar flex flex-col h-full transition-colors duration-200">
      {/* Logo Area */}
      <div className="p-5 flex items-center gap-3">
        <img 
          src="/icons/anyastro-logo.png" 
          alt="AnyAstro Logo" 
          className="w-8 h-8 object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMyNTYzRUIiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjwvc3ZnPg==';
          }}
        />
        <h1 className="font-semibold text-lg tracking-wide text-brand-white">Sanchalan</h1>
      </div>

      {/* Action Button */}
      <div className="px-4 py-3">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md bg-brand-card text-brand-white border border-brand-border hover:bg-brand-elevated hover:border-brand-muted transition-colors">
          <Plus size={18} />
          <span className="text-sm font-medium">{t('new_record')}</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <NavItem to="/" icon={<Home size={18} />} label={t('dashboard')} />
        <NavItem to="/clients" icon={<Briefcase size={18} />} label={t('business')} />
        <NavItem to="/money" icon={<DollarSign size={18} />} label={t('finance')} />
        <NavItem to="/security" icon={<Shield size={18} />} label={t('security')} />
      </nav>

      {/* Bottom Settings */}
      <div className="p-4 border-t border-brand-border">
        <NavItem to="/settings" icon={<Settings size={18} />} label={t('settings')} />
      </div>
    </aside>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
          isActive
            ? "bg-brand-blueTint text-brand-blue font-medium"
            : "text-brand-silver hover:bg-brand-elevated hover:text-brand-white"
        }`
      }
    >
      {icon}
      <span className="text-sm">{label}</span>
    </NavLink>
  );
}