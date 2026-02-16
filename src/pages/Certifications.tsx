import { useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { HorizontalNav } from '@/components/HorizontalNav';
import { FinPilotBrandFooter } from '@/components/FinPilotBrandFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Award, Share2, Trophy, Star, Target, BookOpen, 
  CheckCircle, Linkedin, ExternalLink, Lock 
} from 'lucide-react';

const specializations = [
  {
    id: 'sba_expert',
    name: 'SBA Lending Expert',
    description: 'Master all SBA lending programs including 7(a), Express, and 504',
    courses: ['SBA 7(a)', 'SBA Express'],
    totalModules: 14,
    completedModules: 10,
    badgeColor: 'from-primary to-halo-navy',
    icon: '🏛️',
    earned: false,
  },
  {
    id: 'cre_specialist',
    name: 'CRE Specialist',
    description: 'Expertise in commercial real estate and construction lending',
    courses: ['Commercial Real Estate', 'Construction Loans', 'Bridge Loans'],
    totalModules: 21,
    completedModules: 21,
    badgeColor: 'from-halo-orange to-orange-600',
    icon: '🏢',
    earned: true,
    earnedDate: '2026-01-15',
  },
  {
    id: 'credit_master',
    name: 'Credit Analysis Master',
    description: 'Advanced credit analysis and risk assessment proficiency',
    courses: ['Asset-Based Lending', 'Business Acquisition', 'Equipment Financing'],
    totalModules: 21,
    completedModules: 7,
    badgeColor: 'from-accent to-green-600',
    icon: '📊',
    earned: false,
  },
  {
    id: 'working_capital_pro',
    name: 'Working Capital Pro',
    description: 'Master working capital products and cash flow management',
    courses: ['Working Capital', 'Business Lines of Credit', 'Invoice Factoring'],
    totalModules: 21,
    completedModules: 0,
    badgeColor: 'from-purple-500 to-purple-700',
    icon: '💰',
    earned: false,
  },
];

export default function Certifications() {
  return (
    <>
      <SEOHead
        title="Micro-Certifications | FinPilot LMS"
        description="Earn shareable digital badges and micro-certifications for completing specialization tracks."
        keywords="micro certifications, digital badges, LinkedIn badges, professional credentials"
      />
      
      <div className="min-h-screen bg-background">
        <HorizontalNav />
        
        <main className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Award className="h-8 w-8 text-halo-orange" />
              Micro-Certifications
            </h1>
            <p className="text-muted-foreground mt-1">
              Earn industry-recognized digital badges by completing specialization tracks
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Available', value: specializations.length, icon: Target, color: 'text-primary' },
              { label: 'Earned', value: specializations.filter(s => s.earned).length, icon: Trophy, color: 'text-halo-orange' },
              { label: 'In Progress', value: specializations.filter(s => !s.earned && s.completedModules > 0).length, icon: BookOpen, color: 'text-accent' },
              { label: 'Not Started', value: specializations.filter(s => s.completedModules === 0).length, icon: Lock, color: 'text-muted-foreground' },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card key={idx} className="border border-border">
                  <CardContent className="p-4 text-center">
                    <Icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Specialization Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {specializations.map(spec => {
              const progressPercent = Math.round((spec.completedModules / spec.totalModules) * 100);
              
              return (
                <Card key={spec.id} className={`border-2 transition-all duration-300 ${
                  spec.earned 
                    ? 'border-halo-orange/30 bg-halo-orange/5' 
                    : 'border-border hover:border-primary/20'
                }`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${spec.badgeColor} flex items-center justify-center text-2xl shadow-md`}>
                          {spec.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{spec.name}</CardTitle>
                          <CardDescription className="text-sm">{spec.description}</CardDescription>
                        </div>
                      </div>
                      {spec.earned && (
                        <Badge className="bg-halo-orange/10 text-halo-orange border-halo-orange/20 gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Earned
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Required Courses */}
                    <div className="flex flex-wrap gap-2">
                      {spec.courses.map((course, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {course}
                        </Badge>
                      ))}
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-muted-foreground">
                          {spec.completedModules}/{spec.totalModules} modules
                        </span>
                        <span className="text-sm font-medium text-foreground">{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {spec.earned ? (
                        <>
                          <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                            <Share2 className="h-3.5 w-3.5" />
                            Share Badge
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Linkedin className="h-3.5 w-3.5" />
                            Add to LinkedIn
                          </Button>
                        </>
                      ) : spec.completedModules > 0 ? (
                        <Button size="sm" className="flex-1 gap-1.5">
                          <BookOpen className="h-3.5 w-3.5" />
                          Continue Learning
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="flex-1 gap-1.5">
                          <Star className="h-3.5 w-3.5" />
                          Start Track
                        </Button>
                      )}
                    </div>

                    {spec.earned && spec.earnedDate && (
                      <p className="text-xs text-muted-foreground text-center">
                        Earned on {new Date(spec.earnedDate).toLocaleDateString()}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </main>
        
        <FinPilotBrandFooter />
      </div>
    </>
  );
}
