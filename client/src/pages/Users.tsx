import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { users } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Shield, ShieldOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: number;
  waId: string;
  fullName: string | null;
  gender: string | null;
  dailyTime: string | null;
  isSubscribed: boolean;
  isBlocked: boolean;
  currentVideoIndex: number;
  lastActiveAt: string;
}

export default function Users() {
  const { t, isRTL } = useLanguage();
  const [userList, setUserList] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = userList.filter(
      (user) =>
        user.waId.includes(searchTerm) ||
        (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, userList]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await users.getUsers();
      setUserList(response as User[]);
    } catch (err) {
      toast.error(t('loginError'));
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = (user: User) => {
    setSelectedUser(user);
    setShowBlockDialog(true);
  };

  const confirmBlockToggle = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      await users.toggleBlock(selectedUser.waId, !selectedUser.isBlocked);
      
      setUserList((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, isBlocked: !u.isBlocked } : u
        )
      );

      toast.success(t('messageSuccess'));
    } catch (err) {
      toast.error('Error');
    } finally {
      setActionLoading(false);
      setShowBlockDialog(false);
      setSelectedUser(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold text-slate-900">{t('userManagement')}</h1>
          <p className="text-slate-600 mt-2">{t('viewUsers')}</p>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-3 h-5 w-5 text-slate-400`} />
              <Input
                placeholder={t('searchUsers')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={isRTL ? 'pr-10 text-right' : 'pl-10'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
            <CardTitle>{t('users')} ({filteredUsers.length})</CardTitle>
            <CardDescription>
              {t('totalUsers')}: {userList.length} | {t('activeSubscribers')}: {userList.filter((u) => u.isSubscribed).length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className={`data-table ${isRTL ? 'text-right' : 'text-left'}`}>
                  <thead>
                    <tr>
                      <th className={isRTL ? 'text-right' : 'text-left'}>{t('whatsappId')}</th>
                      <th className={isRTL ? 'text-right' : 'text-left'}>{t('fullName')}</th>
                      <th className={isRTL ? 'text-right' : 'text-left'}>Gender</th>
                      <th className={isRTL ? 'text-right' : 'text-left'}>Daily Time</th>
                      <th className={isRTL ? 'text-right' : 'text-left'}>{t('status')}</th>
                      <th className={isRTL ? 'text-right' : 'text-left'}>{t('videoIndex')}</th>
                      <th className={isRTL ? 'text-right' : 'text-left'}>{t('lastActive')}</th>
                      <th className={isRTL ? 'text-right' : 'text-left'}>{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="font-mono text-sm">{user.waId}</td>
                        <td>{user.fullName || '-'}</td>
                        <td className="capitalize">{user.gender || '-'}</td>
                        <td>{user.dailyTime || '-'}</td>
                        <td>
                          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {user.isSubscribed && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                {t('subscribed')}
                              </span>
                            )}
                            {user.isBlocked && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {t('blocked')}
                              </span>
                            )}
                            {!user.isSubscribed && !user.isBlocked && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                {t('active')}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="text-center">{user.currentVideoIndex}</td>
                        <td className="text-sm text-slate-600">
                          {new Date(user.lastActiveAt).toLocaleDateString()}
                        </td>
                        <td>
                          <Button
                            size="sm"
                            variant={user.isBlocked ? 'outline' : 'destructive'}
                            onClick={() => handleBlockToggle(user)}
                            disabled={actionLoading}
                            className="gap-2"
                          >
                            {user.isBlocked ? (
                              <>
                                <ShieldOff className="h-4 w-4" />
                                {t('unblockUser')}
                              </>
                            ) : (
                              <>
                                <Shield className="h-4 w-4" />
                                {t('blockUser')}
                              </>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Block Confirmation Dialog */}
      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent className={isRTL ? 'text-right' : 'text-left'}>
          <AlertDialogTitle>
            {selectedUser?.isBlocked ? t('unblockUser') : t('blockUser')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {selectedUser?.isBlocked
              ? `Are you sure you want to unblock ${selectedUser?.fullName || selectedUser?.waId}? They will be able to receive messages again.`
              : `Are you sure you want to block ${selectedUser?.fullName || selectedUser?.waId}? They will not be able to receive any messages.`}
          </AlertDialogDescription>
          <div className={`flex gap-3 ${isRTL ? 'justify-start' : 'justify-end'}`}>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmBlockToggle}
              disabled={actionLoading}
              className={selectedUser?.isBlocked ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {actionLoading ? (
                <>
                  <Loader2 className={`${isRTL ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />
                  {t('sending')}
                </>
              ) : selectedUser?.isBlocked ? (
                t('unblockUser')
              ) : (
                t('blockUser')
              )}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
