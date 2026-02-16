import { useState } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { HorizontalNav } from '@/components/HorizontalNav';
import { FinPilotBrandFooter } from '@/components/FinPilotBrandFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Palette, Upload, Building2, FileText, CheckCircle, 
  Image, Type, Globe, Settings 
} from 'lucide-react';

export default function Branding() {
  const [companyName, setCompanyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#1a365d');
  const [accentColor, setAccentColor] = useState('#e8590c');

  return (
    <>
      <SEOHead
        title="Enterprise Branding | FinPilot LMS"
        description="Customize your LMS with company branding, colors, and white-label settings."
        keywords="enterprise branding, white label, custom theme, company branding"
      />
      
      <div className="min-h-screen bg-background">
        <HorizontalNav />
        
        <main className="container mx-auto px-4 py-8 pt-24 max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              Enterprise Branding
            </h1>
            <p className="text-muted-foreground mt-1">Customize your LMS with your company's brand identity</p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full max-w-lg grid-cols-4 mb-6">
              <TabsTrigger value="general" className="gap-1.5 text-xs"><Building2 className="h-3.5 w-3.5" />General</TabsTrigger>
              <TabsTrigger value="colors" className="gap-1.5 text-xs"><Palette className="h-3.5 w-3.5" />Colors</TabsTrigger>
              <TabsTrigger value="assets" className="gap-1.5 text-xs"><Image className="h-3.5 w-3.5" />Assets</TabsTrigger>
              <TabsTrigger value="certificates" className="gap-1.5 text-xs"><FileText className="h-3.5 w-3.5" />Certificates</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>Company Information</CardTitle>
                  <CardDescription>Set your company name and branding details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input 
                        id="companyName" 
                        value={companyName} 
                        onChange={e => setCompanyName(e.target.value)}
                        placeholder="Acme Financial Services" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input 
                        id="tagline" 
                        value={tagline} 
                        onChange={e => setTagline(e.target.value)}
                        placeholder="Empowering Financial Excellence" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Custom Domain</Label>
                    <Input id="domain" placeholder="learn.acmefinancial.com" />
                    <p className="text-xs text-muted-foreground">Point your domain's CNAME record to our servers</p>
                  </div>
                  <Button className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="colors">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Colors</CardTitle>
                  <CardDescription>Customize the platform colors to match your brand</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={primaryColor} 
                          onChange={e => setPrimaryColor(e.target.value)}
                          className="w-12 h-10 rounded border border-border cursor-pointer"
                        />
                        <Input value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="flex-1" />
                      </div>
                      <p className="text-xs text-muted-foreground">Used for navigation, buttons, and primary actions</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Accent Color</Label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={accentColor} 
                          onChange={e => setAccentColor(e.target.value)}
                          className="w-12 h-10 rounded border border-border cursor-pointer"
                        />
                        <Input value={accentColor} onChange={e => setAccentColor(e.target.value)} className="flex-1" />
                      </div>
                      <p className="text-xs text-muted-foreground">Used for CTAs, highlights, and success states</p>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="p-6 rounded-lg border border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Preview</p>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded flex items-center justify-center text-white font-bold" style={{ backgroundColor: primaryColor }}>
                        {companyName ? companyName[0] : 'A'}
                      </div>
                      <span className="font-bold text-lg" style={{ color: primaryColor }}>
                        {companyName || 'Your Company'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 rounded text-white text-sm font-medium" style={{ backgroundColor: primaryColor }}>
                        Primary Button
                      </button>
                      <button className="px-4 py-2 rounded text-white text-sm font-medium" style={{ backgroundColor: accentColor }}>
                        Accent Button
                      </button>
                    </div>
                  </div>
                  
                  <Button className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Apply Colors
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assets">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Assets</CardTitle>
                  <CardDescription>Upload your company logo and favicon</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-3">
                      <Label>Company Logo</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Drop your logo here or click to upload</p>
                        <p className="text-xs text-muted-foreground mt-1">SVG, PNG or JPG (max 2MB)</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label>Favicon</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Drop your favicon here or click to upload</p>
                        <p className="text-xs text-muted-foreground mt-1">ICO, PNG or SVG (32x32px)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Login Page Background</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/30 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Upload a custom login background image</p>
                      <p className="text-xs text-muted-foreground mt-1">JPG or PNG (1920x1080 recommended)</p>
                    </div>
                  </div>
                  
                  <Button className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Save Assets
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certificates">
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Branding</CardTitle>
                  <CardDescription>Customize completion certificates with your company brand</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Certificate Title</Label>
                      <Input placeholder="Certificate of Completion" />
                    </div>
                    <div className="space-y-2">
                      <Label>Signatory Name</Label>
                      <Input placeholder="John Smith, VP of Training" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Text</Label>
                    <Textarea placeholder="This certifies that the above-named individual has successfully completed..." rows={3} />
                  </div>
                  <div className="p-6 rounded-lg border border-border bg-muted/30">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Certificate Preview</p>
                    <div className="bg-card p-8 rounded border border-border text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-1">Certificate of Completion</h3>
                      <p className="text-sm text-muted-foreground mb-4">{companyName || 'Your Company'}</p>
                      <p className="text-xs text-muted-foreground">This is a preview of how your branded certificate will appear</p>
                    </div>
                  </div>
                  <Button className="gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Save Certificate Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        
        <FinPilotBrandFooter />
      </div>
    </>
  );
}
