import React, { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockBookings } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export const FeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState('');
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  const completedBookings = mockBookings.filter(
    b => b.userId === user?.id && b.status === 'completed'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBooking) {
      toast.error('Please select a booking');
      return;
    }

    if (rating === 0) {
      toast.error('Please provide a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a comment');
      return;
    }

    // Submit feedback (mock)
    toast.success('Thank you for your feedback!');
    
    // Reset form
    setSelectedBooking('');
    setRating(0);
    setComment('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Share Your Feedback</h1>
          <p className="text-gray-600">Help us improve by sharing your experience</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Rate Your Experience</CardTitle>
            <CardDescription>
              Select a completed booking and rate your experience with the equipment and operator
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Select Booking</Label>
                <Select value={selectedBooking} onValueChange={setSelectedBooking}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a booking to review" />
                  </SelectTrigger>
                  <SelectContent>
                    {completedBookings.map((booking) => (
                      <SelectItem key={booking.id} value={booking.id.toString()}>
                        {booking.equipmentName} - {booking.startDate}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-10 w-10 ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-gray-600">
                    {rating === 1 && 'Poor'}
                    {rating === 2 && 'Fair'}
                    {rating === 3 && 'Good'}
                    {rating === 4 && 'Very Good'}
                    {rating === 5 && 'Excellent'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Your Feedback</Label>
                <Textarea
                  placeholder="Share your experience with the equipment and operator..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={6}
                />
              </div>

              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Submit Feedback
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Reviews */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock recent review */}
              <div className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-gray-900">Water Pump - Kirloskar 5HP</div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600">
                  Great equipment and very helpful operator. The pump worked perfectly for our irrigation needs.
                </p>
                <div className="text-gray-500 mt-2">October 5, 2025</div>
              </div>
              
              {completedBookings.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No reviews yet. Complete a booking to leave feedback!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
