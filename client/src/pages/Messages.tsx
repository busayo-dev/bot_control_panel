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
import { Send, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type MessageTarget = 'all' | 'subscribers' | 'blocked';

interface SendResult {
  success: number;
  failure: number;
}

export default function Messages() {
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState<MessageTarget>('subscribers');
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);

  const targetLabels: Record<MessageTarget, string> = {
    all: 'All Users',
    subscribers: 'Active Subscribers Only',
    blocked: 'Blocked Users Only',
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
      });

      setResult(response.results as SendResult);
      setMessage('');
      toast.success('Messages sent successfully');
    } catch (err) {
      toast.error('Failed to send messages');
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bulk Messaging</h1>
          <p className="text-slate-600 mt-2">Send messages to multiple users at once</p>
        </div>

        {/* Message Composer */}
        <Card>
          <CardHeader>
            <CardTitle>Compose Message</CardTitle>
            <CardDescription>Create and send a message to your users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Target Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Send To</label>
              <Select value={target} onValueChange={(value) => setTarget(value as MessageTarget)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="subscribers">Active Subscribers Only</SelectItem>
                  <SelectItem value="blocked">Blocked Users Only</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-600">
                Messages will be sent to: <span className="font-semibold">{targetLabels[target]}</span>
              </p>
            </div>

            {/* Message Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-900">Message Content</label>
              <Textarea
                placeholder="Enter your message here... (supports emoji and line breaks)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
                className="min-h-32 resize-none"
              />
              <p className="text-xs text-slate-600">
                Character count: {message.length} / 1000
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium">Important Notes</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                  <li>Messages will be sent immediately to all selected users</li>
                  <li>This action cannot be undone</li>
                  <li>Blocked users will not receive messages</li>
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
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                <CheckCircle className="h-5 w-5" />
                Messages Sent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-emerald-200">
                  <p className="text-sm text-slate-600">Successful</p>
                  <p className="text-3xl font-bold text-emerald-600">{result.success}</p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-red-200">
                  <p className="text-sm text-slate-600">Failed</p>
                  <p className="text-3xl font-bold text-red-600">{result.failure}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Template Suggestions */}
        <Card>
          <CardHeader>
            <CardTitle>Message Templates</CardTitle>
            <CardDescription>Quick templates for common messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TemplateButton
                title="Announcement"
                template="📢 Important Update: We have exciting new content coming your way! Stay tuned!"
                onClick={(text) => setMessage(text)}
              />
              <TemplateButton
                title="Reminder"
                template="⏰ Reminder: Don't forget to check your daily video! Reply 'Next' to get started."
                onClick={(text) => setMessage(text)}
              />
              <TemplateButton
                title="Maintenance"
                template="🔧 Scheduled Maintenance: We're updating our system. Services will be back online shortly."
                onClick={(text) => setMessage(text)}
              />
              <TemplateButton
                title="Survey"
                template="📋 Quick Survey: We'd love to hear your feedback! Reply with your thoughts."
                onClick={(text) => setMessage(text)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogTitle>Confirm Message Send</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="space-y-3">
              <p>You are about to send this message to <span className="font-semibold">{targetLabels[target]}</span>:</p>
              <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 max-h-32 overflow-y-auto">
                <p className="text-sm text-slate-900 whitespace-pre-wrap">{message}</p>
              </div>
              <p className="text-sm text-red-600 font-medium">This action cannot be undone.</p>
            </div>
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSend}
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? 'Sending...' : 'Send'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}

function TemplateButton({
  title,
  template,
  onClick,
}: {
  title: string;
  template: string;
  onClick: (text: string) => void;
}) {
  return (
    <button
      onClick={() => onClick(template)}
      className="p-3 text-left border border-border rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
    >
      <p className="font-medium text-slate-900 group-hover:text-emerald-600">{title}</p>
      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{template}</p>
    </button>
  );
}
