import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/api';
import { Loader2, Lock, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

export default function Settings() {
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

      toast.success('Password changed successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to change password');
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
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600 mt-2">Manage your account and preferences</p>
        </div>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>Update your admin account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Current Password</label>
                <Input
                  type="password"
                  placeholder="Enter your current password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, oldPassword: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">New Password</label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900">Confirm New Password</label>
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your admin account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-slate-600">Role</p>
              <p className="text-lg font-semibold text-slate-900">Administrator</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">Status</p>
              <p className="text-lg font-semibold text-emerald-600">Active</p>
            </div>
            <div>
              <p className="text-sm text-slate-600">API Base URL</p>
              <p className="text-sm font-mono text-slate-900 break-all">
                https://whatsapp-video-bot-slb7.onrender.com/api/admin
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-900">Danger Zone</CardTitle>
            <CardDescription className="text-red-800">
              Irreversible actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="gap-2 bg-red-600 hover:bg-red-700"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card>
          <CardHeader>
            <CardTitle>API Information</CardTitle>
            <CardDescription>Integration details for developers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-900 mb-2">Available Endpoints</p>
              <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                <li>GET /stats - Dashboard statistics</li>
                <li>GET /users - List all users</li>
                <li>POST /users/toggle-block - Block/unblock user</li>
                <li>POST /bulk-message - Send bulk messages</li>
                <li>GET /videos - List videos</li>
                <li>POST /videos - Update video</li>
                <li>GET /responses - List bot responses</li>
                <li>PUT /responses/:id - Update response</li>
                <li>POST /buttons - Add button</li>
                <li>PUT /buttons/:id - Update button</li>
                <li>DELETE /buttons/:id - Delete button</li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-900 mb-2">Authentication</p>
              <p className="text-sm text-slate-600">
                All requests require a Bearer token in the Authorization header:
              </p>
              <code className="block mt-2 p-2 bg-slate-900 text-emerald-400 rounded text-xs overflow-x-auto">
                Authorization: Bearer &lt;your_token&gt;
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
