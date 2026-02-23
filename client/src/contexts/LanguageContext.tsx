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

  // Users Page
  userManagement: { en: 'User Management', he: 'ניהול משתמשים' },
  viewUsers: { en: 'View and manage your bot users', he: 'צפה ונהל את משתמשי הבוט שלך' },
  searchUsers: { en: 'Search users...', he: 'חפש משתמשים...' },
  fullName: { en: 'Full Name', he: 'שם מלא' },
  whatsappId: { en: 'WhatsApp ID', he: 'מזהה WhatsApp' },
  status: { en: 'Status', he: 'סטטוס' },
  subscribed: { en: 'Subscribed', he: 'מנוי' },
  unsubscribed: { en: 'Unsubscribed', he: 'לא מנוי' },
  blocked: { en: 'Blocked', he: 'חסום' },
  active: { en: 'Active', he: 'פעיל' },
  actions: { en: 'Actions', he: 'פעולות' },
  blockUser: { en: 'Block User', he: 'חסום משתמש' },
  unblockUser: { en: 'Unblock User', he: 'בטל חסימה' },
  deleteUser: { en: 'Delete User', he: 'מחיקת משתמש' },
  deleteUserConfirm: { en: 'Are you sure you want to delete this user? This will perform a soft delete for investigation purposes, but if they message again, they will be treated as a new user.', he: 'האם אתה בטוח שברצונך למחוק משתמש זה? תבוצע מחיקה רכה לצרכי חקירה, אך אם המשתמש ישלח הודעה שוב, הוא יטופל כמשתמש חדש.' },
  lastActive: { en: 'Last Active', he: 'פעילות אחרונה' },

  // Messages Page
  broadcastMessages: { en: 'Broadcast Messages', he: 'הודעות תפוצה' },
  sendBulk: { en: 'Send bulk messages to your users', he: 'שלח הודעות בתפוצה רחבה למשתמשים שלך' },
  messageContent: { en: 'Message Content', he: 'תוכן ההודעה' },
  typeMessage: { en: 'Type your message here...', he: 'הקלד את ההודעה כאן...' },
  targetAudience: { en: 'Target Audience', he: 'קהל יעד' },
  allUsers: { en: 'All Users', he: 'כל המשתמשים' },
  onlySubscribers: { en: 'Only Subscribers', he: 'מנויים בלבד' },
  onlyBlocked: { en: 'Only Blocked Users', he: 'משתמשים חסומים בלבד' },
  sendMessage: { en: 'Send Message', he: 'שלח הודעה' },
  sending: { en: 'Sending...', he: 'שולח...' },
  messageSuccess: { en: 'Message sent successfully!', he: 'ההודעה נשלחה בהצלחה!' },
  onlyActive24h: { en: 'Only Active Users (Last 24h)', he: 'רק משתמשים פעילים (24 שעות אחרונות)' },
  onlyActive24hDesc: { en: 'Send message only to users who have interacted with the bot in the last 24 hours', he: 'שלח הודעה רק למשתמשים שקיימו אינטראקציה עם הבוט ב-24 השעות האחרונות' },
  confirmSendMessage: { en: 'You are about to send this message to', he: 'אתה עומד לשלוח הודעה זו ל' },
  whoActive24h: { en: 'who were active in the last 24 hours', he: 'שהיו פעילים ב-24 השעות האחרונות' },
  cannotUndo: { en: 'This action cannot be undone.', he: 'לא ניתן לבטל פעולה זו.' },

  // Dashboard Time Range
  timeRange: { en: 'Time Range', he: 'טווח זמן' },
  daily: { en: 'Daily', he: 'יומי' },
  weekly: { en: 'Weekly', he: 'שבועי' },
  monthly: { en: 'Monthly', he: 'חודשי' },
  yearly: { en: 'Yearly', he: 'שנתי' },

  // Chart Labels
  allMessages: { en: 'All Messages', he: 'כל ההודעות' },
  allMessagesDesc: { en: 'Total messages exchanged (sent and received)', he: 'סה"כ הודעות שהוחלפו (שנשלחו וקיבלו)' },
  sentMessages: { en: 'Sent Messages', he: 'הודעות שנשלחו' },
  sentMessagesDesc: { en: 'Messages sent to users (text and video)', he: 'הודעות שנשלחו למשתמשים (טקסט וסרטון)' },
  receivedMessages: { en: 'Received Messages', he: 'הודעות שהתקבלו' },
  receivedMessagesDesc: { en: 'Messages received from users', he: 'הודעות שהתקבלו מהמשתמשים' },
  videoActivity: { en: 'Video Content Activity', he: 'פעילות תוכן וידאו' },
  videoActivityDesc: { en: 'Videos sent to users', he: 'סרטונים שנשלחו למשתמשים' },

  // Videos Page
  videoContent: { en: 'Video Content', he: 'תוכן וידאו' },
  manageVideos: { en: 'Manage the videos sent by the bot', he: 'נהל את הסרטונים שנשלחים על ידי הבוט' },
  videoIndex: { en: 'Video Index', he: 'אינדקס וידאו' },
  videoUrl: { en: 'Video URL', he: 'כתובת URL של הוידאו' },
  description: { en: 'Description', he: 'תיאור' },
  updateVideo: { en: 'Update Video', he: 'עדכן וידאו' },
  saveChanges: { en: 'Save Changes', he: 'שמור שינויים' },
  globalDescription: { en: 'Global Description', he: 'תיאור גלובלי' },
  updateAllVideos: { en: 'Update All Videos', he: 'עדכן את כל הסרטונים' },
  individualDescriptions: { en: 'Individual Video Descriptions', he: 'תיאור לכל סרטון בנפרד' },
  active24h: { en: 'Active (24h)', he: 'פעילים (24 שעות)' },
  active1h: { en: 'Active (1h)', he: 'פעילים (שעה אחרונה)' },

  // Bot Responses Page
  manageResponses: { en: 'Manage Bot Responses', he: 'ניהול תגובות בוט' },
  editResponses: { en: 'Edit automated bot messages and buttons', he: 'ערוך הודעות וכפתורים אוטומטיים של הבוט' },
  responseText: { en: 'Response Text', he: 'טקסט התגובה' },
  buttonsConfig: { en: 'Buttons Configuration', he: 'הגדרת כפתורים' },
  buttonTitle: { en: 'Button Title', he: 'כותרת הכפתור' },
  addButton: { en: 'Add Button', he: 'הוסף כפתור' },
  updateResponse: { en: 'Update Response', he: 'עדכן תגובה' },

  // Settings Page
  adminSettings: { en: 'Admin Settings', he: 'הגדרות מנהל' },
  changePassword: { en: 'Change Password', he: 'שינוי סיסמה' },
  oldPassword: { en: 'Old Password', he: 'סיסמה ישנה' },
  newPassword: { en: 'New Password', he: 'סיסמה חדשה' },
  confirmPassword: { en: 'Confirm New Password', he: 'אמת סיסמה חדשה' },
  updatePassword: { en: 'Update Password', he: 'שינוי סיסמה' },
  importantNotes: { en: 'Important Notes', he: 'הערות חשובות' },
  messagesSentImmediately: { en: 'Messages will be sent immediately', he: 'ההודעות יישלחו באופן מיידי' },
  globalDescriptionDesc: { en: 'Updating this field will set the same description for all videos.', he: 'עדכון שדה זה יגדיר את אותו התיאור לכל הסרטונים.' },
  edit: { en: 'Edit', he: 'עריכה' },
  cancel: { en: 'Cancel', he: 'ביטול' },
  buttonId: { en: 'Button ID', he: 'מזהה כפתור' },
  order: { en: 'Order', he: 'סדר' },
  confirmMessageSend: { en: 'Confirm Message Send', he: 'אשר שליחת הודעה' },
  characterCount: { en: 'Character count', he: 'ספירת תווים' },
  successful: { en: 'Successful', he: 'הצליח' },
  failed: { en: 'Failed', he: 'נכשל' },

  // Login Page  loginTitle: { en: 'Admin Login', he: 'כניסת מנהל' },
  username: { en: 'Username', he: 'שם משתמש' },
  password: { en: 'Password', he: 'סיסמה' },
  signIn: { en: 'Sign In', he: 'התחבר' },
  loginError: { en: 'Invalid username or password', he: 'שם משתמש או סיסמה שגויים' },
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
