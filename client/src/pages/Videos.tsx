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
import { videos } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { Edit2, Plus, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';

interface Video {
  id: number;
  videoIndex: number;
  videoUrl: string | null;
  description: string | null;
  createdAt: string;
}

export default function Videos() {
  const { t, isRTL } = useLanguage();
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ url: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [globalDesc, setGlobalDesc] = useState('');
  const [updatingGlobal, setUpdatingGlobal] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await videos.getVideos();
      setVideoList((response as Video[]).sort((a, b) => a.videoIndex - b.videoIndex));
    } catch (err) {
      toast.error('Failed to fetch videos');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingId(video.id);
    setEditData({
      url: video.videoUrl || '',
      description: video.description || '',
    });
  };

  const handleSave = async () => {
    if (!editingId) return;

    const video = videoList.find((v) => v.id === editingId);
    if (!video) return;

    try {
      setSaving(true);
      await videos.updateVideo({
        video_index: video.videoIndex,
        video_url: editData.url,
        description: editData.description,
      });

      setVideoList((prev) =>
        prev.map((v) =>
          v.id === editingId
            ? {
                ...v,
                videoUrl: editData.url,
                description: editData.description,
              }
            : v
        )
      );

      setEditingId(null);
      setEditData({ url: '', description: '' });
      toast.success(t('messageSuccess'));
    } catch (err) {
      toast.error('Error');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({ url: '', description: '' });
  };

  const handleGlobalUpdate = async () => {
    if (!globalDesc.trim()) {
      toast.error('Please enter a description');
      return;
    }

    try {
      setUpdatingGlobal(true);
      await videos.updateAllDescriptions(globalDesc);
      toast.success(t('messageSuccess'));
      fetchVideos();
      setGlobalDesc('');
    } catch (err) {
      toast.error('Failed to update all descriptions');
    } finally {
      setUpdatingGlobal(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold text-slate-900">{t('videoContent')}</h1>
          <p className="text-slate-600 mt-2">{t('manageVideos')}</p>
        </div>

        {/* Global Description Section */}
        <Card className="border-emerald-200 shadow-sm">
          <CardHeader className={isRTL ? 'text-right' : 'text-left'}>
            <CardTitle className="text-emerald-800">{t('globalDescription')}</CardTitle>
            <CardDescription>
              Updating this field will set the same description for all videos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={t('description')}
              value={globalDesc}
              onChange={(e) => setGlobalDesc(e.target.value)}
              className={`min-h-24 ${isRTL ? 'text-right' : 'text-left'}`}
            />
            <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
              <Button
                onClick={handleGlobalUpdate}
                disabled={updatingGlobal || !globalDesc.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 gap-2"
              >
                {updatingGlobal ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {t('updateAllVideos')}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="border-t border-slate-200 pt-4">
          <h2 className={`text-xl font-semibold text-slate-800 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('individualDescriptions')}
          </h2>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        ) : videoList.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-slate-600 mb-4">No videos found</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                    <Plus className="h-4 w-4" />
                    {t('addButton')}
                  </Button>
                </DialogTrigger>
                <DialogContent className={isRTL ? 'text-right' : 'text-left'}>
                  <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
                    <DialogTitle>{t('addButton')}</DialogTitle>
                    <DialogDescription>
                      {t('manageVideos')}
                    </DialogDescription>
                  </DialogHeader>
                  <AddVideoForm onSuccess={fetchVideos} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoList.map((video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className={`pb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div>
                      <CardTitle className="text-lg">{t('videos')} #{video.videoIndex}</CardTitle>
                      <CardDescription>{t('videoIndex')}: {video.videoIndex}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {editingId === video.id ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className={`block text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('videoUrl')}</label>
                        <Input
                          placeholder="https://..."
                          value={editData.url}
                          onChange={(e) =>
                            setEditData({ ...editData, url: e.target.value })
                          }
                          disabled={saving}
                          className={isRTL ? 'text-right' : 'text-left'}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={`block text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('description')}</label>
                        <Textarea
                          placeholder={t('description')}
                          value={editData.description}
                          onChange={(e) =>
                            setEditData({ ...editData, description: e.target.value })
                          }
                          disabled={saving}
                          className={`min-h-20 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
                        />
                      </div>
                      <div className={`flex gap-2 ${isRTL ? 'justify-start' : 'justify-end'}`}>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          disabled={saving}
                          size="sm"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSave}
                          disabled={saving}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 gap-2"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              {t('sending')}
                            </>
                          ) : (
                            <>
                              <Save className="h-3 w-3" />
                              {t('saveChanges')}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {video.videoUrl && (
                        <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <p className="text-xs text-slate-600 font-medium">{t('videoUrl')}</p>
                          <a
                            href={video.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-emerald-600 hover:text-emerald-700 break-all underline"
                          >
                            {video.videoUrl.substring(0, 50)}...
                          </a>
                        </div>
                      )}
                      {video.description && (
                        <div className={`space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                          <p className="text-xs text-slate-600 font-medium">{t('description')}</p>
                          <p className="text-sm text-slate-900 line-clamp-3">
                            {video.description}
                          </p>
                        </div>
                      )}
                      <Button
                        onClick={() => handleEdit(video)}
                        variant="outline"
                        className="w-full gap-2 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        size="sm"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}

            {/* Add New Video Card */}
            <Dialog>
              <DialogTrigger asChild>
                <Card className="border-2 border-dashed border-slate-300 hover:border-emerald-500 cursor-pointer transition-colors flex items-center justify-center min-h-64">
                  <CardContent className="text-center">
                    <Plus className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-slate-600">{t('addButton')}</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className={isRTL ? 'text-right' : 'text-left'}>
                <DialogHeader className={isRTL ? 'text-right' : 'text-left'}>
                  <DialogTitle>{t('addButton')}</DialogTitle>
                  <DialogDescription>
                    {t('manageVideos')}
                  </DialogDescription>
                </DialogHeader>
                <AddVideoForm onSuccess={fetchVideos} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function AddVideoForm({ onSuccess }: { onSuccess: () => void }) {
  const { t, isRTL } = useLanguage();
  const [videoIndex, setVideoIndex] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoIndex.trim() || !url.trim()) {
      toast.error('Please fill in video index and URL');
      return;
    }

    try {
      setLoading(true);
      await videos.updateVideo({
        video_index: parseInt(videoIndex),
        video_url: url,
        description,
      });
      onSuccess();
      toast.success(t('messageSuccess'));
    } catch (err) {
      toast.error('Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className={`block text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('videoIndex')}</label>
        <Input
          type="number"
          placeholder="e.g., 1"
          value={videoIndex}
          onChange={(e) => setVideoIndex(e.target.value)}
          disabled={loading}
          className={isRTL ? 'text-right' : 'text-left'}
        />
      </div>
      <div className="space-y-2">
        <label className={`block text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('videoUrl')}</label>
        <Input
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          className={isRTL ? 'text-right' : 'text-left'}
        />
      </div>
      <div className="space-y-2">
        <label className={`block text-sm font-medium ${isRTL ? 'text-right' : 'text-left'}`}>{t('description')}</label>
        <Textarea
          placeholder={t('description')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          className={`min-h-20 resize-none ${isRTL ? 'text-right' : 'text-left'}`}
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
