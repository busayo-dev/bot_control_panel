import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { schedule as scheduleApi } from '@/lib/scheduleApi';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

interface ScheduleData {
  dayOfWeek: number;
  availabilityType: 'ALWAYS' | 'NEVER' | 'CUSTOM';
  startTime?: string;
  endTime?: string;
  unavailableMessage?: string;
}

const DAYS_OF_WEEK = [
  { value: 0, labelKey: 'sunday' },
  { value: 1, labelKey: 'monday' },
  { value: 2, labelKey: 'tuesday' },
  { value: 3, labelKey: 'wednesday' },
  { value: 4, labelKey: 'thursday' },
  { value: 5, labelKey: 'friday' },
  { value: 6, labelKey: 'saturday' },
];

export default function Schedule() {
  const { t, isRTL } = useLanguage();
  const [schedules, setSchedules] = useState<ScheduleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [currentAvailability, setCurrentAvailability] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState<ScheduleData>({
    dayOfWeek: 0,
    availabilityType: 'ALWAYS',
    startTime: '09:00',
    endTime: '17:00',
    unavailableMessage: 'The service is currently unavailable.',
  });

  useEffect(() => {
    fetchSchedules();
    checkCurrentAvailability();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await scheduleApi.getAllSchedules();
      setSchedules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failedToFetchSchedules'));
    } finally {
      setLoading(false);
    }
  };

  const checkCurrentAvailability = async () => {
    try {
      const availability = await scheduleApi.checkAvailability();
      setCurrentAvailability(availability);
    } catch (err) {
      console.error('Failed to check availability:', err);
    }
  };

  const handleDaySelect = (dayOfWeek: number) => {
    const daySchedule = schedules.find((s) => s.dayOfWeek === dayOfWeek);
    if (daySchedule) {
      setFormData(daySchedule);
    } else {
      setFormData({
        dayOfWeek,
        availabilityType: 'ALWAYS',
        startTime: '09:00',
        endTime: '17:00',
        unavailableMessage: 'The service is currently unavailable.',
      });
    }
    setEditingDay(dayOfWeek);
  };

  const handleSaveSchedule = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Validate form data
      if (formData.availabilityType === 'CUSTOM') {
        if (!formData.startTime || !formData.endTime) {
          setError(t('startEndTimeRequired'));
          setSaving(false);
          return;
        }
        if (formData.startTime >= formData.endTime) {
          setError(t('startTimeBeforeEndTime'));
          setSaving(false);
          return;
        }
      }

      await scheduleApi.updateSchedule(formData.dayOfWeek, {
        availabilityType: formData.availabilityType,
        startTime: formData.availabilityType === 'CUSTOM' ? formData.startTime : undefined,
        endTime: formData.availabilityType === 'CUSTOM' ? formData.endTime : undefined,
        unavailableMessage: formData.unavailableMessage,
      });

      setSuccess(t('schedulesSavedSuccessfully'));
      await fetchSchedules();
      setEditingDay(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failedToSaveSchedule'));
    } finally {
      setSaving(false);
    }
  };

  const handleInitializeSchedules = async () => {
    if (!window.confirm(t('resetSchedulesConfirm'))) {
      return;
    }

    try {
      setSaving(true);
      setError(null);
      await scheduleApi.initializeSchedules();
      setSuccess(t('schedulesInitializedToDefaults'));
      await fetchSchedules();
      setEditingDay(null);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('failedToInitializeSchedules'));
    } finally {
      setSaving(false);
    }
  };

  const getDayLabel = (dayOfWeek: number) => {
    const day = DAYS_OF_WEEK.find((d) => d.value === dayOfWeek);
    return day ? t(day.labelKey) : '';
  };

  const getAvailabilityBadge = (schedule: ScheduleData) => {
    if (schedule.availabilityType === 'ALWAYS') {
      return <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{t('alwaysAvailable')}</span>;
    } else if (schedule.availabilityType === 'NEVER') {
      return <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">{t('neverAvailable')}</span>;
    } else {
      return (
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {schedule.startTime} - {schedule.endTime}
        </span>
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold text-slate-900">{t('botAvailabilitySchedule')}</h1>
          <p className="text-slate-600 mt-2">{t('configureWhenBotAvailable')}</p>
        </div>

        {/* Current Status */}
        {currentAvailability && (
          <Card className={currentAvailability.isAvailable ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                {currentAvailability.isAvailable ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600" />
                )}
                <div>
                  <p className={`font-semibold ${currentAvailability.isAvailable ? 'text-green-900' : 'text-red-900'}`}>
                    {currentAvailability.isAvailable ? t('botCurrentlyAvailable') : t('botCurrentlyUnavailable')}
                  </p>
                  {currentAvailability.message && (
                    <p className={`text-sm ${currentAvailability.isAvailable ? 'text-green-700' : 'text-red-700'}`}>
                      {currentAvailability.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error/Success Messages */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-900">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-900">{success}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Weekly Schedule Overview */}
        <Card>
          <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
            <CardTitle>{t('weeklySchedule')}</CardTitle>
            <CardDescription>{t('viewManageAvailability')}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Spinner />
              </div>
            ) : (
              <div className="space-y-3">
                {DAYS_OF_WEEK.map((day) => {
                  const daySchedule = schedules.find((s) => s.dayOfWeek === day.value);
                  return (
                    <div
                      key={day.value}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <span className="font-semibold w-24 text-slate-900">{t(day.labelKey)}</span>
                        {daySchedule ? (
                          getAvailabilityBadge(daySchedule)
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{t('notConfigured')}</span>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDaySelect(day.value)}
                        className={isRTL ? 'ml-2' : 'mr-2'}
                      >
                        {editingDay === day.value ? t('editing') : t('editSchedule')}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Initialize Button */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={handleInitializeSchedules}
            disabled={saving}
            className="text-slate-600"
          >
            {t('resetToDefaults')}
          </Button>
        </div>
      </div>

      {/* Edit Schedule Modal Dialog */}
      <Dialog open={editingDay !== null} onOpenChange={(open) => !open && setEditingDay(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
            <DialogTitle>{t('editSchedule')} - {editingDay !== null ? getDayLabel(editingDay) : ''}</DialogTitle>
            <DialogDescription>{t('configureAvailability')}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Availability Type Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">{t('availabilityType')}</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['ALWAYS', 'NEVER', 'CUSTOM'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, availabilityType: type as any })}
                    className={`p-4 border-2 rounded-lg transition-all text-center cursor-pointer ${
                      formData.availabilityType === type
                        ? 'border-blue-600 bg-blue-100'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-slate-900">{t(type.toLowerCase())}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      {type === 'ALWAYS' && t('available24_7')}
                      {type === 'NEVER' && t('notAvailable')}
                      {type === 'CUSTOM' && t('customHours')}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Time Inputs */}
            {formData.availabilityType === 'CUSTOM' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg border border-blue-200">
                <div className="space-y-2">
                  <Label htmlFor="startTime">{t('startTime')}</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime || '09:00'}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">{t('endTime')}</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime || '17:00'}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {/* Unavailable Message */}
            <div className="space-y-2">
              <Label htmlFor="message">{t('messageWhenUnavailable')}</Label>
              <Textarea
                id="message"
                placeholder={t('enterMessageUnavailable')}
                value={formData.unavailableMessage || ''}
                onChange={(e) => setFormData({ ...formData, unavailableMessage: e.target.value })}
                className="w-full"
                rows={3}
              />
              <p className="text-xs text-slate-500">
                {t('leaveEmptyToIgnore')}
              </p>
            </div>
          </div>

          {/* Dialog Footer with Action Buttons */}
          <DialogFooter className={isRTL ? 'flex-row-reverse' : ''}>
            <Button
              variant="outline"
              onClick={() => setEditingDay(null)}
              disabled={saving}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleSaveSchedule}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {saving ? t('saving') : t('saveSchedule')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
