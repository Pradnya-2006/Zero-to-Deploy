import { useState ,useEffect } from 'react';
import { User, Bell, Globe, Shield, Palette, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { toast } = useToast();
  
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "India",
  });

  useEffect(() => {
    if (storedUser) {
      setProfile((prev) => ({
        ...prev,
        name: storedUser.fullName || "",
        email: storedUser.email || "",
      }));
    }
  }, []);

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    weeklyReport: true,
    goalReminders: true,
    tips: true,
  });

  const [units, setUnits] = useState({
    co2: 'kg',
    distance: 'km',
    energy: 'kWh',
  });

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your preferences have been updated successfully.',
    });
  };

  return (
    <div className="page-container max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <div className="dashboard-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-semibold text-foreground">Profile</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="mt-1.5"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Select
              value={profile.location}
              onValueChange={(value) => setProfile({ ...profile, location: value })}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="Australia">Australia</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="India">India</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="dashboard-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <Bell className="w-5 h-5 text-warning" />
          </div>
          <h2 className="font-semibold text-foreground">Notifications</h2>
        </div>

        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email notifications', description: 'Receive updates via email' },
            { key: 'weeklyReport', label: 'Weekly report', description: 'Get a summary of your progress' },
            { key: 'goalReminders', label: 'Goal reminders', description: 'Notifications about your goals' },
            { key: 'tips', label: 'Eco tips', description: 'Daily sustainability tips' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Switch
                checked={preferences[item.key as keyof typeof preferences]}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, [item.key]: checked })
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* Units Section */}
      <div className="dashboard-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-success" />
          </div>
          <h2 className="font-semibold text-foreground">Units & Preferences</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>CO₂ Units</Label>
            <Select value={units.co2} onValueChange={(value) => setUnits({ ...units, co2: value })}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                <SelectItem value="tonnes">Tonnes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Distance</Label>
            <Select value={units.distance} onValueChange={(value) => setUnits({ ...units, distance: value })}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="km">Kilometers (km)</SelectItem>
                <SelectItem value="miles">Miles</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Energy</Label>
            <Select value={units.energy} onValueChange={(value) => setUnits({ ...units, energy: value })}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kWh">Kilowatt-hours (kWh)</SelectItem>
                <SelectItem value="MJ">Megajoules (MJ)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Privacy Section */}
      <div className="dashboard-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-destructive" />
          </div>
          <h2 className="font-semibold text-foreground">Privacy & Data</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Data sharing</p>
              <p className="text-sm text-muted-foreground">Allow anonymous data for research</p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="text-muted-foreground">
              Export my data
            </Button>
            <Button variant="outline" className="text-destructive hover:text-destructive">
              Delete account
            </Button>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2 gradient-emerald text-primary-foreground">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
