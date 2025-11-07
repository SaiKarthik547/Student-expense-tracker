import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Globe, DollarSign, Save, Check } from "lucide-react";
import { toast } from "sonner";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number;
}

const currencies: Currency[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.12 },
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.85 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.73 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.25 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.35 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 110.0 },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', rate: 0.92 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 6.45 },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', rate: 5.2 }
];

const countries = [
  'India', 
  'United States', 
  'Canada', 
  'United Kingdom', 
  'Germany', 
  'France', 
  'Australia',
  'Japan', 
  'Switzerland', 
  'Netherlands', 
  'Sweden', 
  'Denmark', 
  'Norway',
  'Singapore', 
  'New Zealand', 
  'Ireland', 
  'Belgium', 
  'Austria', 
  'Finland'
];

const indianCities = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Ahmedabad',
  'Chennai',
  'Kolkata',
  'Surat',
  'Pune',
  'Jaipur',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Pimpri-Chinchwad',
  'Patna',
  'Vadodara',
  'Ghaziabad',
  'Ludhiana',
  'Agra',
  'Nashik',
  'Faridabad',
  'Meerut',
  'Rajkot',
  'Kalyan-Dombivali',
  'Vasai-Virar',
  'Varanasi',
  'Srinagar',
  'Aurangabad',
  'Dhanbad',
  'Amritsar',
  'Navi Mumbai',
  'Allahabad',
  'Ranchi',
  'Howrah',
  'Coimbatore',
  'Jabalpur',
  'Gwalior',
  'Vijayawada',
  'Jodhpur',
  'Madurai',
  'Raipur',
  'Kota'
];

