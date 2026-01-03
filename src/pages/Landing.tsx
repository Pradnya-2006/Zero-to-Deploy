import { Link } from 'react-router-dom';
import { Leaf, BarChart3, Lightbulb, Target, TrendingDown, Globe, Zap, Bus, Apple, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[hsl(85_20%_97%)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[hsl(142_76%_36%)] flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[hsl(142_76%_22%)]">EcoTrack</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth?mode=login">
              <Button variant="ghost" className="text-[hsl(142_76%_22%)] hover:bg-[hsl(142_76%_36%/0.1)]">
                Login
              </Button>
            </Link>
            <Link to="/auth?mode=signup">
              <Button className="bg-[hsl(142_76%_36%)] hover:bg-[hsl(142_76%_30%)] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="container mx-auto px-6 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-4xl lg:text-6xl font-bold text-[hsl(142_76%_22%)] leading-tight">
                Track Your Carbon Footprint.{' '}
                <span className="text-[hsl(142_71%_45%)]">Reduce Your Impact.</span>
              </h1>
              <p className="text-lg lg:text-xl text-[hsl(215_16%_47%)] max-w-lg">
                Understand how your daily activities affect the environment and take simple steps toward a sustainable lifestyle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth?mode=signup">
                  <Button 
                    size="lg" 
                    className="bg-[hsl(142_76%_36%)] hover:bg-[hsl(142_76%_30%)] text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 glow-emerald"
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/auth?mode=login">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-[hsl(142_76%_36%)] text-[hsl(142_76%_36%)] hover:bg-[hsl(142_76%_36%/0.1)] px-8 py-6 text-lg transition-all duration-300"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </div>

            {/* Illustration */}
            <div className="relative animate-slide-up hidden lg:block">
              <div className="absolute -top-20 -right-20 w-72 h-72 bg-[hsl(142_71%_45%/0.2)] rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[hsl(142_76%_36%/0.15)] rounded-full blur-2xl" />
              
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-3 gap-6">
                  <div className="flex flex-col items-center gap-3 p-4 bg-[hsl(85_20%_97%)] rounded-2xl">
                    <div className="w-14 h-14 rounded-xl bg-[hsl(142_71%_45%/0.2)] flex items-center justify-center">
                      <Globe className="w-7 h-7 text-[hsl(142_76%_36%)]" />
                    </div>
                    <span className="text-sm font-medium text-[hsl(215_16%_47%)]">Earth</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 p-4 bg-[hsl(85_20%_97%)] rounded-2xl">
                    <div className="w-14 h-14 rounded-xl bg-[hsl(38_92%_50%/0.2)] flex items-center justify-center">
                      <Zap className="w-7 h-7 text-[hsl(38_92%_50%)]" />
                    </div>
                    <span className="text-sm font-medium text-[hsl(215_16%_47%)]">Energy</span>
                  </div>
                  <div className="flex flex-col items-center gap-3 p-4 bg-[hsl(85_20%_97%)] rounded-2xl">
                    <div className="w-14 h-14 rounded-xl bg-[hsl(210_84%_50%/0.2)] flex items-center justify-center">
                      <Bus className="w-7 h-7 text-[hsl(210_84%_50%)]" />
                    </div>
                    <span className="text-sm font-medium text-[hsl(215_16%_47%)]">Transport</span>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-[hsl(142_71%_45%/0.1)] rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-[hsl(142_76%_22%)]">Your Impact</span>
                    <span className="text-xs text-[hsl(142_71%_45%)] font-medium">-23% this month</span>
                  </div>
                  <div className="h-2 bg-[hsl(142_71%_45%/0.2)] rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-[hsl(142_71%_45%)] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl lg:text-4xl font-bold text-[hsl(142_76%_22%)] mb-4">
              How It Works
            </h2>
            <p className="text-[hsl(215_16%_47%)] max-w-2xl mx-auto">
              Three simple steps to understand and reduce your environmental impact
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                title: 'Track Activities',
                description: 'Log your transport, electricity usage, and food habits with our simple calculator.',
                color: 'hsl(142_76%_36%)',
                bgColor: 'hsl(142_71%_45%/0.1)',
              },
              {
                icon: BarChart3,
                title: 'See Your Impact',
                description: 'View clear charts and detailed breakdowns of your carbon footprint.',
                color: 'hsl(38_92%_50%)',
                bgColor: 'hsl(38_92%_50%/0.1)',
              },
              {
                icon: TrendingDown,
                title: 'Reduce Emissions',
                description: 'Get personalized weekly suggestions to lower your environmental impact.',
                color: 'hsl(210_84%_50%)',
                bgColor: 'hsl(210_84%_50%/0.1)',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group p-8 bg-[hsl(85_20%_97%)] rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: item.bgColor }}
                >
                  <item.icon className="w-8 h-8" style={{ color: item.color }} />
                </div>
                <h3 className="text-xl font-semibold text-[hsl(142_76%_22%)] mb-3">{item.title}</h3>
                <p className="text-[hsl(215_16%_47%)]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why This Platform Section */}
      <section className="py-20 bg-[hsl(85_20%_97%)]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-[hsl(142_76%_22%)]">
                Why Choose EcoTrack?
              </h2>
              <div className="space-y-6">
                {[
                  { icon: CheckCircle2, text: 'Simple & transparent calculations' },
                  { icon: BarChart3, text: 'Weekly & monthly tracking' },
                  { icon: Lightbulb, text: 'Personalized reduction tips' },
                  { icon: TrendingDown, text: 'Progress visualization' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-[hsl(142_71%_45%/0.15)] flex items-center justify-center group-hover:bg-[hsl(142_71%_45%/0.25)] transition-colors">
                      <item.icon className="w-6 h-6 text-[hsl(142_76%_36%)]" />
                    </div>
                    <span className="text-lg text-[hsl(222_47%_11%)] font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[hsl(142_71%_45%/0.2)] rounded-full blur-2xl" />
              <div className="relative bg-white rounded-3xl p-8 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[hsl(215_16%_47%)]">Monthly Progress</span>
                    <span className="text-sm font-semibold text-[hsl(142_71%_45%)]">+15% improvement</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[40, 55, 45, 70, 60, 80, 75, 90].map((height, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-full bg-[hsl(142_71%_45%/0.2)] rounded-full h-24 flex items-end">
                          <div 
                            className="w-full bg-[hsl(142_71%_45%)] rounded-full transition-all duration-500"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-[hsl(215_16%_47%)]">
                    <Apple className="w-4 h-4 text-[hsl(142_76%_36%)]" />
                    <span>2.4 tons CO₂ saved this year</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[hsl(142_76%_36%)] to-[hsl(142_76%_28%)] p-12 lg:p-16 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Start your sustainability journey today.
              </h2>
              <p className="text-lg text-white/80">
                Join thousands of users making a positive impact on the environment.
              </p>
              <Link to="/auth?mode=signup">
                <Button 
                  size="lg" 
                  className="bg-white text-[hsl(142_76%_36%)] hover:bg-white/90 px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[hsl(85_20%_97%)] border-t border-[hsl(142_76%_36%/0.1)]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[hsl(142_76%_36%)] flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-[hsl(142_76%_22%)]">EcoTrack</span>
            </div>
            
            <p className="text-sm text-[hsl(215_16%_47%)]">
              Making sustainability simple, one step at a time.
            </p>
            
            <div className="flex items-center gap-6 text-sm text-[hsl(215_16%_47%)]">
              <a href="#" className="hover:text-[hsl(142_76%_36%)] transition-colors">About</a>
              <a href="#" className="hover:text-[hsl(142_76%_36%)] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[hsl(142_76%_36%)] transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[hsl(142_76%_36%/0.1)] text-center text-sm text-[hsl(215_16%_47%)]">
            © {new Date().getFullYear()} EcoTrack. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
