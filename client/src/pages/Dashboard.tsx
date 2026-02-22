import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { stats } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, UserCheck, UserX, Send, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Stats {
  total_users: number;
  active_subscribers: number;
  blocked_users: number;
  sent_today: number;
  active_24h: number;
  active_1h: number;
}

type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface ChartDataPoint {
  name: string;
  date: string;
  allMessages: number;
  sentMessages: number;
  receivedMessages: number;
  videosSent: number;
}

export default function Dashboard() {
  const { t, isRTL } = useLanguage();
  const [statsData, setStatsData] = useState<Stats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, chartRes] = await Promise.all([
          stats.getStats(),
          stats.getChartData(timeRange)
        ]);
        setStatsData(statsRes as Stats);
        setChartData(chartRes as ChartDataPoint[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold text-slate-900">{t('dashboard')}</h1>
          <p className="text-slate-600 mt-2">{t('overview')}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          <StatCard
            title={t('totalUsers')}
            value={statsData?.total_users || 0}
            icon={<Users className="w-5 h-5 text-emerald-600" />}
            trend="+12%"
            loading={loading}
          />
          <StatCard
            title={t('activeSubscribers')}
            value={statsData?.active_subscribers || 0}
            icon={<UserCheck className="w-5 h-5 text-blue-600" />}
            trend="+8%"
            loading={loading}
          />
          <StatCard
            title={t('blockedUsers')}
            value={statsData?.blocked_users || 0}
            icon={<UserX className="w-5 h-5 text-red-600" />}
            trend="-2%"
            loading={loading}
          />
          <StatCard
            title={t('sentToday')}
            value={statsData?.sent_today || 0}
            icon={<Send className="w-5 h-5 text-purple-600" />}
            trend="+24%"
            loading={loading}
          />
          <StatCard
            title={t('active24h')}
            value={statsData?.active_24h || 0}
            icon={<Users className="w-5 h-5 text-orange-600" />}
            trend="+15%"
            loading={loading}
          />
          <StatCard
            title={t('active1h')}
            value={statsData?.active_1h || 0}
            icon={<Users className="w-5 h-5 text-amber-600" />}
            trend="+5%"
            loading={loading}
          />
        </div>

        {/* Time Range Selector */}
        <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <label className={`text-sm font-medium text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('timeRange')}:
          </label>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="w-32" dir={isRTL ? 'rtl' : 'ltr'}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
              <SelectItem value="daily">{t('daily')}</SelectItem>
              <SelectItem value="weekly">{t('weekly')}</SelectItem>
              <SelectItem value="monthly">{t('monthly')}</SelectItem>
              <SelectItem value="yearly">{t('yearly')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* All Messages Chart */}
          <Card>
            <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
              <CardTitle>{t('allMessages')}</CardTitle>
              <CardDescription>{t('allMessagesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" orientation={isRTL ? 'right' : 'left'} />
                  <YAxis stroke="#64748b" orientation={isRTL ? 'right' : 'left'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      textAlign: isRTL ? 'right' : 'left'
                    }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="allMessages"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    name={t('allMessages')}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sent Messages Chart */}
          <Card>
            <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
              <CardTitle>{t('sentMessages')}</CardTitle>
              <CardDescription>{t('sentMessagesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" orientation={isRTL ? 'right' : 'left'} />
                  <YAxis stroke="#64748b" orientation={isRTL ? 'right' : 'left'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #3b82f6',
                      borderRadius: '8px',
                      textAlign: isRTL ? 'right' : 'left'
                    }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="sentMessages" fill="#3b82f6" radius={[8, 8, 0, 0]} name={t('sentMessages')} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Received Messages Chart */}
          <Card>
            <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
              <CardTitle>{t('receivedMessages')}</CardTitle>
              <CardDescription>{t('receivedMessagesDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" orientation={isRTL ? 'right' : 'left'} />
                  <YAxis stroke="#64748b" orientation={isRTL ? 'right' : 'left'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #f59e0b',
                      borderRadius: '8px',
                      textAlign: isRTL ? 'right' : 'left'
                    }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Bar dataKey="receivedMessages" fill="#f59e0b" radius={[8, 8, 0, 0]} name={t('receivedMessages')} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Video Activity Chart */}
          <Card>
            <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
              <CardTitle>{t('videoActivity')}</CardTitle>
              <CardDescription>{t('videoActivityDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" orientation={isRTL ? 'right' : 'left'} />
                  <YAxis stroke="#64748b" orientation={isRTL ? 'right' : 'left'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #8b5cf6',
                      borderRadius: '8px',
                      textAlign: isRTL ? 'right' : 'left'
                    }}
                    labelStyle={{ color: '#f1f5f9' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="videosSent"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', r: 6 }}
                    name={t('videosSent')}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
            <CardTitle>{t('quickActions')}</CardTitle>
            <CardDescription>{t('commonTasks')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/dashboard/users"
                className="p-4 border border-border rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
              >
                <Users className={`w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform ${isRTL ? 'float-right ml-2' : ''}`} />
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className="font-semibold text-slate-900">{t('users')}</p>
                  <p className="text-sm text-slate-600">{t('manageUsersDesc')}</p>
                </div>
              </a>
              <a
                href="/dashboard/messages"
                className="p-4 border border-border rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
              >
                <Send className={`w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform ${isRTL ? 'float-right ml-2' : ''}`} />
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className="font-semibold text-slate-900">{t('messages')}</p>
                  <p className="text-sm text-slate-600">{t('sendMessagesDesc')}</p>
                </div>
              </a>
              <a
                href="/dashboard/responses"
                className="p-4 border border-border rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
              >
                <TrendingUp className={`w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform ${isRTL ? 'float-right ml-2' : ''}`} />
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className="font-semibold text-slate-900">{t('botResponses')}</p>
                  <p className="text-sm text-slate-600">{t('botResponsesDesc')}</p>
                </div>
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
  const { t, isRTL } = useLanguage();
  return (
    <Card className="stat-card">
      <CardContent className="pt-6">
        <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <p className="stat-label">{title}</p>
            <p className="stat-value mt-2">
              {loading ? '...' : value.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-600 font-medium mt-2">{trend} {t('fromLastWeek')}</p>
          </div>
          <div className="p-3 bg-slate-100 rounded-lg">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}
