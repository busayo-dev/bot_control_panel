import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
  const { t, isRTL } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(username, password);
      setLocation('/dashboard');
    } catch (err) {
      // Error is handled by context
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="shadow-2xl border-emerald-500/20 bg-white/95 backdrop-blur">
          <CardHeader className={`space-y-2 text-center ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">🤖</span>
              </div>
            </div>
            <CardTitle className="text-2xl text-center">{t('loginTitle')}</CardTitle>
            <CardDescription className="text-center">{t('botAdmin')}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                  <AlertDescription>{t('loginError')}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="username" className={`block text-sm font-medium text-slate-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('username')}
                </label>
                <Input
                  id="username"
                  type="text"
                  placeholder={t('username')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className={`border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className={`block text-sm font-medium text-slate-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('password')}
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder={t('password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className={`border-slate-200 focus:border-emerald-500 focus:ring-emerald-500 ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !username || !password}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />
                    {t('sending')}
                  </>
                ) : (
                  t('signIn')
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
