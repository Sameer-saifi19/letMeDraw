'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Palette, 
  Users, 
  Download, 
  Zap, 
  Star, 
  ArrowRight, 
  Menu, 
  X,
  Play,
  Check
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HomeLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <Palette className="w-8 h-8 text-blue-500" />,
      title: "Intuitive Drawing",
      description: "Create beautiful diagrams and sketches with our easy-to-use drawing tools."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-500" />,
      title: "Real-time Collaboration",
      description: "Work together with your team in real-time, no matter where you are."
    },
    {
      icon: <Download className="w-8 h-8 text-green-500" />,
      title: "Export Anywhere",
      description: "Export your creations as PNG, SVG, or share them with a simple link."
    },
    {
      icon: <Zap className="w-8 h-8 text-orange-500" />,
      title: "Lightning Fast",
      description: "Built for speed with smooth performance on all devices."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Designer",
      content: "This tool has revolutionized how our team collaborates on design concepts.",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Mike Rodriguez",
      role: "Engineering Manager",
      content: "The best diagramming tool I've used. Simple, powerful, and incredibly fast.",
      avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Elena Vasquez",
      role: "UX Researcher",
      content: "Perfect for quick wireframes and collaborative brainstorming sessions.",
      avatar: "https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50'
    }`}>
      {/* Navigation */}
      <nav className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-gray-900/80 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>DrawSpace</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`transition-colors ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Features</a>
              <a href="#testimonials" className={`transition-colors ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Testimonials</a>
              <a href="#pricing" className={`transition-colors ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Pricing</a>
              <Button 
                variant="outline" 
                onClick={() => setIsDark(!isDark)}
                className={`mr-2 transition-colors ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {isDark ? '☀️' : '🌙'}
              </Button>
              <Button onClick={() =>{
                router.push('/signin')
              }} variant="outline" className={`mr-2 transition-colors ${
                isDark 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}>Sign In</Button>
              <Button onClick={() =>[
                router.push('/signup')
              ]} className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                Start Drawing
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              <a href="#features" className={`block px-3 py-2 transition-colors ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Features</a>
              <a href="#testimonials" className={`block px-3 py-2 transition-colors ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Testimonials</a>
              <a href="#pricing" className={`block px-3 py-2 transition-colors ${
                isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Pricing</a>
              <div className="flex flex-col space-y-2 px-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDark(!isDark)}
                  className={`w-full transition-colors ${
                    isDark 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
                </Button>
                <Button variant="outline" className={`w-full transition-colors ${
                  isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>Sign In</Button>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500">
                  Start Drawing
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Draw, Create, and
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {' '}Collaborate
                </span>
              </h1>
              <p className={`text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                The ultimate drawing and diagramming tool for teams. Create beautiful sketches, 
                diagrams, and wireframes with the simplicity of pen and paper.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg px-8 py-4">
                  Start Drawing Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
            </div>

            {/* Hero Image/Mockup */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative max-w-5xl mx-auto">
                <div className={`rounded-2xl shadow-2xl border overflow-hidden transition-colors duration-300 ${
                  isDark 
                    ? 'bg-gray-800 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className={`px-4 py-3 border-b flex items-center space-x-2 transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                  <div className={`aspect-video flex items-center justify-center transition-colors duration-300 ${
                    isDark 
                      ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30' 
                      : 'bg-gradient-to-br from-blue-50 to-purple-50'
                  }`}>
                    <div className="text-center space-y-4">
                      <Palette className="w-16 h-16 text-blue-500 mx-auto" />
                      <h3 className={`text-2xl font-semibold transition-colors duration-300 ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}>Your Canvas Awaits</h3>
                      <p className={`transition-colors duration-300 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>Start creating amazing diagrams and sketches</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-5xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Everything You Need to Create
            </h2>
            <p className={`text-lg max-w-2xl mx-auto transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Powerful features designed to make your creative process smooth and collaborative.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md ${
                isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white'
              }`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 ${
                    isDark 
                      ? 'bg-gradient-to-br from-blue-900/50 to-purple-900/50' 
                      : 'bg-gradient-to-br from-blue-50 to-purple-50'
                  }`}>
                    {feature.icon}
                  </div>
                  <h3 className={`text-xl font-semibold mb-3 transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{feature.title}</h3>
                  <p className={`leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`}>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">10M+</div>
              <div className="text-blue-100 text-lg">Drawings Created</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">500K+</div>
              <div className="text-blue-100 text-lg">Active Users</div>
            </div>
            <div className="text-white">
              <div className="text-4xl md:text-5xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100 text-lg">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`py-20 transition-colors duration-300 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-5xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Loved by Creators Worldwide
            </h2>
            <p className={`text-lg transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              See what our community has to say about DrawSpace.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className={`border-0 shadow-md hover:shadow-lg transition-all duration-300 ${
                isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white'
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className={`mb-6 leading-relaxed transition-colors duration-300 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {testimonial.content}
                  </blockquote>
                  <div className="flex items-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className={`font-semibold transition-colors duration-300 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{testimonial.name}</div>
                      <div className={`text-sm transition-colors duration-300 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className={`py-20 transition-colors duration-300 ${
        isDark ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-5xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Simple, Transparent Pricing
            </h2>
            <p className={`text-lg transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Choose the plan that works best for you and your team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className={`border-2 hover:shadow-lg transition-all duration-300 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                : 'bg-white border-gray-200'
            }`}>
              <CardContent className="p-8 text-center">
                <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Free</h3>
                <div className={`text-4xl font-bold mb-6 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  $0<span className={`text-lg font-normal transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className={`transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Up to 3 drawings</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className={`transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Basic export options</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className={`transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Community support</span>
                  </li>
                </ul>
                <Button variant="outline" className={`w-full transition-colors ${
                  isDark 
                    ? 'border-gray-500 text-gray-300 hover:bg-gray-600 hover:text-white' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>Get Started</Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className={`border-2 border-blue-500 hover:shadow-lg transition-all duration-300 relative ${
              isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white'
            }`}>
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
              <CardContent className="p-8 text-center">
                <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Pro</h3>
                <div className={`text-4xl font-bold mb-6 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  $12<span className={`text-lg font-normal transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className={`transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Unlimited drawings</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className={`transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Real-time collaboration</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className={`transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Advanced export options</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className={`transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Priority support</span>
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500">
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            {/* Team Plan */}
            <Card className={`border-2 hover:shadow-lg transition-all duration-300 ${
              isDark 
                ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                : 'bg-white border-gray-200'
            }`}>
              <CardContent className="p-8 text-center">
                <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Team</h3>
                <div className={`text-4xl font-bold mb-6 transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  $24<span className={`text-lg font-normal transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>/month</span>
                </div>
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className={`transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Everything in Pro</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className={`transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Up to 10 team members</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className={`transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Team management</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span className={`transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Admin controls</span>
                  </li>
                </ul>
                <Button variant="outline" className={`w-full transition-colors ${
                  isDark 
                    ? 'border-gray-500 text-gray-300 hover:bg-gray-600 hover:text-white' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}>Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of creators and teams who trust DrawSpace for their visual collaboration needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4">
              Start Drawing Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-16 transition-colors duration-300 ${
        isDark ? 'bg-black text-gray-400' : 'bg-gray-900 text-gray-300'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xl font-bold transition-colors duration-300 ${
                  isDark ? 'text-gray-100' : 'text-white'
                }`}>DrawSpace</span>
              </div>
              <p className={`mb-6 max-w-md leading-relaxed transition-colors duration-300 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`}>
                The ultimate drawing and diagramming tool for teams. Create, collaborate, and share your ideas with the world.
              </p>
              <div className="flex space-x-4">
                <a href="#" className={`transition-colors ${
                  isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-white'
                }`}>
                  <span className="sr-only">Twitter</span>
                  <div className={`w-6 h-6 rounded transition-colors ${
                    isDark ? 'bg-gray-700' : 'bg-gray-600'
                  }`}></div>
                </a>
                <a href="#" className={`transition-colors ${
                  isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-white'
                }`}>
                  <span className="sr-only">GitHub</span>
                  <div className={`w-6 h-6 rounded transition-colors ${
                    isDark ? 'bg-gray-700' : 'bg-gray-600'
                  }`}></div>
                </a>
                <a href="#" className={`transition-colors ${
                  isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-white'
                }`}>
                  <span className="sr-only">LinkedIn</span>
                  <div className={`w-6 h-6 rounded transition-colors ${
                    isDark ? 'bg-gray-700' : 'bg-gray-600'
                  }`}></div>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className={`font-semibold mb-4 transition-colors duration-300 ${
                isDark ? 'text-gray-200' : 'text-white'
              }`}>Product</h4>
              <ul className="space-y-3">
                <li><a href="#" className={`transition-colors ${
                  isDark ? 'hover:text-gray-300' : 'hover:text-white'
                }`}>Features</a></li>
                <li><a href="#" className={`transition-colors ${
                  isDark ? 'hover:text-gray-300' : 'hover:text-white'
                }`}>Pricing</a></li>
                <li><a href="#" className={`transition-colors ${
                  isDark ? 'hover:text-gray-300' : 'hover:text-white'
                }`}>API</a></li>
                <li><a href="#" className={`transition-colors ${
                  isDark ? 'hover:text-gray-300' : 'hover:text-white'
                }`}>Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className={`font-semibold mb-4 transition-colors duration-300 ${
                isDark ? 'text-gray-200' : 'text-white'
              }`}>Support</h4>
              <ul className="space-y-3">
                <li><a href="#" className={`transition-colors ${
                  isDark ? 'hover:text-gray-300' : 'hover:text-white'
                }`}>Help Center</a></li>
                <li><a href="#" className={`transition-colors ${
                  isDark ? 'hover:text-gray-300' : 'hover:text-white'
                }`}>Community</a></li>
                <li><a href="#" className={`transition-colors ${
                  isDark ? 'hover:text-gray-300' : 'hover:text-white'
                }`}>Contact</a></li>
                <li><a href="#" className={`transition-colors ${
                  isDark ? 'hover:text-gray-300' : 'hover:text-white'
                }`}>Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className={`border-t mt-12 pt-8 text-center transition-colors duration-300 ${
            isDark ? 'border-gray-700' : 'border-gray-800'
          }`}>
            <p className={`transition-colors duration-300 ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              © 2025 DrawSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}