import { useState } from 'react';
import { Plus, TrendingUp, UserPlus, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useStore } from '../store/useStore';
import { formatCurrency, formatDate } from '../lib/utils';
import { toast } from 'sonner';

export default function Referrals() {
  const referrals = useStore((state) => state.referrals);
  const clients = useStore((state) => state.clients);
  const addReferral = useStore((state) => state.addReferral);
  const updateReferral = useStore((state) => state.updateReferral);

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    referrerId: '',
    referredClientName: '',
  });

  const totalValue = referrals
    .filter((r) => r.status === 'converted')
    .reduce((sum, r) => sum + (r.value || 0), 0);

  const conversionRate = referrals.length > 0
    ? ((referrals.filter((r) => r.status === 'converted').length / referrals.length) * 100).toFixed(0)
    : 0;

  const topReferrers = clients
    .filter((c) => c.referralCount > 0)
    .sort((a, b) => b.referralCount - a.referralCount)
    .slice(0, 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const referrer = clients.find((c) => c.id === formData.referrerId);
    if (!referrer) return;

    addReferral({
      referrerId: referrer.id,
      referrerName: referrer.name,
      referredClientName: formData.referredClientName,
      status: 'pending',
    });

    setFormData({ referrerId: '', referredClientName: '' });
    setOpen(false);
    toast.success('Referral tracked successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converted':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'declined':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Referrals</h1>
          <p className="text-muted-foreground">Track and manage client referrals</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Referral
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Track New Referral</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Referring Client</Label>
                <Select
                  value={formData.referrerId}
                  onValueChange={(value) => setFormData({ ...formData, referrerId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
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
                <Label>Referred Client Name</Label>
                <Input
                  value={formData.referredClientName}
                  onChange={(e) => setFormData({ ...formData, referredClientName: e.target.value })}
                  placeholder="New client name"
                  required
                />
              </div>
              <Button type="submit" className="w-full">Track Referral</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Referrals
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{referrals.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Referrals List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Referrals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {referrals.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No referrals yet
              </p>
            ) : (
              referrals
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{referral.referredClientName || 'Pending'}</p>
                      <p className="text-sm text-muted-foreground">
                        Referred by {referral.referrerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(referral.date)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(referral.status)}>
                        {referral.status}
                      </Badge>
                      {referral.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              updateReferral(referral.id, {
                                status: 'converted',
                                value: 599,
                              });
                              toast.success('Referral marked as converted');
                            }}
                          >
                            Convert
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              updateReferral(referral.id, { status: 'declined' });
                              toast.info('Referral marked as declined');
                            }}
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
          </CardContent>
        </Card>

        {/* Top Referrers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Referrers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topReferrers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No referrers yet
              </p>
            ) : (
              topReferrers.map((client, index) => (
                <div
                  key={client.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-border"
                >
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 font-bold text-primary">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{client.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {client.referralCount} referrals • {formatCurrency(client.totalSpent)} spent
                    </p>
                  </div>
                  <Badge variant="secondary">{client.totalBookings} bookings</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
