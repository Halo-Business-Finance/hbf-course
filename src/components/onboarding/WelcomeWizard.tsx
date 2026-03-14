import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import {
  GraduationCap, Target, Trophy, Rocket, ChevronRight, ChevronLeft,
  CheckCircle, Briefcase, TrendingUp, Building2, Shield, BookOpen,
  BarChart3, Layers,
} from 'lucide-react';
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

const experienceLevels = [
  { id: 'beginner', label: 'Beginner', icon: BookOpen, description: 'Less than 1 year in commercial lending', recommended: 'beginner' },
  { id: 'intermediate', label: 'Intermediate', icon: BarChart3, description: '1–5 years of industry experience', recommended: 'beginner' },
  { id: 'advanced', label: 'Advanced', icon: Layers, description: '5+ years, looking to specialize or certify', recommended: 'expert' },
];

const goals = [
  { id: 'certification', label: 'Earn a professional certification', icon: Trophy },
  { id: 'promotion', label: 'Prepare for a promotion', icon: TrendingUp },
  { id: 'skill_refresh', label: 'Refresh existing skills', icon: Target },
  { id: 'career_change', label: 'Transition into lending', icon: Rocket },
  { id: 'compliance_req', label: 'Meet compliance requirements', icon: Shield },
];

const skillConfidenceAreas = [
  { id: 'sba_lending', label: 'SBA Lending Programs' },
  { id: 'credit_analysis', label: 'Credit & Financial Analysis' },
  { id: 'real_estate', label: 'Commercial Real Estate' },
  { id: 'risk_management', label: 'Risk Management' },
  { id: 'compliance', label: 'Regulatory Compliance' },
];

const roleRecommendations: Record<string, Record<string, string[]>> = {
  loan_officer: {
    beginner: ['SBA 7(a)', 'Term Loans', 'Business Lines of Credit'],
    intermediate: ['Commercial Real Estate', 'Equipment Financing', 'SBA Express'],
    advanced: ['Construction Loans', 'Bridge Loans', 'Business Acquisition'],
  },
  credit_analyst: {
    beginner: ['Term Loans', 'Working Capital', 'SBA 7(a)'],
    intermediate: ['Asset-Based Lending', 'Equipment Financing', 'Invoice Factoring'],
    advanced: ['Business Acquisition', 'Construction Loans', 'Merchant Cash Advances'],
  },
  branch_manager: {
    beginner: ['SBA 7(a)', 'Working Capital', 'Term Loans'],
    intermediate: ['Commercial Real Estate', 'SBA Express', 'Equipment Financing'],
    advanced: ['Construction Loans', 'Bridge Loans', 'Franchise Financing'],
  },
  compliance: {
    beginner: ['SBA 7(a)', 'SBA Express', 'Term Loans'],
    intermediate: ['Commercial Real Estate', 'Equipment Financing', 'Working Capital'],
    advanced: ['Asset-Based Lending', 'Construction Loans', 'Healthcare Financing'],
  },
  new_to_lending: {
    beginner: ['SBA 7(a)', 'Business Lines of Credit', 'Term Loans'],
    intermediate: ['Working Capital', 'Equipment Financing', 'SBA Express'],
    advanced: ['Commercial Real Estate', 'Asset-Based Lending', 'Invoice Factoring'],
  },
};

const TOTAL_STEPS = 5;
const stepLabels = ['Welcome', 'Your Role', 'Experience', 'Goals', 'Your Path'];

