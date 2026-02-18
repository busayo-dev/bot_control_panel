import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { stats, users } from '@/lib/api';
import { Users, UserCheck, UserX, Send, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Stats {
  total_users: number;
  active_subscribers: number;
  blocked_users: number;
  sent_today: number;
}

export default function Dashboard() {
  const [statsData, setStatsData] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await stats.getStats();
        setStatsData(response as Stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: 'Mon', users: 400, messages: 240 },
    { name: 'Tue', users: 450, messages: 280 },
    { name: 'Wed', users: 520, messages: 350 },
    { name: 'Thu', users: 580, messages: 400 },
    { name: 'Fri', users: 620, messages: 450 },
    { name: 'Sat', users: 650, messages: 480 },
    { name: 'Sun', users: 680, messages: 500 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Overview of your WhatsApp bot operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={statsData?.total_users || 0}
            icon={<Users className="w-5 h-5 text-emerald-600" />}
            trend="+12%"
            loading={loading}
          />
          <StatCard
            title="Active Subscribers"
            value={statsData?.active_subscribers || 0}
            icon={<UserCheck className="w-5 h-5 text-blue-600" />}
            trend="+8%"
            loading={loading}
          />
          <StatCard
            title="Blocked Users"
            value={statsData?.blocked_users || 0}
            icon={<UserX className="w-5 h-5 text-red-600" />}
            trend="-2%"
            loading={loading}
          />
          <StatCard
            title="Sent Today"
            value={statsData?.sent_today || 0}
            icon={<Send className="w-5 h-5 text-purple-600" />}
            trend="+24%"
            loading={loading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>User engagement over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    name="New Users"
                  />
                  <Line
                    type="monotone"
                    dataKey="messages"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    name="Messages Sent"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Messages Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Message Distribution</CardTitle>
              <CardDescription>Daily message volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="messages" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/dashboard/users"
                className="p-4 border border-border rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
              >
                <Users className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-slate-900">Manage Users</p>
                <p className="text-sm text-slate-600">View and block users</p>
              </a>
              <a
                href="/dashboard/messages"
                className="p-4 border border-border rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
              >
                <Send className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-slate-900">Send Messages</p>
                <p className="text-sm text-slate-600">Bulk message users</p>
              </a>
              <a
                href="/dashboard/responses"
                className="p-4 border border-border rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
              >
                <TrendingUp className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-slate-900">Bot Responses</p>
                <p className="text-sm text-slate-600">Edit bot messages</p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function StatCard({
  title,
  value,
  icon,
  trend,
  loading,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: string;
  loading: boolean;
}) {
  return (
    <Card className="stat-card">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="stat-label">{title}</p>
            <p className="stat-value mt-2">
              {loading ? '...' : value.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-600 font-medium mt-2">{trend} from last week</p>
          </div>
          <div className="p-3 bg-slate-100 rounded-lg">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
