import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Calendar, MapPin, Save, Camera, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  university: string | null;
  major: string | null;
  graduation_year: number | null;
  created_at: string;
  updated_at: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    location: '',
    university: '',
    major: '',
    graduation_year: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserEmail(user.email || '');

      // For demo purposes, we'll use local state since tables aren't in the database yet
      const mockProfile: Profile = {
        id: user.id,
        full_name: user.user_metadata?.full_name || '',
        bio: null,
        avatar_url: null,
        location: null,
        university: null,
        major: null,
        graduation_year: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setProfile(mockProfile);
      setFormData({
        full_name: mockProfile.full_name || '',
        bio: mockProfile.bio || '',
        location: mockProfile.location || '',
        university: mockProfile.university || '',
        major: mockProfile.major || '',
        graduation_year: mockProfile.graduation_year?.toString() || ''
      });
    } catch (error: any) {
      toast.error("Error fetching profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // For demo purposes, we'll just update local state
      await new Promise(resolve => setTimeout(resolve, 1000));

      setProfile(prev => prev ? {
        ...prev,
        full_name: formData.full_name,
        bio: formData.bio,
        location: formData.location,
        university: formData.university,
        major: formData.major,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
        updated_at: new Date().toISOString()
      } : null);

      setSaved(true);
      toast.success("Profile updated successfully!");
      
      setTimeout(() => setSaved(false), 2000);
    } catch (error: any) {
      toast.error("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const calculateDaysUsing = () => {
    if (!profile) return 0;
    const createdDate = new Date(profile.created_at);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - createdDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="p-6 md:ml-64">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-48"></div>
            <div className="h-64 bg-muted rounded-xl"></div>
            <div className="h-96 bg-muted rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:ml-64 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Profile Overview */}
        <Card className="glass-card p-6 animate-scale-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative group">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-primary to-accent text-primary-foreground">
                  {profile?.full_name ? getInitials(profile.full_name) : 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full border-primary/20 hover:border-primary/50 hover:bg-primary/10"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">
                {profile?.full_name || 'User'}
              </h2>
              <div className="flex items-center space-x-2 text-muted-foreground mt-1">
                <Mail className="w-4 h-4" />
                <span>{userEmail}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground mt-1">
                <Calendar className="w-4 h-4" />
                <span>Active for {calculateDaysUsing()} days</span>
              </div>
              {profile?.location && (
                <div className="flex items-center space-x-2 text-muted-foreground mt-1">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-sm text-muted-foreground">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">3</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-income">$1,250</div>
                <div className="text-sm text-muted-foreground">Balance</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Form */}
        <Card className="glass-card p-6 animate-slide-up">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/20">
              <User className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Personal Information</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="glass-card border-primary/20 focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, Country"
                  className="glass-card border-primary/20 focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="university">University</Label>
                <Input
                  id="university"
                  value={formData.university}
                  onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                  placeholder="Your university"
                  className="glass-card border-primary/20 focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="major">Major/Field of Study</Label>
                <Input
                  id="major"
                  value={formData.major}
                  onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}
                  placeholder="Computer Science, Business, etc."
                  className="glass-card border-primary/20 focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="graduation_year">Expected Graduation Year</Label>
                <Input
                  id="graduation_year"
                  type="number"
                  min="2020"
                  max="2030"
                  value={formData.graduation_year}
                  onChange={(e) => setFormData(prev => ({ ...prev, graduation_year: e.target.value }))}
                  placeholder="2024"
                  className="glass-card border-primary/20 focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={userEmail}
                  disabled
                  className="glass-card border-primary/20 bg-muted/50 cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed from this page
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us a bit about yourself..."
                className="glass-card border-primary/20 focus:border-primary/50 resize-none"
                rows={4}
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={saving || saved}
                className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300 min-w-[120px]"
              >
                {saving ? (
                  <>Saving...</>
                ) : saved ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-card p-6 animate-fade-in">
            <h3 className="text-lg font-semibold mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Account Type</span>
                <Badge variant="secondary" className="px-3 py-1">Student</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Verification</span>
                <Badge variant="default" className="px-3 py-1 bg-income/20 text-income">Verified</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Member Since</span>
                <span className="font-medium">
                  {profile ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start border-primary/20 hover:border-primary/50">
                Export Data
              </Button>
              <Button variant="outline" className="w-full justify-start border-primary/20 hover:border-primary/50">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start border-expense/20 hover:border-expense/50 text-expense">
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}