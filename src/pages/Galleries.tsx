import { useState } from 'react';
import { Plus, Image as ImageIcon, Download, Link2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { useStore } from '../store/useStore';
import { formatDate } from '../lib/utils';
import { toast } from 'sonner';

export default function Galleries() {
  const galleries = useStore((state) => state.galleries);
  const clients = useStore((state) => state.clients);
  const addGallery = useStore((state) => state.addGallery);
  const updateGallery = useStore((state) => state.updateGallery);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    description: '',
    coverImage: '',
    photoCount: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === formData.clientId);
    if (!client) return;

    addGallery({
      clientId: client.id,
      clientName: client.name,
      title: formData.title,
      description: formData.description,
      coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
      photoCount: parseInt(formData.photoCount) || 0,
      deliveryStatus: 'pending',
      accessLink: `https://gallery.example.com/${formData.title.toLowerCase().replace(/\s+/g, '-')}`,
    });

    setFormData({ clientId: '', title: '', description: '', coverImage: '', photoCount: '' });
    setOpen(false);
    toast.success('Gallery created successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const copyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Galleries</h1>
          <p className="text-muted-foreground">Manage and deliver client photo galleries</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Gallery
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Gallery</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Gallery Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Summer Wedding 2024"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Cover Image URL</Label>
                <Input
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>Number of Photos</Label>
                <Input
                  type="number"
                  value={formData.photoCount}
                  onChange={(e) => setFormData({ ...formData, photoCount: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Create Gallery</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gallery Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {galleries.map((gallery) => (
          <Card key={gallery.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative overflow-hidden bg-muted">
              <img
                src={gallery.coverImage}
                alt={gallery.title}
                className="w-full h-full object-cover"
              />
              <Badge className={`absolute top-2 right-2 ${getStatusColor(gallery.deliveryStatus)}`}>
                {gallery.deliveryStatus}
              </Badge>
            </div>
            <CardHeader>
              <div className="space-y-1">
                <CardTitle className="text-lg">{gallery.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{gallery.clientName}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {gallery.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {gallery.description}
                </p>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{gallery.photoCount} photos</span>
                </div>
                <span className="text-muted-foreground">{formatDate(gallery.createdAt)}</span>
              </div>

              {gallery.accessLink && (
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => copyLink(gallery.accessLink!)}
                  >
                    <Link2 className="mr-2 h-4 w-4" />
                    Copy Gallery Link
                  </Button>
                </div>
              )}

              {gallery.deliveryStatus !== 'delivered' && (
                <div className="flex gap-2">
                  {gallery.deliveryStatus === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        updateGallery(gallery.id, { deliveryStatus: 'processing' });
                        toast.info('Gallery status updated to processing');
                      }}
                    >
                      Start Processing
                    </Button>
                  )}
                  {gallery.deliveryStatus === 'processing' && (
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        updateGallery(gallery.id, { deliveryStatus: 'delivered' });
                        toast.success('Gallery delivered to client');
                      }}
                    >
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Mark Delivered
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {galleries.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">No galleries yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
