import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Menu } from "lucide-react";

export default function TopBar() {
  const { i18n } = useTranslation();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const isLightModeActive = document.documentElement.classList.contains('light');
    setIsDark(!isLightModeActive);
  }, []);

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  };

  return (
    <header className="h-14 border-b border-brand-border bg-brand-sidebar flex items-center justify-between px-6 transition-colors duration-200">
      <div className="flex items-center">
        <button className="text-brand-silver hover:text-brand-white cursor-pointer" aria-label="Open Menu">
          <Menu size={20} />
        </button>
      </div>
      
      <div className="flex items-center gap-4">
        <select 
          onChange={changeLanguage}
          value={i18n.language}
          className="bg-brand-input border border-brand-border text-brand-white text-sm rounded px-3 py-1.5 outline-none focus:border-brand-blueFocus cursor-pointer"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="mr">मराठी</option>
          <option value="te">తెలుగు</option>
          <option value="ta">தமிழ்</option>
          <option value="kn">ಕನ್ನಡ</option>
          <option value="ml">മലയാളം</option>
          <option value="gu">ગુજરાતી</option>
          <option value="pa">ਪੰਜਾਬੀ</option>
          <option value="bn">বাংলা</option>
          <option value="or">ଓଡ଼ିଆ</option>
          <option value="as">অসমীয়া</option>
          <option value="ur">اردو</option>
        </select>

        <button 
          onClick={toggleTheme}
          className="px-4 py-1.5 rounded text-sm font-medium border border-brand-border bg-brand-card text-brand-white hover:bg-brand-elevated transition-colors cursor-pointer"
        >
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </header>
  );
}