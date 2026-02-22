import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { botResponses, buttons } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { Edit2, Plus, Trash2, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Button {
  id: number;
  buttonId: string;
  title: string;
  order: number;
}

interface BotResponse {
  id: number;
  key: string;
  text: string;
  description: string | null;
  buttons: Button[];
}

export default function Responses() {
  const { t, isRTL } = useLanguage();
  const [responses, setResponses] = useState<BotResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      setLoading(true);
      const response = await botResponses.getResponses();
      setResponses(response as BotResponse[]);
    } catch (err) {
      toast.error('Failed to fetch bot responses');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (response: BotResponse) => {
    setEditingId(response.id);
    setEditText(response.text);
  };

  const handleSave = async () => {
    if (!editingId || !editText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setSaving(true);
      await botResponses.updateResponse(editingId, { text: editText });
      
      setResponses((prev) =>
        prev.map((r) =>
          r.id === editingId ? { ...r, text: editText } : r
        )
      );

      setEditingId(null);
      setEditText('');
      toast.success(t('messageSuccess'));
    } catch (err) {
      toast.error('Error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleDeleteButton = async (buttonId: number, responseId: number) => {
    try {
      await buttons.deleteButton(buttonId);
      
      setResponses((prev) =>
        prev.map((r) =>
          r.id === responseId
            ? { ...r, buttons: r.buttons.filter((b) => b.id !== buttonId) }
            : r
        )
      );

      toast.success(t('messageSuccess'));
    } catch (err) {
      toast.error('Error');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold text-slate-900">{t('manageResponses')}</h1>
          <p className="text-slate-600 mt-2">{t('editResponses')}</p>
        </div>

        {/* Responses List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : responses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-600">No responses found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {responses.map((response) => (
              <Card key={response.id} className="overflow-hidden">
                <CardHeader className={`pb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className="flex-1">
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="flex flex-col gap-1">
                          <code className="w-fit px-2 py-1 bg-slate-100 text-slate-900 rounded text-xs font-mono">
                            {response.key}
                          </code>
                          {response.description && (
                            <span className="text-sm font-medium text-slate-700">
                              {response.description}
                            </span>
                          )}
                          <span className="text-xs text-slate-500">
                            {response.buttons.length} {t('botResponses')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedId(expandedId === response.id ? null : response.id)}
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {expandedId === response.id ? '−' : '+'}
                    </button>
                  </div>
                </CardHeader>

                {expandedId === response.id && (
                  <CardContent className="space-y-4 pt-0">
                    {/* Message Text */}
                    <div className="space-y-2">
                      <label className={`block text-sm font-medium text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t('responseText')}</label>
                      {editingId === response.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className={`min-h-24 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                          />
                          <div className={`flex gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                            <Button
                              variant="outline"
                              onClick={handleCancel}
                              disabled={saving}
                            >
                              {t('cancel')}
                            </Button>
                            <Button
                              onClick={handleSave}
                              disabled={saving}
                              className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                            >
                              {saving ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  {t('sending')}
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4" />
                                  {t('saveChanges')}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <p className={`text-sm text-slate-900 whitespace-pre-wrap ${isRTL ? 'text-right' : 'text-left'}`}>{response.text}</p>
                          <button
                            onClick={() => handleEdit(response)}
                            className={`mt-3 inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium ${isRTL ? 'flex-row-reverse' : ''}`}
                          >
                            <Edit2 className="h-4 w-4" />
                            {t('edit')}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Buttons */}
                    {response.buttons.length > 0 && (
                      <div className="space-y-2">
                        <label className={`block text-sm font-medium text-slate-900 ${isRTL ? 'text-right' : 'text-left'}`}>{t('buttonsConfig')}</label>
                        <div className="space-y-2">
                          {response.buttons.map((btn) => (
                            <div
                              key={btn.id}
                              className={`flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                              <div className={isRTL ? 'text-right' : 'text-left'}>
                                <p className="text-sm font-medium text-slate-900">{btn.title}</p>
                                <p className="text-xs text-slate-600 font-mono">{btn.buttonId}</p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteButton(btn.id, response.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Add Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        >
                          <Plus className="h-4 w-4" />
                          {t('addButton')}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className={isRTL ? 'text-right' : 'text-left'}>
                        <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
                          <DialogTitle>{t('addButton')}</DialogTitle>
                          <DialogDescription>
                            {t('buttonsConfig')}
                          </DialogDescription>
                        </DialogHeader>
                        <AddButtonForm
                          responseId={response.id}
                          onSuccess={() => {
                            fetchResponses();
                            toast.success(t('messageSuccess'));
                          }}
                        />
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function AddButtonForm({
  responseId,
  onSuccess,
}: {
  responseId: number;
  onSuccess: () => void;
}) {
  const { t, isRTL } = useLanguage();
  const [buttonId, setButtonId] = useState('');
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState('0');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!buttonId.trim() || !title.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await buttons.addButton({
        responseId,
        buttonId,
        title,
        order: parseInt(order),
      });
      onSuccess();
    } catch (err) {
      toast.error('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className={`block text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('buttonId')}</label>
        <Input
          placeholder="e.g., REGISTER_BTN"
          value={buttonId}
          onChange={(e) => setButtonId(e.target.value)}
          disabled={loading}
          className={isRTL ? 'text-right' : 'text-left'}
        />
      </div>
      <div className="space-y-2">
        <label className={`block text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('buttonTitle')}</label>
        <Input
          placeholder="e.g., Register Now"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          className={isRTL ? 'text-right' : 'text-left'}
        />
      </div>
      <div className="space-y-2">
        <label className={`block text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('order')}</label>
        <Input
          type="number"
          placeholder="0"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          disabled={loading}
          className={isRTL ? 'text-right' : 'text-left'}
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700"
      >
        {loading ? t('sending') : t('addButton')}
      </Button>
    </form>
  );
}