export default function Location() {
  const [settings, setSettings] = useState({
    country: 'India',
    city: 'Mumbai',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    dateFormat: 'DD/MM/YYYY',
    autoDetectLocation: true
  });
  const [saved, setSaved] = useState(false);
  const [detecting, setDetecting] = useState(false);

  const selectedCurrency = currencies.find(c => c.code === settings.currency) || currencies[0];

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    setDetecting(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Simulate location detection (in a real app, you'd use a geocoding service)
          const mockLocations = [
            { country: 'India', city: 'Mumbai', timezone: 'Asia/Kolkata', currency: 'INR' },
            { country: 'India', city: 'Delhi', timezone: 'Asia/Kolkata', currency: 'INR' },
            { country: 'India', city: 'Bangalore', timezone: 'Asia/Kolkata', currency: 'INR' },
            { country: 'India', city: 'Chennai', timezone: 'Asia/Kolkata', currency: 'INR' },
            { country: 'India', city: 'Hyderabad', timezone: 'Asia/Kolkata', currency: 'INR' },
            { country: 'United States', city: 'New York', timezone: 'America/New_York', currency: 'USD' },
            { country: 'United Kingdom', city: 'London', timezone: 'Europe/London', currency: 'GBP' }
          ];
          
          const randomLocation = mockLocations[Math.floor(Math.random() * mockLocations.length)];
          
          setSettings(prev => ({
            ...prev,
            ...randomLocation
          }));
          
          toast.success("Location detected successfully!");
        } catch (error) {
          toast.error("Failed to detect location");
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        toast.error("Permission denied for location access");
        setDetecting(false);
      }
    );
  };

  const handleSave = async () => {
    // Here you would normally save to Supabase
    // For demo purposes, we'll just show success
    
    // Simulate saving delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setSaved(true);
    toast.success("Location settings saved successfully!");
    
    // Reset saved indicator after 2 seconds
    setTimeout(() => setSaved(false), 2000);
  };

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string) => {
    const fromRate = currencies.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = currencies.find(c => c.code === toCurrency)?.rate || 1;
    return (amount / fromRate) * toRate;
  };

  return (
    <div className="p-6 md:ml-64 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Location & Currency
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure your location settings and preferred currency
            </p>
          </div>
          
          <Button
            onClick={detectLocation}
            disabled={detecting}
            variant="outline"
            className="border-primary/20 hover:border-primary/50 hover:bg-primary/10"
          >
            <MapPin className="w-4 h-4 mr-2" />
            {detecting ? 'Detecting...' : 'Auto-Detect Location'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Location Settings */}
          <Card className="glass-card p-6 animate-scale-in">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-primary/20">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Location Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <select
                  id="country"
                  value={settings.country}
                  onChange={(e) => setSettings(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg glass-card border border-primary/20 focus:border-primary/50 bg-background text-foreground"
                >
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                {settings.country === 'India' ? (
                  <select
                    id="city"
                    value={settings.city}
                    onChange={(e) => setSettings(prev => ({ ...prev, city: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg glass-card border border-primary/20 focus:border-primary/50 bg-background text-foreground"
                  >
                    {indianCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id="city"
                    value={settings.city}
                    onChange={(e) => setSettings(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="Enter your city"
                    className="glass-card border-primary/20 focus:border-primary/50"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={settings.timezone}
                  onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  placeholder="e.g., America/New_York"
                  className="glass-card border-primary/20 focus:border-primary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat">Date Format</Label>
                <select
                  id="dateFormat"
                  value={settings.dateFormat}
                  onChange={(e) => setSettings(prev => ({ ...prev, dateFormat: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg glass-card border border-primary/20 focus:border-primary/50 bg-background text-foreground"
                >
                  <option value="DD/MM/YYYY">DD/MM/YYYY (Indian Standard)</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                  <option value="DD.MM.YYYY">DD.MM.YYYY (European)</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoDetect"
                  checked={settings.autoDetectLocation}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoDetectLocation: e.target.checked }))}
                  className="rounded border-primary/20"
                />
                <Label htmlFor="autoDetect">Auto-detect location on login</Label>
              </div>
            </div>
          </Card>

          {/* Currency Settings */}
          <Card className="glass-card p-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-accent/20">
                <DollarSign className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl font-semibold">Currency Settings</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currency">Primary Currency</Label>
                <select
                  id="currency"
                  value={settings.currency}
                  onChange={(e) => setSettings(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg glass-card border border-primary/20 focus:border-primary/50 bg-background text-foreground"
                >
                  {currencies.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="text-2xl">{selectedCurrency.symbol}</div>
                  <div>
                    <h3 className="font-semibold">{selectedCurrency.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      1 USD = {selectedCurrency.rate} {selectedCurrency.code}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="px-3 py-1">
                  Current Selection
                </Badge>
              </div>

              {/* Currency Converter */}
              <div className="space-y-4">
                <h3 className="font-semibold">Quick Currency Converter</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">$100 USD</span>
                      <span className="font-semibold">
                        {selectedCurrency.symbol}{convertAmount(100, 'USD', settings.currency).toFixed(2)} {settings.currency}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">$500 USD</span>
                      <span className="font-semibold">
                        {selectedCurrency.symbol}{convertAmount(500, 'USD', settings.currency).toFixed(2)} {settings.currency}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/20 border border-border/50">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">$1,000 USD</span>
                      <span className="font-semibold">
                        {selectedCurrency.symbol}{convertAmount(1000, 'USD', settings.currency).toFixed(2)} {settings.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Current Settings Overview */}
        <Card className="glass-card p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-xl bg-primary/20">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold">Current Settings Overview</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-muted/20 text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">{settings.city}</h3>
              <p className="text-sm text-muted-foreground">{settings.country}</p>
            </div>
            
            <div className="p-4 rounded-xl bg-muted/20 text-center">
              <DollarSign className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold">{selectedCurrency.symbol} {settings.currency}</h3>
              <p className="text-sm text-muted-foreground">{selectedCurrency.name}</p>
            </div>
            
            <div className="p-4 rounded-xl bg-muted/20 text-center">
              <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">{settings.timezone}</h3>
              <p className="text-sm text-muted-foreground">Timezone</p>
            </div>
            
            <div className="p-4 rounded-xl bg-muted/20 text-center">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-accent font-bold text-sm">📅</span>
              </div>
              <h3 className="font-semibold">{settings.dateFormat}</h3>
              <p className="text-sm text-muted-foreground">Date Format</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saved}
              className="bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary transition-all duration-300"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Exchange Rate Info */}
        <Card className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-xl font-semibold mb-4">Current Exchange Rates (vs USD)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {currencies.slice(0, 10).map(currency => (
              <div 
                key={currency.code}
                className={`p-3 rounded-xl border transition-all duration-200 ${
                  currency.code === settings.currency 
                    ? 'border-primary/50 bg-primary/10' 
                    : 'border-border/50 hover:border-primary/30'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg font-bold">{currency.symbol}</div>
                  <div className="font-semibold">{currency.code}</div>
                  <div className="text-sm text-muted-foreground">{currency.rate}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            * Exchange rates are for demonstration purposes only. Use live rates for actual transactions.
          </p>
        </Card>
      </div>
    </div>
  );
}