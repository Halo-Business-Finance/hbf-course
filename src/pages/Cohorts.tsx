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
  Users, Plus, Calendar, Target, Trophy, BookOpen, 
  Clock, CheckCircle, AlertTriangle, Settings 
} from 'lucide-react';

const mockCohorts = [
  {
    id: '1',
    name: 'Q1 2026 New Hires',
    description: 'Onboarding cohort for January new hires',
    members: 8,
    courses: ['SBA 7(a)', 'Commercial Real Estate'],
    deadline: '2026-03-31',
    progress: 42,
    status: 'active',
  },
  {
    id: '2',
    name: 'Credit Analyst Certification',
    description: 'Advanced certification track for credit team',
    members: 5,
    courses: ['Asset-Based Lending', 'Business Acquisition', 'Equipment Financing'],
    deadline: '2026-06-30',
    progress: 78,
    status: 'active',
  },
  {
    id: '3',
    name: 'Compliance Refresher 2026',
    description: 'Annual mandatory compliance training',
    members: 15,
    courses: ['SBA 7(a)', 'SBA Express'],
    deadline: '2026-02-28',
    progress: 65,
    status: 'urgent',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active': return <Badge className="bg-accent/10 text-accent border-accent/20">Active</Badge>;
    case 'urgent': return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Urgent</Badge>;
    case 'completed': return <Badge className="bg-primary/10 text-primary border-primary/20">Completed</Badge>;
    default: return null;
  }
};

export default function Cohorts() {
  return (
    <>
      <SEOHead
        title="Learning Cohorts | FinPilot LMS"
        description="Manage team-based learning paths with group deadlines and manager oversight."
        keywords="learning cohorts, team training, group learning, manager oversight"
      />
      
      <div className="min-h-screen bg-background">
        <HorizontalNav />
        
        <main className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Learning Cohorts</h1>
              <p className="text-muted-foreground mt-1">Organize team-based learning with shared goals and deadlines</p>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Cohort
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Active Cohorts', value: 3, icon: Users, color: 'text-primary' },
              { label: 'Total Members', value: 28, icon: Target, color: 'text-accent' },
              { label: 'Avg Progress', value: '62%', icon: Trophy, color: 'text-halo-orange' },
              { label: 'Due This Month', value: 1, icon: AlertTriangle, color: 'text-destructive' },
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

          {/* Cohort Cards */}
          <div className="space-y-6">
            {mockCohorts.map(cohort => (
              <Card key={cohort.id} className="border border-border hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{cohort.name}</CardTitle>
                        {getStatusBadge(cohort.status)}
                      </div>
                      <CardDescription>{cohort.description}</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <Settings className="h-3.5 w-3.5" />
                      Manage
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">{cohort.members} members</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">{cohort.courses.length} courses</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">Due {new Date(cohort.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground font-medium">{cohort.progress}% complete</span>
                    </div>
                  </div>
                  
                  <Progress value={cohort.progress} className="h-2 mb-3" />
                  
                  <div className="flex flex-wrap gap-2">
                    {cohort.courses.map((course, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
        
        <FinPilotBrandFooter />
      </div>
    </>
  );
}
