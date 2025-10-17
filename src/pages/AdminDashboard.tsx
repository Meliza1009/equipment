import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Package, Calendar, IndianRupee, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { mockAnalytics } from '../utils/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { 
      title: 'Total Users', 
      value: mockAnalytics.totalUsers, 
      change: '+12%',
      trend: 'up',
      icon: Users, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    { 
      title: 'Total Equipment', 
      value: mockAnalytics.totalEquipment, 
      change: '+8%',
      trend: 'up',
      icon: Package, 
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    { 
      title: 'Active Bookings', 
      value: mockAnalytics.activeBookings, 
      change: '+18%',
      trend: 'up',
      icon: Calendar, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    { 
      title: 'Total Revenue', 
      value: `₹${mockAnalytics.totalRevenue.toLocaleString()}`, 
      change: '+24%',
      trend: 'up',
      icon: IndianRupee, 
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
  ];

  const COLORS = ['#16a34a', '#2563eb', '#9333ea', '#ea580c'];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of platform analytics and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    <TrendIcon className="h-4 w-4 mr-1" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-1">{stat.title}</p>
                <p className="text-gray-900">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button onClick={() => navigate('/admin/users')} variant="outline" className="h-auto py-6">
              <div className="flex flex-col items-center space-y-2">
                <Users className="h-6 w-6" />
                <span>Manage Users</span>
              </div>
            </Button>
            <Button onClick={() => navigate('/admin/equipment')} variant="outline" className="h-auto py-6">
              <div className="flex flex-col items-center space-y-2">
                <Package className="h-6 w-6" />
                <span>Manage Equipment</span>
              </div>
            </Button>
            <Button onClick={() => navigate('/admin/bookings')} variant="outline" className="h-auto py-6">
              <div className="flex flex-col items-center space-y-2">
                <Calendar className="h-6 w-6" />
                <span>View Bookings</span>
              </div>
            </Button>
            <Button onClick={() => navigate('/admin/analytics')} variant="outline" className="h-auto py-6">
              <div className="flex flex-col items-center space-y-2">
                <TrendingUp className="h-6 w-6" />
                <span>Analytics</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Revenue & Bookings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Bookings Trend</CardTitle>
          <CardDescription>Monthly revenue and booking statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockAnalytics.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#16a34a" name="Revenue (₹)" />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#2563eb" name="Bookings" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Equipment by Category</CardTitle>
            <CardDescription>Distribution of equipment across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockAnalytics.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.category} (${entry.percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {mockAnalytics.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Equipment */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Equipment</CardTitle>
            <CardDescription>Most booked equipment by revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockAnalytics.topEquipment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#16a34a" name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
