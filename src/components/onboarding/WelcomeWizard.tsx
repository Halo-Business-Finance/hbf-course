import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { GraduationCap, Target, Trophy, Rocket, ChevronRight, ChevronLeft, CheckCircle, Briefcase, TrendingUp, Building2, Shield, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface WelcomeWizardProps {
  onComplete?: () => void;
}

const roles = [
  { id: 'loan_officer', label: 'Loan Officer', icon: Briefcase, description: 'Originate and process commercial loans' },
  { id: 'credit_analyst', label: 'Credit Analyst', icon: TrendingUp, description: 'Evaluate creditworthiness and risk' },
  { id: 'branch_manager', label: 'Branch / Team Manager', icon: Building2, description: 'Lead a lending team or branch' },
  { id: 'compliance', label: 'Compliance Officer', icon: Shield, description: 'Ensure regulatory compliance' },
  { id: 'new_to_lending', label: 'New to Lending', icon: BookOpen, description: 'Just starting my career in finance' },
];

const goals = [
  { id: 'certification', label: 'Earn a certification' },
  { id: 'promotion', label: 'Prepare for a promotion' },
  { id: 'skill_refresh', label: 'Refresh existing skills' },
  { id: 'career_change', label: 'Change careers into lending' },
  { id: 'compliance_req', label: 'Meet compliance requirements' },
];

const roleRecommendations: Record<string, string[]> = {
  loan_officer: ['SBA 7(a)', 'Commercial Real Estate', 'Term Loans'],
  credit_analyst: ['Asset-Based Lending', 'Business Acquisition', 'Equipment Financing'],
  branch_manager: ['Working Capital', 'SBA 7(a)', 'Construction Loans'],
  compliance: ['SBA 7(a)', 'SBA Express', 'Commercial Real Estate'],
  new_to_lending: ['SBA 7(a)', 'Business Lines of Credit', 'Term Loans'],
};

export function WelcomeWizard({ onComplete }: WelcomeWizardProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const { user } = useAuth();

  const totalSteps = 4;

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      const profile = data as unknown as Record<string, unknown> | null;
      if (profile && profile.onboarding_completed !== true) {
        setOpen(true);
      }
    };
    
    checkOnboarding();
  }, [user]);

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    if (user) {
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true } as unknown as Record<string, never>)
        .eq('user_id', user.id);
    }
    setOpen(false);
    onComplete?.();
  };

  const handleSkip = () => {
    handleComplete();
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };

  const progress = ((currentStep + 1) / totalSteps) * 100;
  const recommended = selectedRole ? roleRecommendations[selectedRole] || [] : [];

  const stepIcons = [GraduationCap, Briefcase, Target, Rocket];
  const CurrentIcon = stepIcons[currentStep];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground">
              Skip tour
            </Button>
          </div>
          <Progress value={progress} className="h-1 mb-4" />
          
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CurrentIcon className="w-8 h-8 text-primary" />
            </div>
          </div>
        </DialogHeader>

        {/* Step 0: Welcome */}
        {currentStep === 0 && (
          <div className="space-y-4 text-center">
            <DialogTitle className="text-xl">Welcome to FinPilot!</DialogTitle>
            <DialogDescription>
              Master business finance and commercial lending with courses designed by industry experts.
            </DialogDescription>
            <p className="text-sm text-muted-foreground">
              Let's personalize your experience in just a few quick steps. You'll get course recommendations tailored to your role and goals.
            </p>
          </div>
        )}

        {/* Step 1: Role Selection */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <DialogTitle className="text-xl text-center">What's your role?</DialogTitle>
            <DialogDescription className="text-center">
              Select your current position so we can recommend the right courses.
            </DialogDescription>
            <div className="grid gap-2 mt-4">
              {roles.map(role => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <Card
                    key={role.id}
                    className={`p-3 cursor-pointer transition-all duration-200 border-2 ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                    onClick={() => setSelectedRole(role.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-5 w-5 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{role.label}</p>
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      </div>
                      {isSelected && <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Goals */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <DialogTitle className="text-xl text-center">What are your goals?</DialogTitle>
            <DialogDescription className="text-center">
              Select one or more goals. We'll tailor your dashboard accordingly.
            </DialogDescription>
            <div className="grid gap-2 mt-4">
              {goals.map(goal => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <Card
                    key={goal.id}
                    className={`p-3 cursor-pointer transition-all duration-200 border-2 ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/30'
                    }`}
                    onClick={() => toggleGoal(goal.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Target className={`h-4 w-4 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <p className="font-medium text-sm flex-1">{goal.label}</p>
                      {isSelected && <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Personalized Recommendations */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <DialogTitle className="text-xl text-center">Your Recommended Courses</DialogTitle>
            <DialogDescription className="text-center">
              Based on your role, we recommend starting with these courses.
            </DialogDescription>
            {recommended.length > 0 ? (
              <div className="grid gap-2 mt-4">
                {recommended.map((course, idx) => (
                  <Card key={idx} className="p-3 border-2 border-primary/20 bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{course}</p>
                        <p className="text-xs text-muted-foreground">Recommended for your role</p>
                      </div>
                      <Trophy className="h-4 w-4 text-halo-orange" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground mt-4">
                Go back and select a role to see personalized recommendations!
              </p>
            )}
            <p className="text-xs text-muted-foreground text-center mt-2">
              You can always explore all courses from your dashboard.
            </p>
          </div>
        )}

        {/* Step indicators */}
        <div className="flex justify-center gap-2 py-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep ? 'bg-primary' : index < currentStep ? 'bg-primary/50' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          
          <Button onClick={handleNext} className="gap-1">
            {currentStep === totalSteps - 1 ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Get Started
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
