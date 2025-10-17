import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, QrCode, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { useAuth } from '../context/AuthContext';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { toast } from 'sonner';
import { equipmentService } from '../services/equipmentService';

export const OperatorEquipmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch operator's equipment from backend
  useEffect(() => {
    const fetchEquipment = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const data = await equipmentService.getEquipmentByOperator(user.id);
        setEquipment(data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
        toast.error('Failed to load equipment');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [user?.id]);

  const filteredEquipment = equipment.filter(equip =>
    equip.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equip.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this equipment?')) {
      try {
        await equipmentService.deleteEquipment(id);
        setEquipment(equipment.filter(e => e.id !== id));
        toast.success('Equipment deleted successfully');
      } catch (error) {
        toast.error('Failed to delete equipment');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">My Equipment</h1>
          <p className="text-gray-600">Manage your equipment inventory</p>
        </div>
        <Button onClick={() => navigate('/operator/equipment/add')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Equipment List</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-400" />
              <p className="text-gray-600 mt-4">Loading equipment...</p>
            </div>
          ) : filteredEquipment.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price/Hour</TableHead>
                  <TableHead>Price/Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipment.map((equipment) => (
                  <TableRow key={equipment.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={equipment.imageUrl || equipment.image}
                          alt={equipment.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <div className="text-gray-900">{equipment.name}</div>
                          <div className="text-sm text-gray-500">
                            {equipment.location?.address || equipment.location}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{equipment.category}</TableCell>
                    <TableCell>₹{equipment.pricePerHour || 'N/A'}</TableCell>
                    <TableCell>₹{equipment.pricePerDay}</TableCell>
                    <TableCell>
                      <Badge className={equipment.available ? 'bg-green-600' : 'bg-red-600'}>
                        {equipment.available ? 'Available' : 'Booked'}
                      </Badge>
                    </TableCell>
                    <TableCell>{equipment.totalBookings || 0}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/equipment/${equipment.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedEquipment(equipment)}
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/operator/equipment/edit/${equipment.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(equipment.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No equipment found matching your search' : 'No equipment listed yet'}
              </p>
              <Button onClick={() => navigate('/operator/equipment/add')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Equipment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR Code Modal */}
      {selectedEquipment && (
        <QRCodeDisplay
          qrData={selectedEquipment.qrCode || `EQ-${selectedEquipment.id}`}
          title="Equipment QR Code"
          description={`QR Code for ${selectedEquipment.name}`}
          equipmentName={selectedEquipment.name}
          available={selectedEquipment.available}
          onClose={() => setSelectedEquipment(null)}
        />
      )}
    </div>
  );
};
