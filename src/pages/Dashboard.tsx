import { Calendar, DollarSign, Image, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate } from '../lib/utils';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const clients = useStore((state) => state.clients);
  const bookings = useStore((state) => state.bookings);
  const galleries = useStore((state) => state.galleries);
  const referrals = useStore((state) => state.referrals);

  const totalRevenue = bookings.reduce((sum, b) => sum + b.price, 0);
  const upcomingBookings = bookings.filter(
    (b) => b.status === 'scheduled' && new Date(b.date) > new Date()
  );
  const pendingGalleries = galleries.filter((g) => g.deliveryStatus !== 'delivered');
  const activeReferrals = referrals.filter((r) => r.status === 'converted');

  const stats = [
    {
      title: 'Total Clients',
      value: clients.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Revenue',
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Upcoming Shoots',
      value: upcomingBookings.length,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Active Referrals',
      value: activeReferrals.length,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentBookings = bookings
    .filter((b) => b.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBookings.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No upcoming bookings
              </p>
            ) : (
              recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => navigate('/bookings')}
                >
                  <div className="space-y-1">
                    <p className="font-medium">{booking.clientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(new Date(booking.date))} • {booking.location}
                    </p>
                  </div>
                  <Badge variant="secondary">{booking.packageName}</Badge>
                </div>
              ))
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/bookings')}
            >
              View All Bookings
            </Button>
          </CardContent>
        </Card>

        {/* Pending Deliveries */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Deliveries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingGalleries.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                All galleries delivered
              </p>
            ) : (
              pendingGalleries.map((gallery) => (
                <div
                  key={gallery.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => navigate('/galleries')}
                >
                  <div className="h-12 w-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={gallery.coverImage}
                      alt={gallery.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-medium">{gallery.title}</p>
                    <p className="text-sm text-muted-foreground">{gallery.clientName}</p>
                  </div>
                  <Badge
                    variant={
                      gallery.deliveryStatus === 'processing' ? 'default' : 'secondary'
                    }
                  >
                    {gallery.deliveryStatus}
                  </Badge>
                </div>
              ))
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/galleries')}
            >
              View All Galleries
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle>Top Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clients
              .sort((a, b) => b.totalSpent - a.totalSpent)
              .slice(0, 5)
              .map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                  onClick={() => navigate('/clients')}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {client.totalBookings} bookings • {client.referralCount} referrals
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(client.totalSpent)}</p>
                    <p className="text-sm text-muted-foreground">Total spent</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
