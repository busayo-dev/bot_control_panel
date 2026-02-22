import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Switch as UISwitch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BarChart3,
  Users,
  MessageSquare,
  Video,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout } = useAuth();
  const [, setLocation] = useLocation();
  const { t, language, setLanguage, isRTL } = useLanguage();

  const navItems: NavItem[] = [
    { label: t('dashboard'), href: '/dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    { label: t('users'), href: '/dashboard/users', icon: <Users className="w-5 h-5" /> },
    { label: t('messages'), href: '/dashboard/messages', icon: <MessageSquare className="w-5 h-5" /> },
    // { label: t('videos'), href: '/dashboard/videos', icon: <Video className="w-5 h-5" /> },
    { label: t('botResponses'), href: '/dashboard/responses', icon: <MessageSquare className="w-5 h-5" /> },
    { label: t('settings'), href: '/dashboard/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-white border-r border-border transition-all duration-300 flex flex-col shadow-sm`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🤖</span>
              </div>
              <span className="font-bold text-slate-900">{t('botAdmin')}</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-slate-600" />
            ) : (
              <Menu className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              item={item}
              sidebarOpen={sidebarOpen}
            />
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between p-2 hover:bg-slate-100 rounded-lg transition-colors">
                <div className={`flex items-center gap-2 ${!sidebarOpen && 'hidden'}`}>
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-sm">A</span>
                  </div>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p className="text-sm font-medium text-slate-900">{t('admin')}</p>
                    <p className="text-xs text-slate-500">{t('manager')}</p>
                  </div>
                </div>
                {sidebarOpen && <ChevronDown className="w-4 h-4 text-slate-600" />}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4`} />
                <span>{t('logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">{t('botAdmin')}</h1>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <Label htmlFor="lang-toggle" className="text-xs font-bold text-slate-500 cursor-pointer">
                {language === 'he' ? 'עברית' : 'English'}
              </Label>
              <UISwitch
                id="lang-toggle"
                checked={language === 'en'}
                onCheckedChange={(checked) => setLanguage(checked ? 'en' : 'he')}
              />
            </div>
            <div className={`text-sm text-slate-600 ${isRTL ? 'text-right' : 'text-left'}`}>
              <p className="font-medium">{t('adminDashboard')}</p>
              <p className="text-xs text-slate-500">{t('manageOperations')}</p>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

function NavLink({
  item,
  sidebarOpen,
}: {
  item: NavItem;
  sidebarOpen: boolean;
}) {
  const [location] = useLocation();
  const isActive = location === item.href || location.startsWith(item.href + '/');

  return (
    <a
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-emerald-50 text-emerald-600 font-medium'
          : 'text-slate-700 hover:bg-slate-100'
      }`}
      title={!sidebarOpen ? item.label : undefined}
    >
      <span className={isActive ? 'text-emerald-600' : 'text-slate-600'}>
        {item.icon}
      </span>
      {sidebarOpen && <span>{item.label}</span>}
    </a>
  );
}
