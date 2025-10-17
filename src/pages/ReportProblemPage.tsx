import React, { useState } from 'react';
import { AlertTriangle, Camera, FileText, Send, CheckCircle, Clock, XCircle, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner@2.0.3';

interface Report {
  id: number;
  reportId: string;
  type: string;
  category: string;
  subject: string;
  description: string;
  status: 'submitted' | 'in_review' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedDate: string;
  resolvedDate?: string;
  response?: string;
}

export const ReportProblemPage: React.FC = () => {
  const [reportType, setReportType] = useState('equipment');
  const [category, setCategory] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [attachments, setAttachments] = useState<File[]>([]);

  const previousReports: Report[] = [
    {
      id: 1,
      reportId: 'RPT10045',
      type: 'Equipment Issue',
      category: 'Malfunction',
      subject: 'Tractor hydraulic system not working',
      description: 'The hydraulic system stopped working during operation.',
      status: 'resolved',
      priority: 'high',
      submittedDate: '2025-10-10',
      resolvedDate: '2025-10-12',
      response: 'Issue resolved. Hydraulic fluid was low and has been refilled.'
    },
    {
      id: 2,
      reportId: 'RPT10032',
      type: 'Booking Issue',
      category: 'Cancellation',
      subject: 'Unable to cancel booking',
      description: 'Cancel button not working on booking page.',
      status: 'in_review',
      priority: 'medium',
      submittedDate: '2025-10-14'
    },
    {
      id: 3,
      reportId: 'RPT10018',
      type: 'Payment Issue',
      category: 'Refund',
      subject: 'Refund not received',
      description: 'Cancelled booking but refund not credited yet.',
      status: 'submitted',
      priority: 'high',
      submittedDate: '2025-10-15'
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reportType || !category || !subject.trim() || !description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Report submitted successfully! We will review it shortly.');
    
    // Reset form
    setReportType('equipment');
    setCategory('');
    setBookingId('');
    setSubject('');
    setDescription('');
    setPriority('medium');
    setAttachments([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-blue-600">Submitted</Badge>;
      case 'in_review':
        return <Badge className="bg-yellow-600">In Review</Badge>;
      case 'resolved':
        return <Badge className="bg-green-600">Resolved</Badge>;
      case 'closed':
        return <Badge className="bg-gray-600">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-600">High</Badge>;
      case 'medium':
        return <Badge className="bg-blue-600">Medium</Badge>;
      case 'low':
        return <Badge className="bg-gray-600">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getCategoryOptions = () => {
    switch (reportType) {
      case 'equipment':
        return [
          { value: 'malfunction', label: 'Equipment Malfunction' },
          { value: 'damage', label: 'Damaged Equipment' },
          { value: 'missing_parts', label: 'Missing Parts' },
          { value: 'poor_condition', label: 'Poor Condition' },
          { value: 'not_as_described', label: 'Not As Described' }
        ];
      case 'booking':
        return [
          { value: 'cancellation', label: 'Cancellation Issue' },
          { value: 'modification', label: 'Modification Issue' },
          { value: 'no_show', label: 'Operator No-Show' },
          { value: 'wrong_equipment', label: 'Wrong Equipment' },
          { value: 'timing', label: 'Timing Issue' }
        ];
      case 'payment':
        return [
          { value: 'payment_failed', label: 'Payment Failed' },
          { value: 'refund', label: 'Refund Issue' },
          { value: 'overcharge', label: 'Overcharged' },
          { value: 'receipt', label: 'Receipt Issue' },
          { value: 'deposit', label: 'Security Deposit Issue' }
        ];
      case 'operator':
        return [
          { value: 'unprofessional', label: 'Unprofessional Behavior' },
          { value: 'no_response', label: 'Not Responding' },
          { value: 'late_delivery', label: 'Late Delivery' },
          { value: 'poor_service', label: 'Poor Service' },
          { value: 'fraud', label: 'Suspected Fraud' }
        ];
      case 'app':
        return [
          { value: 'bug', label: 'App Bug' },
          { value: 'crash', label: 'App Crash' },
          { value: 'slow', label: 'Slow Performance' },
          { value: 'feature_request', label: 'Feature Request' },
          { value: 'other', label: 'Other Technical Issue' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Report a Problem</h1>
          <p className="text-gray-600">
            Having an issue? Let us know and we'll help resolve it quickly
          </p>
        </div>

        <Tabs defaultValue="submit" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="submit">
              <FileText className="h-4 w-4 mr-2" />
              Submit Report
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="h-4 w-4 mr-2" />
              My Reports ({previousReports.length})
            </TabsTrigger>
          </TabsList>

          {/* Submit Report Tab */}
          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle>Submit a New Report</CardTitle>
                <CardDescription>
                  Provide detailed information to help us resolve your issue faster
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Report Type */}
                  <div className="space-y-3">
                    <Label>What is your issue related to? *</Label>
                    <RadioGroup value={reportType} onValueChange={setReportType}>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="equipment" id="equipment" />
                          <Label htmlFor="equipment" className="cursor-pointer flex-1">
                            Equipment Issue
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="booking" id="booking" />
                          <Label htmlFor="booking" className="cursor-pointer flex-1">
                            Booking Issue
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="payment" id="payment" />
                          <Label htmlFor="payment" className="cursor-pointer flex-1">
                            Payment Issue
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="operator" id="operator" />
                          <Label htmlFor="operator" className="cursor-pointer flex-1">
                            Operator Issue
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="app" id="app" />
                          <Label htmlFor="app" className="cursor-pointer flex-1">
                            App/Technical
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                          <RadioGroupItem value="other" id="other" />
                          <Label htmlFor="other" className="cursor-pointer flex-1">
                            Other
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <Separator />

                  {/* Category */}
                  <div className="space-y-2">
                    <Label htmlFor="category">Issue Category *</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {getCategoryOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Booking ID (Optional) */}
                  {(reportType === 'equipment' || reportType === 'booking' || reportType === 'payment') && (
                    <div className="space-y-2">
                      <Label htmlFor="booking-id">Related Booking ID (Optional)</Label>
                      <Input
                        id="booking-id"
                        placeholder="e.g., BK10245"
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        If this issue is related to a specific booking, please provide the booking ID
                      </p>
                    </div>
                  )}

                  {/* Priority */}
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Can wait</SelectItem>
                        <SelectItem value="medium">Medium - Soon as possible</SelectItem>
                        <SelectItem value="high">High - Need attention</SelectItem>
                        <SelectItem value="urgent">Urgent - Critical issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="Brief description of the issue"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description *</Label>
                    <Textarea
                      id="description"
                      rows={6}
                      placeholder="Please provide as much detail as possible about the issue..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Include: What happened? When did it occur? What were you trying to do?
                    </p>
                  </div>

                  {/* Attachments */}
                  <div className="space-y-2">
                    <Label htmlFor="attachments">Attachments (Optional)</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Upload photos or documents
                      </p>
                      <Input
                        id="attachments"
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="max-w-xs mx-auto"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Max 5 files, 10MB each (Images, PDF, DOC)
                      </p>
                    </div>
                    {attachments.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Selected files:</p>
                        <ul className="text-sm text-gray-900 mt-1">
                          {attachments.map((file, index) => (
                            <li key={index}>• {file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Contact Info Notice */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Note:</strong> We'll contact you via your registered email and phone number to resolve this issue.
                      Expected response time: 24-48 hours for standard issues, 4-6 hours for urgent issues.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" size="lg" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Report
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report History Tab */}
          <TabsContent value="history" className="space-y-4">
            {previousReports.length > 0 ? (
              previousReports.map((report) => (
                <Card key={report.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{report.subject}</CardTitle>
                        <CardDescription>
                          Report ID: {report.reportId} • {report.type}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(report.status)}
                        {getPriorityBadge(report.priority)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Description:</p>
                      <p className="text-sm text-gray-900">{report.description}</p>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Category</p>
                        <p className="text-gray-900">{report.category}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Submitted</p>
                        <p className="text-gray-900">{new Date(report.submittedDate).toLocaleDateString()}</p>
                      </div>
                      {report.resolvedDate && (
                        <div>
                          <p className="text-gray-600">Resolved</p>
                          <p className="text-gray-900">{new Date(report.resolvedDate).toLocaleDateString()}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-600">Priority</p>
                        <p className="text-gray-900 capitalize">{report.priority}</p>
                      </div>
                    </div>

                    {report.response && (
                      <>
                        <Separator />
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm text-green-900 mb-1">
                                <strong>Admin Response:</strong>
                              </p>
                              <p className="text-sm text-gray-700">{report.response}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {report.status === 'in_review' && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Add Comment
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No previous reports</p>
                  <p className="text-sm text-gray-500">Your submitted reports will appear here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
