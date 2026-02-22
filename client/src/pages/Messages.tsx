import { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { messaging } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { Send, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type MessageTarget = 'all' | 'subscribers' | 'blocked';

interface SendResult {
  success: number;
  failure: number;
}

export default function Messages() {
  const { t, isRTL } = useLanguage();
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<MessageTarget>('subscribers');
  const [onlyActive24h, setOnlyActive24h] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);

  const targetLabels: Record<MessageTarget, string> = {
    all: t('allUsers'),
    subscribers: t('onlySubscribers'),
    blocked: t('onlyBlocked'),
  };

  const handleSend = () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }
    setShowConfirm(true);
  };

  const confirmSend = async () => {
    try {
      setLoading(true);
      const response = await messaging.sendBulkMessage({
        message,
        target,
        onlyActive24h,
      });

      setResult(response.results as SendResult);
      setMessage('');
      toast.success(t('messageSuccess'));
    } catch (err) {
      toast.error('Error');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold text-slate-900">{t('broadcastMessages')}</h1>
          <p className="text-slate-600 mt-2">{t('sendBulk')}</p>
        </div>

        {/* Message Composer */}
        <Card>
          <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
            <CardTitle>{t('broadcastMessages')}</CardTitle>
            <CardDescription>{t('sendBulk')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Target Selection */}
            <div className="space-y-2">
              <label className={`block text-sm font-medium text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t('targetAudience')}</label>
              <Select value={target} onValueChange={(value) => setTarget(value as MessageTarget)}>
                <SelectTrigger dir={isRTL ? 'rtl' : 'ltr'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent dir={isRTL ? 'rtl' : 'ltr'}>
                  <SelectItem value="all">{t('allUsers')}</SelectItem>
                  <SelectItem value="subscribers">{t('onlySubscribers')}</SelectItem>
                  <SelectItem value="blocked">{t('onlyBlocked')}</SelectItem>
                </SelectContent>
              </Select>
              <p className={`text-xs text-slate-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('targetAudience')}: <span className="font-semibold">{targetLabels[target]}</span>
              </p>
            </div>

            {/* 24-Hour Active Users Toggle */}
            <div className={`flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex-1">
                <label className={`block text-sm font-medium text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('onlyActive24h')}
                </label>
                <p className={`text-xs text-slate-600 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('onlyActive24hDesc')}
                </p>
              </div>
              <input
                type="checkbox"
                checked={onlyActive24h}
                onChange={(e) => setOnlyActive24h(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-emerald-600 cursor-pointer"
              />
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <label className={`block text-sm font-medium text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t('messageContent')}</label>
              <Textarea
                placeholder={t('typeMessage')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                className={`min-h-32 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
              />
              <p className={`text-xs text-slate-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t('characterCount')}: {message.length} / 1000
              </p>
            </div>

            {/* Info Box */}
            <div className={`bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className={`text-sm text-blue-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="font-medium">{t('importantNotes')}</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                  <li>{t('messagesSentImmediately')}</li>
                  <li>{t('cannotUndo')}</li>
                </ul>
              </div>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('sending')}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t('sendMessage')}
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
              <CardTitle className={`flex items-center gap-2 text-emerald-900 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <CheckCircle className="h-5 w-5" />
                {t('messagesSent')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <p className="text-sm text-slate-600">{t('successful')}</p>
                  <p className="text-3xl font-bold text-emerald-600">{result.success}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm text-slate-600">{t('failed')}</p>
                  <p className="text-3xl font-bold text-red-600">{result.failure}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent className={isRTL ? 'text-right' : 'text-left'}>
          <AlertDialogTitle>{t('confirmMessageSend')}</AlertDialogTitle>
              <AlertDialogDescription>
            <div className="space-y-3">
              <p>
                {t('confirmSendMessage')} <span className="font-semibold">{targetLabels[target]}</span>
                {onlyActive24h && ` ${t('whoActive24h')}`}:
              </p>
              <div className={`bg-slate-100 p-4 rounded-lg border border-slate-200 max-h-32 overflow-y-auto ${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="text-sm text-slate-900 whitespace-pre-wrap">{message}</p>
              </div>
              <p className="text-sm text-red-600 font-medium">{t('cannotUndo')}</p>
            </div>
          </AlertDialogDescription>
          <div className={`flex gap-3 ${isRTL ? 'justify-start' : 'justify-end'}`}>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSend}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? t('sending') : t('sendMessage')}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
