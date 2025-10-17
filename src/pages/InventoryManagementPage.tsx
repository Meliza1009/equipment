import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Power, Search, Filter, Package, TrendingUp, AlertCircle, MapPin, Camera } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';

interface Equipment {
  id: number;
  name: string;
  category: string;
  image: string;
  pricePerHour: number;
  pricePerDay: number;
  available: boolean;
  condition: 'excellent' | 'good' | 'fair' | 'needs_repair';
  totalBookings: number;
  revenue: number;
  location: string;
  description: string;
  specifications: string;
}

export const InventoryManagementPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);

  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: 1,
      name: 'Tractor - John Deere 5050D',
      category: 'Tractor',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      pricePerHour: 500,
      pricePerDay: 3500,
      available: true,
      condition: 'excellent',
      totalBookings: 45,
      revenue: 78500,
      location: 'Rampur Village',
      description: 'Powerful 50HP tractor suitable for all farming needs',
      specifications: '50 HP, 4WD, Diesel'
    },
    {
      id: 2,
      name: 'Harvester - New Holland',
      category: 'Harvester',
      image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400',
      pricePerHour: 800,
      pricePerDay: 5000,
      available: false,
      condition: 'good',
      totalBookings: 32,
      revenue: 105000,
      location: 'Rampur Village',
      description: 'High-efficiency harvester for large-scale farming',
      specifications: 'Self-propelled, 6 rows'
    },
    {
      id: 3,
      name: 'Water Pump - Kirloskar',
      category: 'Pump',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112c4e5190?w=400',
      pricePerHour: 150,
      pricePerDay: 800,
      available: true,
      condition: 'good',
      totalBookings: 67,
      revenue: 45200,
      location: 'Rampur Village',
      description: 'Reliable water pump for irrigation',
      specifications: '5 HP, 3-phase'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    pricePerHour: '',
    pricePerDay: '',
    location: '',
    description: '',
    specifications: '',
    condition: 'excellent'
  });

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'available' && item.available) ||
                         (filterStatus === 'unavailable' && !item.available);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalEquipment = equipment.length;
  const totalRevenue = equipment.reduce((sum, item) => sum + item.revenue, 0);
  const totalBookings = equipment.reduce((sum, item) => sum + item.totalBookings, 0);
  const availableCount = equipment.filter(item => item.available).length;

  const handleAddEquipment = () => {
    if (!formData.name || !formData.category || !formData.pricePerHour || !formData.pricePerDay) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newEquipment: Equipment = {
      id: equipment.length + 1,
      name: formData.name,
      category: formData.category,
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      pricePerHour: parseInt(formData.pricePerHour),
      pricePerDay: parseInt(formData.pricePerDay),
      available: true,
      condition: formData.condition as any,
      totalBookings: 0,
      revenue: 0,
      location: formData.location,
      description: formData.description,
      specifications: formData.specifications
    };

    setEquipment([...equipment, newEquipment]);
    toast.success('Equipment added successfully!');
    setShowAddDialog(false);
    resetForm();
  };

  const handleUpdateEquipment = () => {
    if (!editingEquipment) return;

    const updated = equipment.map(item =>
      item.id === editingEquipment.id
        ? {
            ...item,
            name: formData.name,
            category: formData.category,
            pricePerHour: parseInt(formData.pricePerHour),
            pricePerDay: parseInt(formData.pricePerDay),
            location: formData.location,
            description: formData.description,
            specifications: formData.specifications,
            condition: formData.condition as any
          }
        : item
    );

    setEquipment(updated);
    toast.success('Equipment updated successfully!');
    setEditingEquipment(null);
    resetForm();
  };

  const handleDeleteEquipment = (id: number) => {
    setEquipment(equipment.filter(item => item.id !== id));
    toast.success('Equipment deleted successfully');
  };

  const handleToggleAvailability = (id: number) => {
    const updated = equipment.map(item =>
      item.id === id ? { ...item, available: !item.available } : item
    );
    setEquipment(updated);
    const item = equipment.find(e => e.id === id);
    toast.success(`${item?.name} marked as ${item?.available ? 'unavailable' : 'available'}`);
  };

  const handleEditClick = (item: Equipment) => {
    setEditingEquipment(item);
    setFormData({
      name: item.name,
      category: item.category,
      pricePerHour: item.pricePerHour.toString(),
      pricePerDay: item.pricePerDay.toString(),
      location: item.location,
      description: item.description,
      specifications: item.specifications,
      condition: item.condition
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      pricePerHour: '',
      pricePerDay: '',
      location: '',
      description: '',
      specifications: '',
      condition: 'excellent'
    });
  };

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return <Badge className="bg-green-600">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-600">Good</Badge>;
      case 'fair':
        return <Badge className="bg-yellow-600">Fair</Badge>;
      case 'needs_repair':
        return <Badge className="bg-red-600">Needs Repair</Badge>;
      default:
        return <Badge variant="outline">{condition}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-gray-900 mb-2">Equipment Inventory</h1>
            <p className="text-gray-600">Manage your equipment catalog and pricing</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Equipment</p>
                  <p className="text-3xl text-gray-900 mt-1">{totalEquipment}</p>
                </div>
                <Package className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-3xl text-green-600 mt-1">{availableCount}</p>
                </div>
                <Power className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-3xl text-gray-900 mt-1">{totalBookings}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-3xl text-gray-900 mt-1">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search equipment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Tractor">Tractors</SelectItem>
                  <SelectItem value="Harvester">Harvesters</SelectItem>
                  <SelectItem value="Pump">Pumps</SelectItem>
                  <SelectItem value="Cultivator">Cultivators</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Equipment Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEquipment.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.location}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="text-gray-900">₹{item.pricePerHour}/hr</p>
                          <p className="text-gray-600">₹{item.pricePerDay}/day</p>
                        </div>
                      </TableCell>
                      <TableCell>{getConditionBadge(item.condition)}</TableCell>
                      <TableCell className="text-gray-900">{item.totalBookings}</TableCell>
                      <TableCell className="text-gray-900">₹{item.revenue.toLocaleString()}</TableCell>
                      <TableCell>
                        <Switch
                          checked={item.available}
                          onCheckedChange={() => handleToggleAvailability(item.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditClick(item)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteEquipment(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Dialog */}
        <Dialog open={showAddDialog || !!editingEquipment} onOpenChange={(open) => {
          if (!open) {
            setShowAddDialog(false);
            setEditingEquipment(null);
            resetForm();
          }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEquipment ? 'Edit Equipment' : 'Add New Equipment'}</DialogTitle>
              <DialogDescription>
                {editingEquipment ? 'Update equipment details' : 'Add equipment to your inventory'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Equipment Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Tractor - John Deere 5050D"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tractor">Tractor</SelectItem>
                      <SelectItem value="Harvester">Harvester</SelectItem>
                      <SelectItem value="Pump">Pump</SelectItem>
                      <SelectItem value="Cultivator">Cultivator</SelectItem>
                      <SelectItem value="Plough">Plough</SelectItem>
                      <SelectItem value="Sprayer">Sprayer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">Condition *</Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="needs_repair">Needs Repair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pricePerHour">Price per Hour (₹) *</Label>
                  <Input
                    id="pricePerHour"
                    type="number"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                    placeholder="500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePerDay">Price per Day (₹) *</Label>
                  <Input
                    id="pricePerDay"
                    type="number"
                    value={formData.pricePerDay}
                    onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                    placeholder="3500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Rampur Village"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the equipment..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specifications">Technical Specifications</Label>
                <Input
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  placeholder="e.g., 50 HP, 4WD, Diesel"
                />
              </div>

              <div className="space-y-2">
                <Label>Equipment Photos</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload equipment photos</p>
                  <Input type="file" multiple accept="image/*" className="max-w-xs mx-auto" />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setEditingEquipment(null);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={editingEquipment ? handleUpdateEquipment : handleAddEquipment}>
                {editingEquipment ? 'Update' : 'Add'} Equipment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
