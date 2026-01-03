import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Leaf, Mail, Lock, User, Eye, EyeOff, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<'login' | 'signup'>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    wantsTips: false,
  });

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup' || modeParam === 'login') {
      setMode(modeParam);
    }
  }, [searchParams]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (mode === 'signup' && !formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup' && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsLoading(true);
  
    try {
      const endpoint =
        mode === "signup"
          ? "http://localhost:5000/api/auth/signup"
          : "http://localhost:5000/api/auth/login";
  
      const payload =
        mode === "signup"
          ? {
              fullName: formData.fullName,
              email: formData.email,
              password: formData.password,
            }
          : {
              email: formData.email,
              password: formData.password,
            };
  
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
  
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
  
      toast({ title: "Success", description: data.message });
  
      navigate("/dashboard");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[hsl(85_20%_97%)] flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-[hsl(142_71%_45%/0.15)] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-[hsl(142_76%_36%)]" />
          </div>
          <h1 className="text-2xl font-bold text-[hsl(142_76%_22%)] mb-2">
            Account created successfully!
          </h1>
          <p className="text-[hsl(215_16%_47%)]">
            Redirecting you to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(85_20%_97%)] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back to Landing */}
        <Link 
          to="/landing" 
          className="inline-flex items-center gap-2 text-[hsl(215_16%_47%)] hover:text-[hsl(142_76%_36%)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[hsl(142_76%_36%)] flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-[hsl(142_76%_22%)]">EcoTrack</span>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-[hsl(142_76%_22%)] mb-2">
              {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-[hsl(215_16%_47%)]">
              {mode === 'login' 
                ? 'Track your carbon footprint and continue your progress'
                : 'Start reducing your carbon footprint today'
              }
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-[hsl(222_47%_11%)]">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(215_16%_47%)]" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`pl-10 h-12 border-2 focus:border-[hsl(142_76%_36%)] focus:ring-[hsl(142_76%_36%)] ${
                      errors.fullName ? 'border-[hsl(0_84%_60%)]' : 'border-[hsl(214_32%_91%)]'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-sm text-[hsl(0_84%_60%)]">{errors.fullName}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[hsl(222_47%_11%)]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(215_16%_47%)]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`pl-10 h-12 border-2 focus:border-[hsl(142_76%_36%)] focus:ring-[hsl(142_76%_36%)] ${
                    errors.email ? 'border-[hsl(0_84%_60%)]' : 'border-[hsl(214_32%_91%)]'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-[hsl(0_84%_60%)]">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[hsl(222_47%_11%)]">Password</Label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    className="text-sm text-[hsl(142_76%_36%)] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(215_16%_47%)]" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`pl-10 pr-10 h-12 border-2 focus:border-[hsl(142_76%_36%)] focus:ring-[hsl(142_76%_36%)] ${
                    errors.password ? 'border-[hsl(0_84%_60%)]' : 'border-[hsl(214_32%_91%)]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(215_16%_47%)] hover:text-[hsl(222_47%_11%)]"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-[hsl(0_84%_60%)]">{errors.password}</p>
              )}
            </div>

            {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[hsl(222_47%_11%)]">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[hsl(215_16%_47%)]" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`pl-10 pr-10 h-12 border-2 focus:border-[hsl(142_76%_36%)] focus:ring-[hsl(142_76%_36%)] ${
                        errors.confirmPassword ? 'border-[hsl(0_84%_60%)]' : 'border-[hsl(214_32%_91%)]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(215_16%_47%)] hover:text-[hsl(222_47%_11%)]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-[hsl(0_84%_60%)]">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="tips"
                    checked={formData.wantsTips}
                    onCheckedChange={(checked) => handleInputChange('wantsTips', checked as boolean)}
                    className="border-[hsl(214_32%_91%)] data-[state=checked]:bg-[hsl(142_76%_36%)] data-[state=checked]:border-[hsl(142_76%_36%)]"
                  />
                  <Label htmlFor="tips" className="text-sm text-[hsl(215_16%_47%)] font-normal cursor-pointer">
                    I want sustainability tips and updates
                  </Label>
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[hsl(142_76%_36%)] hover:bg-[hsl(142_76%_30%)] text-white text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : mode === 'login' ? (
                'Login'
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Toggle Mode */}
          <p className="text-center mt-6 text-[hsl(215_16%_47%)]">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-[hsl(142_76%_36%)] font-semibold hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
