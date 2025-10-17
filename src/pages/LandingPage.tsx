import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Tractor, Clock, Shield, IndianRupee } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const userTypes = [
    {
      icon: Shield,
      title: 'Admin',
      description: 'Manage the entire platform, users, equipment, and oversee all operations',
      features: ['User Management', 'Equipment Approval', 'System Analytics', 'Data Seeding'],
      color: 'red',
    },
    {
      icon: Tractor,
      title: 'Operator',
      description: 'List and manage your agricultural equipment for rent to farmers',
      features: ['Add Equipment', 'Manage Bookings', 'Track Earnings', 'Equipment Analytics'],
      color: 'blue',
    },
    {
      icon: IndianRupee,
      title: 'User',
      description: 'Browse and rent agricultural equipment from verified operators',
      features: ['Browse Equipment', 'Book Equipment', 'View on Map', 'Track Rentals'],
      color: 'green',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-green-100 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-green-900 mb-6">
                Village Equipment Sharing Platform
              </h1>
              <p className="text-gray-700 mb-4">
                A comprehensive platform connecting farmers, equipment operators, and administrators 
                in agricultural equipment sharing.
              </p>
              <p className="text-gray-600 mb-6">
                Sign in based on your role to access personalized features
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Choose your role: User • Operator • Admin
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://www.deere.co.in/assets/images/region-1/products/tractors/d-series-tractors/john-deere-india-d-series-tractors.jpg"
                alt="John Deere Tractor - Farming Equipment"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23e5e7eb" width="400" height="400"/%3E%3Ctext fill="%236b7280" font-family="Arial" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3ETractor Image%3C/text%3E%3C/svg%3E';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Role</h2>
            <p className="text-xl text-gray-600">
              Sign in based on your role to access tailored features
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {userTypes.map((type, index) => {
              const Icon = type.icon;
              const borderColor = type.color === 'red' ? 'border-red-200' : type.color === 'blue' ? 'border-blue-200' : 'border-green-200';
              const bgColor = type.color === 'red' ? 'bg-red-100' : type.color === 'blue' ? 'bg-blue-100' : 'bg-green-100';
              const textColor = type.color === 'red' ? 'text-red-600' : type.color === 'blue' ? 'text-blue-600' : 'text-green-600';
              const hoverBorder = type.color === 'red' ? 'hover:border-red-400' : type.color === 'blue' ? 'hover:border-blue-400' : 'hover:border-green-400';
              
              return (
                <Card key={index} className={`border-2 ${borderColor} ${hoverBorder} transition-all hover:shadow-xl`}>
                  <CardHeader>
                    <div className={`w-16 h-16 ${bgColor} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                      <Icon className={`h-8 w-8 ${textColor}`} />
                    </div>
                    <CardTitle className="text-center text-2xl">{type.title}</CardTitle>
                    <CardDescription className="text-center">{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="font-semibold text-sm text-gray-700">Key Features:</p>
                      <ul className="space-y-2">
                        {type.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <ArrowRight className={`h-4 w-4 mr-2 ${textColor}`} />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full"
                      variant={type.color === 'green' ? 'default' : 'outline'}
                      onClick={() => navigate('/login')}
                    >
                      Sign In as {type.title}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}      

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose Your Role</h3>
              <p className="text-gray-600">
                Select whether you're a User (renting equipment), Operator (providing equipment), or Admin (managing platform)
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sign In</h3>
              <p className="text-gray-600">
                Login or create an account for your specific role to access tailored features and dashboard
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Start Using</h3>
              <p className="text-gray-600">
                Access your personalized dashboard and start browsing, managing, or administrating the platform
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join our platform as a User, Operator, or Admin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate('/register')}
            >
              Create Account
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white hover:text-green-600"
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </div>
          <p className="text-sm mt-6 opacity-90">
            Select your role during registration or sign-in
          </p>
        </div>
      </section>
    </div>
  );
};
