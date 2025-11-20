import { useState } from 'react';
import { Plus, Check, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../lib/utils';
import { toast } from 'sonner';

export default function Packages() {
  const packages = useStore((state) => state.packages);
  const addPackage = useStore((state) => state.addPackage);
  const updatePackage = useStore((state) => state.updatePackage);
  const deletePackage = useStore((state) => state.deletePackage);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    photoCount: '',
    features: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPackage({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
      photoCount: parseInt(formData.photoCount),
      features: formData.features.split('\n').filter(f => f.trim()),
    });

    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      photoCount: '',
      features: '',
    });
    setOpen(false);
    toast.success('Package created successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Packages</h1>
          <p className="text-muted-foreground">Manage your photography service packages</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Package
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Package</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Package Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Professional Package"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Duration (min)</Label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Photos</Label>
                  <Input
                    type="number"
                    value={formData.photoCount}
                    onChange={(e) => setFormData({ ...formData, photoCount: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Features (one per line)</Label>
                <Textarea
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  rows={5}
                  placeholder="1 hour session&#10;20 edited photos&#10;Online gallery"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Create Package</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Package Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg) => (
          <Card
            key={pkg.id}
            className={`relative hover:shadow-lg transition-shadow ${
              pkg.popular ? 'border-primary border-2' : ''
            }`}
          >
            {pkg.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                <Star className="mr-1 h-3 w-3 fill-current" />
                Most Popular
              </Badge>
            )}
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl">{pkg.name}</CardTitle>
              <CardDescription className="mt-2">{pkg.description}</CardDescription>
              <div className="mt-6">
                <span className="text-4xl font-bold">{formatCurrency(pkg.price)}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{pkg.duration} minutes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Photos</span>
                  <span className="font-medium">{pkg.photoCount} edited</span>
                </div>
              </div>

              <div className="border-t border-border pt-6 space-y-3">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="pt-6 space-y-2">
                <Button
                  variant={pkg.popular ? 'default' : 'outline'}
                  className="w-full"
                  onClick={() => {
                    updatePackage(pkg.id, { popular: !pkg.popular });
                    toast.success(pkg.popular ? 'Removed from popular' : 'Marked as popular');
                  }}
                >
                  {pkg.popular ? 'Remove Popular Badge' : 'Mark as Popular'}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this package?')) {
                      deletePackage(pkg.id);
                      toast.success('Package deleted');
                    }
                  }}
                >
                  Delete Package
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {packages.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">No packages yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
