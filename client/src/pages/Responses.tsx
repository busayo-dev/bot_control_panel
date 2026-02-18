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
  buttons: Button[];
}

export default function Responses() {
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
      toast.success('Response updated successfully');
    } catch (err) {
      toast.error('Failed to update response');
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

      toast.success('Button deleted successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete button');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bot Responses</h1>
          <p className="text-slate-600 mt-2">Manage bot messages and buttons</p>
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
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-slate-100 text-slate-900 rounded text-xs font-mono">
                          {response.key}
                        </code>
                        <span className="text-xs text-slate-600">
                          {response.buttons.length} button{response.buttons.length !== 1 ? 's' : ''}
                        </span>
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
                      <label className="text-sm font-medium text-slate-900">Message Text</label>
                      {editingId === response.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="min-h-24 resize-none"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              onClick={handleCancel}
                              disabled={saving}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSave}
                              disabled={saving}
                              className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                            >
                              {saving ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4" />
                                  Save
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                          <p className="text-sm text-slate-900 whitespace-pre-wrap">{response.text}</p>
                          <button
                            onClick={() => handleEdit(response)}
                            className="mt-3 inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Buttons */}
                    {response.buttons.length > 0 && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-900">Buttons</label>
                        <div className="space-y-2">
                          {response.buttons.map((btn) => (
                            <div
                              key={btn.id}
                              className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200"
                            >
                              <div>
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
                          Add Button
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Button</DialogTitle>
                          <DialogDescription>
                            Add a new button to this response
                          </DialogDescription>
                        </DialogHeader>
                        <AddButtonForm
                          responseId={response.id}
                          onSuccess={() => {
                            fetchResponses();
                            toast.success('Button added successfully');
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
      toast.error('Failed to add button');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Button ID</label>
        <Input
          placeholder="e.g., REGISTER_BTN"
          value={buttonId}
          onChange={(e) => setButtonId(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Button Title</label>
        <Input
          placeholder="e.g., Register Now"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Order</label>
        <Input
          type="number"
          placeholder="0"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          disabled={loading}
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700"
      >
        {loading ? 'Adding...' : 'Add Button'}
      </Button>
    </form>
  );
}
