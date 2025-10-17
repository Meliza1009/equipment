import React, { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, Filter, Search, Calendar, CreditCard, AlertCircle, Package, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner@2.0.3';

interface Notification {
  id: number;
  type: 'booking' | 'payment' | 'equipment' | 'message' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: any;
  color: string;
}

export const NotificationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your booking for Tractor - John Deere 5050D has been confirmed for Oct 12, 2025',
      time: '2 hours ago',
      read: false,
      icon: Calendar,
      color: 'text-green-600 bg-green-50'
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Due',
      message: 'Payment of ₹1,500 is due for your upcoming booking on Oct 12',
      time: '5 hours ago',
      read: false,
      icon: CreditCard,
      color: 'text-yellow-600 bg-yellow-50'
    },
    {
      id: 3,
      type: 'equipment',
      title: 'New Equipment Available',
      message: 'New Harvester - New Holland is now available in your area',
      time: '1 day ago',
      read: true,
      icon: Package,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      id: 4,
      type: 'message',
      title: 'New Message from Operator',
      message: 'Ramesh Kumar sent you a message about your booking',
      time: '1 day ago',
      read: true,
      icon: MessageSquare,
      color: 'text-purple-600 bg-purple-50'
    },
    {
      id: 5,
      type: 'booking',
      title: 'Booking Completed',
      message: 'Your booking for Harvester has been completed. Please rate your experience.',
      time: '2 days ago',
      read: true,
      icon: Check,
      color: 'text-green-600 bg-green-50'
    },
    {
      id: 6,
      type: 'system',
      title: 'Maintenance Notice',
      message: 'Scheduled system maintenance on Oct 15, 2025 from 2 AM to 4 AM',
      time: '3 days ago',
      read: true,
      icon: AlertCircle,
      color: 'text-orange-600 bg-orange-50'
    },
    {
      id: 7,
      type: 'payment',
      title: 'Payment Successful',
      message: 'Your payment of ₹2,000 has been processed successfully',
      time: '4 days ago',
      read: true,
      icon: Check,
      color: 'text-green-600 bg-green-50'
    },
    {
      id: 8,
      type: 'booking',
      title: 'Booking Reminder',
      message: 'Your booking for Tractor starts tomorrow at 9:00 AM',
      time: '5 days ago',
      read: true,
      icon: Calendar,
      color: 'text-blue-600 bg-blue-50'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.read) ||
                         (filter === 'read' && notification.read) ||
                         notification.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    toast.success('Marked as read');
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success('Notification deleted');
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            </div>
            {notifications.length > 0 && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
                <Button variant="outline" onClick={handleClearAll}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Notifications</SelectItem>
                <SelectItem value="unread">Unread Only</SelectItem>
                <SelectItem value="read">Read Only</SelectItem>
                <SelectItem value="booking">Bookings</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="message">Messages</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadCount})
            </TabsTrigger>
            <TabsTrigger value="booking">
              Bookings
            </TabsTrigger>
            <TabsTrigger value="payment">
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </TabsContent>

          <TabsContent value="unread" className="space-y-3">
            {filteredNotifications.filter(n => !n.read).length > 0 ? (
              filteredNotifications.filter(n => !n.read).map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <EmptyState message="No unread notifications" />
            )}
          </TabsContent>

          <TabsContent value="booking" className="space-y-3">
            {filteredNotifications.filter(n => n.type === 'booking').length > 0 ? (
              filteredNotifications.filter(n => n.type === 'booking').map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <EmptyState message="No booking notifications" />
            )}
          </TabsContent>

          <TabsContent value="payment" className="space-y-3">
            {filteredNotifications.filter(n => n.type === 'payment').length > 0 ? (
              filteredNotifications.filter(n => n.type === 'payment').map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <EmptyState message="No payment notifications" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  onDelete: (id: number) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onMarkAsRead, onDelete }) => {
  const Icon = notification.icon;
  
  return (
    <Card className={`transition-all ${!notification.read ? 'border-blue-200 bg-blue-50/50' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-full ${notification.color} flex-shrink-0`}>
            <Icon className="h-5 w-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="text-gray-900 pr-2">{notification.title}</h3>
              {!notification.read && (
                <Badge variant="default" className="bg-blue-600 flex-shrink-0">New</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
            <p className="text-xs text-gray-500">{notification.time}</p>
          </div>

          <div className="flex gap-1 flex-shrink-0">
            {!notification.read && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onMarkAsRead(notification.id)}
                title="Mark as read"
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(notification.id)}
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyState: React.FC<{ message?: string }> = ({ message = 'No notifications' }) => {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center">
          <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">{message}</p>
          <p className="text-sm text-gray-500">You're all caught up!</p>
        </div>
      </CardContent>
    </Card>
  );
};
