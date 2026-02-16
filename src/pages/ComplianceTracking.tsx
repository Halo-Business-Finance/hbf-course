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
  AlertTriangle, Calendar, CheckCircle, Clock, Download, 
  Shield, Users, Bell, Target, FileCheck 
} from 'lucide-react';

const complianceRequirements = [
  {
    id: '1',
    title: 'Annual SBA Compliance Training',
    description: 'Required annual training on SBA lending regulations and procedures',
    deadline: '2026-03-31',
    assignedTo: 12,
    completed: 8,
    status: 'on_track',
    priority: 'high',
    regulation: 'SBA SOP 50 10 7',
  },
  {
    id: '2',
    title: 'Anti-Money Laundering (AML) Certification',
    description: 'Bank Secrecy Act and AML compliance requirements',
    deadline: '2026-02-28',
    assignedTo: 15,
    completed: 11,
    status: 'urgent',
    priority: 'critical',
    regulation: 'BSA/AML',
  },
  {
    id: '3',
    title: 'Fair Lending Practices',
    description: 'Equal Credit Opportunity Act and fair lending compliance',
    deadline: '2026-06-30',
    assignedTo: 15,
    completed: 3,
    status: 'on_track',
    priority: 'medium',
    regulation: 'ECOA / Reg B',
  },
  {
    id: '4',
    title: 'Data Privacy & Security Awareness',
    description: 'GLBA and data protection requirements for financial institutions',
    deadline: '2026-04-15',
    assignedTo: 15,
    completed: 0,
    status: 'not_started',
    priority: 'high',
    regulation: 'GLBA',
  },
  {
    id: '5',
    title: 'CRA Community Reinvestment',
    description: 'Community Reinvestment Act training for lending officers',
    deadline: '2026-09-30',
    assignedTo: 8,
    completed: 0,
    status: 'scheduled',
    priority: 'low',
    regulation: 'CRA',
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'on_track': return <Badge className="bg-accent/10 text-accent border-accent/20">On Track</Badge>;
    case 'urgent': return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Urgent</Badge>;
    case 'not_started': return <Badge className="bg-halo-orange/10 text-halo-orange border-halo-orange/20">Not Started</Badge>;
    case 'completed': return <Badge className="bg-primary/10 text-primary border-primary/20">Completed</Badge>;
    case 'scheduled': return <Badge className="bg-muted text-muted-foreground border-border">Scheduled</Badge>;
    default: return null;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'critical': return <Badge variant="destructive" className="text-xs">Critical</Badge>;
    case 'high': return <Badge className="bg-halo-orange/10 text-halo-orange border-halo-orange/20 text-xs">High</Badge>;
    case 'medium': return <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">Medium</Badge>;
    case 'low': return <Badge variant="outline" className="text-xs">Low</Badge>;
    default: return null;
  }
};

export default function ComplianceTracking() {
  const [exportLoading, setExportLoading] = useState(false);

  const handleExport = () => {
    setExportLoading(true);
    const headers = ['Requirement', 'Regulation', 'Deadline', 'Assigned', 'Completed', 'Status', 'Priority'];
    const rows = complianceRequirements.map(r => [
      r.title, r.regulation, r.deadline, r.assignedTo, r.completed, r.status, r.priority
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportLoading(false);
  };

  const totalAssigned = complianceRequirements.reduce((sum, r) => sum + r.assignedTo, 0);
  const totalCompleted = complianceRequirements.reduce((sum, r) => sum + r.completed, 0);
  const overallRate = Math.round((totalCompleted / totalAssigned) * 100);
  const urgentCount = complianceRequirements.filter(r => r.status === 'urgent').length;

  return (
    <>
      <SEOHead
        title="Compliance Tracking | FinPilot LMS"
        description="Track mandatory training compliance, deadlines, and audit-ready reports."
        keywords="compliance tracking, mandatory training, regulatory compliance, audit reports"
      />
      
      <div className="min-h-screen bg-background">
        <HorizontalNav />
        
        <main className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                Compliance Tracking
              </h1>
              <p className="text-muted-foreground mt-1">Mandatory training assignments, deadlines, and audit reports</p>
            </div>
            <Button onClick={handleExport} disabled={exportLoading} className="gap-2">
              <Download className="h-4 w-4" />
              Export Audit Report
            </Button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Overall Compliance', value: `${overallRate}%`, icon: Shield, color: overallRate >= 80 ? 'text-accent' : 'text-halo-orange' },
              { label: 'Requirements', value: complianceRequirements.length, icon: FileCheck, color: 'text-primary' },
              { label: 'Urgent Items', value: urgentCount, icon: AlertTriangle, color: urgentCount > 0 ? 'text-destructive' : 'text-accent' },
              { label: 'Completions', value: `${totalCompleted}/${totalAssigned}`, icon: CheckCircle, color: 'text-primary' },
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

          {/* Requirements List */}
          <div className="space-y-4">
            {complianceRequirements.map(req => {
              const completionRate = Math.round((req.completed / req.assignedTo) * 100);
              const daysUntilDeadline = Math.ceil((new Date(req.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              
              return (
                <Card key={req.id} className="border border-border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{req.title}</h3>
                          {getStatusBadge(req.status)}
                          {getPriorityBadge(req.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{req.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileCheck className="h-3.5 w-3.5" />
                            {req.regulation}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            Due {new Date(req.deadline).toLocaleDateString()}
                            {daysUntilDeadline > 0 && daysUntilDeadline <= 30 && (
                              <span className="text-destructive font-medium ml-1">({daysUntilDeadline}d left)</span>
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5" />
                            {req.assignedTo} assigned
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <Bell className="h-3.5 w-3.5" />
                          Send Reminder
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={completionRate} className="h-2 flex-1" />
                      <span className="text-sm font-medium text-foreground w-24 text-right">
                        {req.completed}/{req.assignedTo} complete
                      </span>
                    </div>
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
