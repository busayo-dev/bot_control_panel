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
  const [videoList, setVideoList] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ url: '', description: '' });
  const [saving, setSaving] = useState(false);

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
      toast.success('Video updated successfully');
    } catch (err) {
      toast.error('Failed to update video');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({ url: '', description: '' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Video Management</h1>
          <p className="text-slate-600 mt-2">Manage video content and descriptions</p>
        </div>

        {/* Info Box */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Note:</span> Videos are delivered sequentially to users. Each video has a unique index number that determines the delivery order.
            </p>
          </CardContent>
        </Card>

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
                    Add First Video
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Video</DialogTitle>
                    <DialogDescription>
                      Add a new video to your collection
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
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">Video #{video.videoIndex}</CardTitle>
                      <CardDescription>Index: {video.videoIndex}</CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {editingId === video.id ? (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Video URL</label>
                        <Input
                          placeholder="https://..."
                          value={editData.url}
                          onChange={(e) =>
                            setEditData({ ...editData, url: e.target.value })
                          }
                          disabled={saving}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          placeholder="Video description..."
                          value={editData.description}
                          onChange={(e) =>
                            setEditData({ ...editData, description: e.target.value })
                          }
                          disabled={saving}
                          className="min-h-20 resize-none"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
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
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-3 w-3" />
                              Save
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {video.videoUrl && (
                        <div className="space-y-2">
                          <p className="text-xs text-slate-600 font-medium">URL</p>
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
                        <div className="space-y-2">
                          <p className="text-xs text-slate-600 font-medium">Description</p>
                          <p className="text-sm text-slate-900 line-clamp-3">
                            {video.description}
                          </p>
                        </div>
                      )}
                      {!video.videoUrl && !video.description && (
                        <p className="text-sm text-slate-500 italic">No content added yet</p>
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
                    <p className="text-sm font-medium text-slate-600">Add New Video</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Video</DialogTitle>
                  <DialogDescription>
                    Add a new video to your collection
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
      toast.success('Video added successfully');
    } catch (err) {
      toast.error('Failed to add video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Video Index</label>
        <Input
          type="number"
          placeholder="e.g., 1"
          value={videoIndex}
          onChange={(e) => setVideoIndex(e.target.value)}
          disabled={loading}
        />
        <p className="text-xs text-slate-600">
          Unique number for this video in the sequence
        </p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Video URL</label>
        <Input
          placeholder="https://example.com/video.mp4"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          placeholder="Optional: Describe this video..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          className="min-h-20 resize-none"
        />
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-700"
      >
        {loading ? 'Adding...' : 'Add Video'}
      </Button>
    </form>
  );
}
