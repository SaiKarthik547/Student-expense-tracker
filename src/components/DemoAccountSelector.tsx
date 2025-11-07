import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { demoCredentials } from "@/utils/demoData";
import { Users, User, GraduationCap } from "lucide-react";

interface DemoAccountSelectorProps {
  onSelectDemo: (userType: 'cs' | 'medical' | 'engineering') => void;
  onClose: () => void;
}

// Facade Pattern: Simplified interface for demo account selection
export const DemoAccountSelector = ({ onSelectDemo, onClose }: DemoAccountSelectorProps) => {
  
  // Strategy Pattern: Different demo selection strategies
  const handleDemoSelection = (email: string) => {
    const userType = email.includes('cs') ? 'cs' : 
                    email.includes('medical') ? 'medical' : 'engineering';
    onSelectDemo(userType);
  };

  const getProfileIcon = (email: string) => {
    if (email.includes('cs')) return <GraduationCap className="w-5 h-5 text-primary" />;
    if (email.includes('medical')) return <User className="w-5 h-5 text-accent" />;
    return <Users className="w-5 h-5 text-warning" />;
  };

  return (
    <Card className="glass-card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold">Demo Student Profiles</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ✕
        </Button>
      </div>
      
      <p className="text-muted-foreground mb-6">
        Select a student profile to explore different financial scenarios
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {demoCredentials.map((demo, index) => (
          <Card 
            key={index} 
            className="p-4 hover:bg-primary/5 transition-all duration-300 border border-primary/20 cursor-pointer group"
            onClick={() => handleDemoSelection(demo.email)}
          >
            <div className="flex items-center gap-3 mb-3">
              {getProfileIcon(demo.email)}
              <h4 className="font-semibold text-primary group-hover:text-accent transition-colors">
                {demo.title}
              </h4>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {demo.description}
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Email:</span>
                <Badge variant="outline" className="text-xs">{demo.email}</Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Password:</span>
                <Badge variant="secondary" className="text-xs">{demo.password}</Badge>
              </div>
            </div>
            
            <Button 
              size="sm" 
              variant="outline"
              className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleDemoSelection(demo.email);
              }}
            >
              Load Profile Data
            </Button>
          </Card>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-muted/20 rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Software Models Used:</strong> Facade Pattern for simplified interface, 
          Strategy Pattern for demo selection, Observer Pattern for state updates
        </p>
      </div>
    </Card>
  );
};