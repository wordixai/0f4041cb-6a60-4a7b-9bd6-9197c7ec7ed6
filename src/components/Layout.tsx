import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Camera, Users, Calendar, Package, Image, TrendingUp, Bell } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useStore } from '../store/useStore';

const navigation = [
  { name: 'Dashboard', href: '/', icon: TrendingUp },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Bookings', href: '/bookings', icon: Calendar },
  { name: 'Galleries', href: '/galleries', icon: Image },
  { name: 'Packages', href: '/packages', icon: Package },
  { name: 'Referrals', href: '/referrals', icon: TrendingUp },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const bookings = useStore((state) => state.bookings);

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'scheduled' && new Date(b.date) > new Date()
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
          <Camera className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold">PhotoCRM</span>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className={cn('transition-all duration-300', sidebarOpen ? 'pl-64' : 'pl-0')}>
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-16 items-center gap-4 px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
            <div className="flex-1" />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {upcomingBookings > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {upcomingBookings}
                </Badge>
              )}
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
