import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'he';

interface Translations {
  [key: string]: {
    en: string;
    he: string;
  };
}

export const translations: Translations = {
  // Navigation
  dashboard: { en: 'Dashboard', he: 'לוח בקרה' },
  users: { en: 'Users', he: 'משתמשים' },
  messages: { en: 'Messages', he: 'הודעות' },
  videos: { en: 'Videos', he: 'סרטונים' },
  botResponses: { en: 'Bot Responses', he: 'תגובות בוט' },
  settings: { en: 'Settings', he: 'הגדרות' },
  logout: { en: 'Logout', he: 'התנתקות' },
  admin: { en: 'Admin', he: 'מנהל' },
  manager: { en: 'Manager', he: 'מנהל מערכת' },
  botAdmin: { en: 'Bot Admin', he: 'ניהול בוט' },
  adminDashboard: { en: 'Admin Dashboard', he: 'לוח בקרה למנהל' },
  manageOperations: { en: 'Manage your bot operations', he: 'נהל את פעילות הבוט שלך' },

  // Dashboard
  overview: { en: 'Overview of your WhatsApp bot operations', he: 'סקירה כללית של פעילות הבוט ב-WhatsApp' },
  totalUsers: { en: 'Total Users', he: 'סה"כ משתמשים' },
  activeSubscribers: { en: 'Active Subscribers', he: 'מנויים פעילים' },
  blockedUsers: { en: 'Blocked Users', he: 'משתמשים חסומים' },
  sentToday: { en: 'Sent Today', he: 'נשלחו היום' },
  fromLastWeek: { en: 'from last week', he: 'מהשבוע שעבר' },
  weeklyActivity: { en: 'Weekly Activity', he: 'פעילות שבועית' },
  userEngagement: { en: 'User engagement over the past week', he: 'מעורבות משתמשים בשבוע האחרון' },
  newUsers: { en: 'New Users', he: 'משתמשים חדשים' },
  messagesSent: { en: 'Messages Sent', he: 'הודעות שנשלחו' },
  messageDistribution: { en: 'Message Distribution', he: 'התפלגות הודעות' },
  dailyVolume: { en: 'Daily message volume', he: 'נפח הודעות יומי' },
  videoActivity: { en: 'Video Content Activity', he: 'פעילות תוכן וידאו' },
  dailyVideos: { en: 'Daily videos sent to users', he: 'סרטונים יומיים שנשלחו למשתמשים' },
  videosSent: { en: 'Videos Sent', he: 'סרטונים שנשלחו' },
  quickActions: { en: 'Quick Actions', he: 'פעולות מהירות' },
  commonTasks: { en: 'Common admin tasks', he: 'משימות ניהול נפוצות' },
  manageUsersDesc: { en: 'View and block users', he: 'צפייה וחסימת משתמשים' },
  sendMessagesDesc: { en: 'Bulk message users', he: 'שליחת הודעות בתפוצה רחבה' },
  botResponsesDesc: { en: 'Edit bot messages', he: 'עריכת הודעות הבוט' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Hebrew as requested
  const [language, setLanguage] = useState<Language>(
    (localStorage.getItem('language') as Language) || 'he'
  );

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string) => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  const isRTL = language === 'he';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-hebrew' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
