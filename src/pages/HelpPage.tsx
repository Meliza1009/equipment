import React, { useState } from 'react';
import { Search, HelpCircle, Book, MessageCircle, Phone, Mail, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner@2.0.3';

export const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Your message has been sent! We\'ll get back to you soon.');
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: Book,
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click on the "Register" button in the top right corner. Fill in your details including name, email, phone number, and create a password. You\'ll receive a verification email to activate your account.'
        },
        {
          question: 'What are the different user roles?',
          answer: 'There are three roles: Users (can browse and book equipment), Operators (can list and manage equipment), and Admins (have full system access). You can select your role during registration.'
        },
        {
          question: 'Is there a mobile app available?',
          answer: 'Currently, we offer a mobile-responsive website that works great on all devices. A dedicated mobile app is coming soon!'
        }
      ]
    },
    {
      title: 'Booking Equipment',
      icon: HelpCircle,
      faqs: [
        {
          question: 'How do I book equipment?',
          answer: 'Browse the equipment catalog, select an item you want, choose your booking dates and time, review the cost, and proceed to payment. You\'ll receive a confirmation once the operator approves.'
        },
        {
          question: 'Can I cancel my booking?',
          answer: 'Yes, you can cancel up to 24 hours before the booking starts for a full refund. Cancellations made less than 24 hours before incur a 25% cancellation fee.'
        },
        {
          question: 'What happens if equipment is damaged?',
          answer: 'All rentals include basic insurance. Report any damage immediately. Normal wear and tear is covered, but negligence or misuse may result in charges.'
        },
        {
          question: 'How do I check equipment availability?',
          answer: 'Click on any equipment to view its availability calendar. Green dates are available, red dates are booked, and yellow dates have partial availability.'
        }
      ]
    },
    {
      title: 'Payments',
      icon: MessageCircle,
      faqs: [
        {
          question: 'What payment methods are accepted?',
          answer: 'We accept UPI, credit/debit cards, net banking, and wallets through Razorpay. All transactions are secure and encrypted.'
        },
        {
          question: 'When do I need to pay?',
          answer: 'Payment is required at the time of booking. For bookings over ₹10,000, you can pay 50% advance and the rest before equipment pickup.'
        },
        {
          question: 'How do refunds work?',
          answer: 'Refunds are processed within 5-7 business days to your original payment method. Cancellation charges (if any) will be deducted.'
        },
        {
          question: 'Are there any hidden charges?',
          answer: 'No hidden charges! The price you see includes equipment rental, insurance, and service fee. Only late return fees or damage charges may apply if applicable.'
        }
      ]
    },
    {
      title: 'For Operators',
      icon: Phone,
      faqs: [
        {
          question: 'How do I list my equipment?',
          answer: 'Register as an Operator, go to your dashboard, click "Add Equipment", fill in details, upload photos, set pricing, and submit for admin approval.'
        },
        {
          question: 'How do I receive payments?',
          answer: 'Payments are transferred to your registered bank account within 3-5 business days after booking completion and customer confirmation.'
        },
        {
          question: 'Can I set my own prices?',
          answer: 'Yes, you have full control over pricing. We recommend checking market rates for similar equipment in your area for competitive pricing.'
        },
        {
          question: 'What if a customer doesn\'t return equipment on time?',
          answer: 'Late fees are automatically calculated and added to the customer\'s bill. Contact support if you need assistance recovering equipment.'
        }
      ]
    }
  ];

  const quickLinks = [
    { title: 'User Guide', description: 'Complete guide to using the platform', icon: Book },
    { title: 'Video Tutorials', description: 'Watch step-by-step tutorials', icon: ExternalLink },
    { title: 'Community Forum', description: 'Connect with other users', icon: MessageCircle },
    { title: 'API Documentation', description: 'For developers', icon: Book }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-gray-900 mb-4">How can we help you?</h1>
          <p className="text-gray-600 mb-8">
            Search our knowledge base or contact support for assistance
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {quickLinks.map((link, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <link.icon className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <h3 className="text-gray-900 mb-1">{link.title}</h3>
                <p className="text-sm text-gray-600">{link.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="faq">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQs
            </TabsTrigger>
            <TabsTrigger value="contact">
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-8">
            {faqCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <category.icon className="h-6 w-6 text-green-600" />
                    <CardTitle>{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`item-${index}-${faqIndex}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}

            {/* Still Need Help */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-8 text-center">
                <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">Still need help?</h3>
                <p className="text-gray-600 mb-6">
                  Can't find the answer you're looking for? Our support team is here to help!
                </p>
                <Button size="lg" onClick={() => document.getElementById('contact-tab')?.click()}>
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" id="contact-tab" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6 text-center">
                  <Phone className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="text-gray-900 mb-2">Phone Support</h3>
                  <p className="text-sm text-gray-600 mb-3">Mon-Sat, 9 AM - 6 PM</p>
                  <p className="text-green-600">+91 1800-123-4567</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Mail className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="text-gray-900 mb-2">Email Support</h3>
                  <p className="text-sm text-gray-600 mb-3">Response within 24 hours</p>
                  <p className="text-green-600">support@villagerent.com</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="text-gray-900 mb-2">Live Chat</h3>
                  <p className="text-sm text-gray-600 mb-3">Available now</p>
                  <Button variant="outline" className="w-full">Start Chat</Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitContact} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      rows={6}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Support Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <Badge variant="outline">9:00 AM - 6:00 PM</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <Badge variant="outline">10:00 AM - 4:00 PM</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <Badge variant="secondary">Closed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