export function WelcomeWizard({ onComplete }: WelcomeWizardProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<string | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [skillConfidence, setSkillConfidence] = useState<Record<string, number>>({});
  const { user } = useAuth();

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('onboarding_completed')
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
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleComplete = async () => {
    if (user) {
      await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          professional_role: selectedRole,
          experience_level: selectedExperience,
          learning_goals: selectedGoals,
        } as unknown)
        .eq('user_id', user.id);

      toast.success('Welcome aboard! Your dashboard is personalized.');
    }
    setOpen(false);
    onComplete?.();
  };

  const handleSkip = () => handleComplete();

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const setConfidence = (areaId: string, level: number) => {
    setSkillConfidence((prev) => ({ ...prev, [areaId]: level }));
  };

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

  const recommended = (() => {
    if (!selectedRole) return [];
    const expLevel = selectedExperience || 'beginner';
    return roleRecommendations[selectedRole]?.[expLevel] || roleRecommendations[selectedRole]?.beginner || [];
  })();

  const recommendedLevel = selectedExperience === 'advanced' ? 'Expert' : 'Beginner';

  const stepIcons = [GraduationCap, Briefcase, BarChart3, Target, Rocket];
  const CurrentIcon = stepIcons[currentStep];

  const canProceed = (() => {
    if (currentStep === 0) return true;
    if (currentStep === 1) return !!selectedRole;
    if (currentStep === 2) return !!selectedExperience;
    return true;
  })();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] p-0 overflow-y-auto border-0">
        {/* Header with navy accent */}
        <div className="bg-halo-navy px-6 pt-6 pb-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {stepLabels.map((label, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === currentStep ? 'bg-white' : i < currentStep ? 'bg-white/60' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-white/70 hover:text-white hover:bg-white/10 text-xs">
              Skip
            </Button>
          </div>
          <Progress value={progress} className="h-1 mb-4 bg-white/20 [&>div]:bg-white" />

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <CurrentIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/60 uppercase tracking-wide font-medium">
                Step {currentStep + 1} of {TOTAL_STEPS}
              </p>
              <p className="text-sm font-semibold">{stepLabels[currentStep]}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {/* Step 0: Welcome */}
          {currentStep === 0 && (
            <div className="space-y-4 text-center">
              <DialogHeader>
                <DialogTitle className="text-xl">Welcome to HALO Business Finance Academy</DialogTitle>
                <DialogDescription className="mt-2">
                  Let's personalize your learning experience in under a minute. We'll recommend courses based on your role, experience, and goals.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: Briefcase, label: '42 Courses' },
                  { icon: Trophy, label: 'Certifications' },
                  { icon: Target, label: 'Personalized' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="p-3 rounded-lg bg-muted/50 text-center">
                    <Icon className="h-5 w-5 mx-auto mb-1 text-primary" />
                    <p className="text-xs font-medium text-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Role */}
          {currentStep === 1 && (
            <div className="space-y-3">
              <DialogHeader>
                <DialogTitle className="text-lg">What's your current role?</DialogTitle>
                <DialogDescription>We'll tailor course recommendations to your position.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 mt-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;
                  return (
                    <Card
                      key={role.id}
                      className={`p-3 cursor-pointer transition-all duration-200 border-2 ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => setSelectedRole(role.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground">{role.label}</p>
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

          {/* Step 2: Experience Level */}
          {currentStep === 2 && (
            <div className="space-y-3">
              <DialogHeader>
                <DialogTitle className="text-lg">How experienced are you?</DialogTitle>
                <DialogDescription>This helps us set the right difficulty level for your courses.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 mt-3">
                {experienceLevels.map((level) => {
                  const Icon = level.icon;
                  const isSelected = selectedExperience === level.id;
                  return (
                    <Card
                      key={level.id}
                      className={`p-4 cursor-pointer transition-all duration-200 border-2 ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => setSelectedExperience(level.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-primary/10' : 'bg-muted'
                        }`}>
                          <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-foreground">{level.label}</p>
                          <p className="text-xs text-muted-foreground">{level.description}</p>
                        </div>
                        {isSelected && <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />}
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Skill confidence quick-check */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-semibold text-foreground mb-3">Rate your confidence (optional)</p>
                <div className="space-y-2.5">
                  {skillConfidenceAreas.map((area) => (
                    <div key={area.id} className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{area.label}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <button
                            key={level}
                            onClick={() => setConfidence(area.id, level)}
                            className={`w-6 h-6 rounded text-xs font-medium transition-colors ${
                              (skillConfidence[area.id] || 0) >= level
                                ? 'bg-halo-navy text-white'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Goals */}
          {currentStep === 3 && (
            <div className="space-y-3">
              <DialogHeader>
                <DialogTitle className="text-lg">What are your learning goals?</DialogTitle>
                <DialogDescription>Select all that apply. We'll prioritize accordingly.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-2 mt-3">
                {goals.map((goal) => {
                  const Icon = goal.icon;
                  const isSelected = selectedGoals.includes(goal.id);
                  return (
                    <Card
                      key={goal.id}
                      className={`p-3 cursor-pointer transition-all duration-200 border-2 ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'
                      }`}
                      onClick={() => toggleGoal(goal.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 flex-shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <p className="font-medium text-sm flex-1 text-foreground">{goal.label}</p>
                        {isSelected && <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Personalized Path */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle className="text-lg text-center">Your Personalized Learning Path</DialogTitle>
                <DialogDescription className="text-center">
                  Based on your profile, we recommend starting at the <strong>{recommendedLevel}</strong> level.
                </DialogDescription>
              </DialogHeader>

              {recommended.length > 0 ? (
                <div className="grid gap-2.5 mt-3">
                  {recommended.map((course, idx) => (
                    <Card key={idx} className="p-3 border border-primary/20 bg-primary/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-halo-navy flex items-center justify-center text-white font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm text-foreground">{course}</p>
                          <p className="text-xs text-muted-foreground">{recommendedLevel} · Self-Paced</p>
                        </div>
                        <Trophy className="h-4 w-4 text-halo-orange" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Go back and select a role to see personalized recommendations.
                </p>
              )}

              <p className="text-xs text-muted-foreground text-center">
                You can always explore all 42 courses from your dashboard.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 0} className="gap-1">
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="gap-1 bg-halo-navy hover:bg-halo-navy/90 text-white"
          >
            {currentStep === TOTAL_STEPS - 1 ? (
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
