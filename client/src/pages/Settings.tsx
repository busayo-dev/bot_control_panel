import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { auth } from '@/lib/api';
import { Loader2, Lock, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function Settings() {
  const { t, isRTL } = useLanguage();
  const { logout } = useAuth();
  const [, setLocation] = useLocation();
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.oldPassword || !passwordData.newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await auth.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast.success(t('messageSuccess'));
    } catch (err) {
      toast.error('Error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold text-slate-900">{t('settings')}</h1>
          <p className="text-slate-600 mt-2">{t('adminSettings')}</p>
        </div>

        {/* Change Password */}
        <Card>
          <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Lock className="h-5 w-5" />
              {t('changePassword')}
            </CardTitle>
            <CardDescription>{t('updatePassword')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <label className={`block text-sm font-medium text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t('oldPassword')}</label>
                <Input
                  type="password"
                  placeholder={t('oldPassword')}
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, oldPassword: e.target.value })
                  }
                  disabled={loading}
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t('newPassword')}</label>
                <Input
                  type="password"
                  placeholder={t('newPassword')}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  disabled={loading}
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>

              <div className="space-y-2">
                <label className={`block text-sm font-medium text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t('confirmPassword')}</label>
                <Input
                  type="password"
                  placeholder={t('confirmPassword')}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  disabled={loading}
                  className={isRTL ? 'text-right' : 'text-left'}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? (
                  <>
                    <Loader2 className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />
                    {t('sending')}
                  </>
                ) : (
                  t('updatePassword')
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
            <CardTitle className="text-red-900">Danger Zone</CardTitle>
            <CardDescription className="text-red-800">
              Irreversible actions
            </CardDescription>
          </CardHeader>
          <CardContent className={isRTL ? 'text-right' : 'text-left'}>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="gap-2 bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" />
              {t('logout')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
