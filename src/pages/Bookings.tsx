import { useState } from 'react';
import { Plus, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDateTime } from '../lib/utils';
import { toast } from 'sonner';

export default function Bookings() {
  const bookings = useStore((state) => state.bookings);
  const clients = useStore((state) => state.clients);
  const packages = useStore((state) => state.packages);
  const addBooking = useStore((state) => state.addBooking);
  const updateBooking = useStore((state) => state.updateBooking);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    packageId: '',
    date: '',
    location: '',
    notes: '',
  });

  const scheduledBookings = bookings.filter((b) => b.status === 'scheduled');
  const completedBookings = bookings.filter((b) => b.status === 'completed');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === formData.clientId);
    const pkg = packages.find((p) => p.id === formData.packageId);

    if (!client || !pkg) return;

    addBooking({
      clientId: client.id,
      clientName: client.name,
      packageId: pkg.id,
      packageName: pkg.name,
      date: new Date(formData.date),
      location: formData.location,
      status: 'scheduled',
      duration: pkg.duration,
      price: pkg.price,
      notes: formData.notes,
    });

    setFormData({ clientId: '', packageId: '', date: '', location: '', notes: '' });
    setOpen(false);
    toast.success('Booking created successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{booking.clientName}</CardTitle>
            <Badge className={getStatusColor(booking.status)}>
              {booking.status}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">{formatCurrency(booking.price)}</p>
            <p className="text-sm text-muted-foreground">{booking.packageName}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>{formatDateTime(new Date(booking.date))}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{booking.duration} minutes</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{booking.location}</span>
          </div>
        </div>
        {booking.notes && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">{booking.notes}</p>
          </div>
        )}
        {booking.status === 'scheduled' && (
          <div className="flex gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                updateBooking(booking.id, { status: 'completed' });
                toast.success('Booking marked as completed');
              }}
            >
              Mark Complete
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => {
                updateBooking(booking.id, { status: 'cancelled' });
                toast.info('Booking cancelled');
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
          <p className="text-muted-foreground">Manage your photography sessions</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Booking</DialogTitle>
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
                <Label>Package</Label>
                <Select value={formData.packageId} onValueChange={(value) => setFormData({ ...formData, packageId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a package" />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.name} - {formatCurrency(pkg.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date & Time</Label>
                <Input
                  type="datetime-local"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Central Park, Studio A"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full">Create Booking</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bookings Tabs */}
      <Tabs defaultValue="scheduled" className="space-y-6">
        <TabsList>
          <TabsTrigger value="scheduled">
            Scheduled ({scheduledBookings.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scheduledBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
          {scheduledBookings.length === 0 && (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">No scheduled bookings</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
          {completedBookings.length === 0 && (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground">No completed bookings</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
