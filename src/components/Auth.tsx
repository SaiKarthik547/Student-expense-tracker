import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, Lock, User, AlertCircle, CheckCircle, GraduationCap, Users2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional()
});

export function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('signin');

  const validateForm = (isSignUp: boolean = false) => {
    try {
      const dataToValidate = isSignUp 
        ? { ...formData, fullName: formData.fullName || 'Student' }
        : { email: formData.email, password: formData.password };
      
      authSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ auth: 'Invalid email or password. Please check your credentials.' });
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ auth: 'Please check your email and click the confirmation link before signing in.' });
        } else {
          setErrors({ auth: error.message });
        }
        return;
      }

      if (data.user) {
        toast.success('Welcome back! Signed in successfully.');
      }
    } catch (error: unknown) {
      setErrors({ auth: 'An unexpected error occurred. Please try again.' });
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(true)) return;

    setIsLoading(true);
    setErrors({});

    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: formData.fullName.trim() || 'Student'
          }
        }
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setErrors({ auth: 'An account with this email already exists. Please sign in instead.' });
          setActiveTab('signin');
        } else if (error.message.includes('Password should be at least')) {
          setErrors({ password: 'Password should be at least 6 characters long.' });
        } else {
          setErrors({ auth: error.message });
        }
        return;
      }

      if (data.user && !data.session) {
        toast.success('Account created! Please check your email for the confirmation link.');
        setFormData({ email: '', password: '', fullName: '' });
      } else if (data.session) {
        toast.success('Account created and signed in successfully!');
      }
    } catch (error: unknown) {
      setErrors({ auth: 'Failed to create account. Please try again.' });
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen finance-bg moving-gradient flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card border-2 border-primary/20">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            💰 Student Finance
          </CardTitle>
          <CardDescription className="text-base">
            Your comprehensive financial management companion
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {errors.auth && (
              <Alert className="mb-4 border-expense/50 bg-expense/10">
                <AlertCircle className="h-4 w-4 text-expense" />
                <AlertDescription className="text-expense font-medium">
                  {errors.auth}
                </AlertDescription>
              </Alert>
            )}

            <TabsContent value="signin" className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    className={errors.email ? 'border-expense focus:border-expense' : ''}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-expense flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className={errors.password ? 'border-expense focus:border-expense' : ''}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-sm text-expense flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={handleInputChange('fullName')}
                    className={errors.fullName ? 'border-expense focus:border-expense' : ''}
                    disabled={isLoading}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-expense flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="student@university.edu"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    className={errors.email ? 'border-expense focus:border-expense' : ''}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-expense flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a strong password (min. 6 chars)"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    className={errors.password ? 'border-expense focus:border-expense' : ''}
                    disabled={isLoading}
                  />
                  {errors.password && (
                    <p className="text-sm text-expense flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-accent to-primary hover:from-primary hover:to-accent"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Demo Account Section */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-lg font-semibold text-center mb-4">Quick Demo Login</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Explore the app with pre-filled student profiles
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-auto py-3 px-2 hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setFormData({
                    email: 'demo.cs@student.com',
                    password: 'demo123456',
                    fullName: ''
                  });
                  setActiveTab('signin');
                  toast.info('Loading CS Student profile (Arjun Kumar)...');
                  // Auto-trigger sign-in after a short delay
                  setTimeout(() => {
                    const event = { preventDefault: () => {} } as React.FormEvent;
                    handleSignIn(event);
                  }, 300);
                }}
              >
                <GraduationCap className="w-5 h-5 text-primary mb-1" />
                <span className="text-xs font-medium">CS Student</span>
                <span className="text-xs text-muted-foreground">Arjun</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-auto py-3 px-2 hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setFormData({
                    email: 'demo.medical@student.com',
                    password: 'demo123456',
                    fullName: ''
                  });
                  setActiveTab('signin');
                  toast.info('Loading Medical Student profile (Priya Sharma)...');
                  // Auto-trigger sign-in after a short delay
                  setTimeout(() => {
                    const event = { preventDefault: () => {} } as React.FormEvent;
                    handleSignIn(event);
                  }, 300);
                }}
              >
                <User className="w-5 h-5 text-accent mb-1" />
                <span className="text-xs font-medium">Medical</span>
                <span className="text-xs text-muted-foreground">Priya</span>
              </Button>
              
              <Button
                variant="outline"
                className="flex flex-col items-center justify-center h-auto py-3 px-2 hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setFormData({
                    email: 'demo.engineering@student.com',
                    password: 'demo123456',
                    fullName: ''
                  });
                  setActiveTab('signin');
                  toast.info('Loading Engineering Student profile (Rahul Patel)...');
                  // Auto-trigger sign-in after a short delay
                  setTimeout(() => {
                    const event = { preventDefault: () => {} } as React.FormEvent;
                    handleSignIn(event);
                  }, 300);
                }}
              >
                <Users2 className="w-5 h-5 text-warning mb-1" />
                <span className="text-xs font-medium">Engineering</span>
                <span className="text-xs text-muted-foreground">Rahul</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-3">
              All demo accounts use password: <span className="font-mono">demo123456</span>
            </p>
          </div>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Secure authentication powered by Supabase
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="w-3 h-3 text-income" />
              <span>End-to-end encryption</span>
              <CheckCircle className="w-3 h-3 text-income" />
              <span>Data privacy protected</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}