import { useState, useEffect, useCallback } from 'react';
import { SEOHead } from '@/components/SEOHead';
import { HorizontalNav } from '@/components/HorizontalNav';
import { FinPilotBrandFooter } from '@/components/FinPilotBrandFooter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Palette, Upload, Building2, FileText, CheckCircle, 
  Image, Loader2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type BrandingSettings = Record<string, string>;

export default function Branding() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<BrandingSettings>({
    company_name: '',
    tagline: '',
    custom_domain: '',
    primary_color: '#1a365d',
    accent_color: '#e8590c',
    certificate_title: 'Certificate of Completion',
    signatory_name: '',
    certificate_text: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('branding_settings')
          .select('setting_key, setting_value');

        if (error) {
          console.error('Error loading branding settings:', error);
          toast.error('Could not load branding settings. You may not have admin access.');
          setLoading(false);
          return;
        }

        if (data) {
          const loaded: BrandingSettings = { ...settings };
          data.forEach((row: { setting_key: string; setting_value: string }) => {
            loaded[row.setting_key] = row.setting_value;
          });
          setSettings(loaded);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) loadSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const saveSettings = useCallback(async (keys: string[], sectionLabel: string) => {
    if (!user) {
      toast.error('You must be logged in to save settings');
      return;
    }

    setSaving(sectionLabel);
    try {
      // Upsert each key
      for (const key of keys) {
        const { error } = await supabase
          .from('branding_settings')
          .update({ 
            setting_value: settings[key] || '', 
            updated_at: new Date().toISOString(),
            updated_by: user.id 
          })
          .eq('setting_key', key);

        if (error) {
          // Try insert if update didn't match
          const { error: insertErr } = await supabase
            .from('branding_settings')
            .insert({ 
              setting_key: key, 
              setting_value: settings[key] || '',
              updated_by: user.id 
            });
          if (insertErr) {
            console.error(`Error saving ${key}:`, insertErr);
            throw insertErr;
          }
        }
      }

      toast.success(`${sectionLabel} saved successfully`);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      toast.error(err?.message || 'Failed to save settings. Check admin permissions.');
    } finally {
      setSaving(null);
    }
  }, [settings, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
                        value={settings.company_name} 
                        onChange={e => updateSetting('company_name', e.target.value)}
                        placeholder="Acme Financial Services" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tagline">Tagline</Label>
                      <Input 
                        id="tagline" 
                        value={settings.tagline} 
                        onChange={e => updateSetting('tagline', e.target.value)}
                        placeholder="Empowering Financial Excellence" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Custom Domain</Label>
                    <Input 
                      id="domain" 
                      value={settings.custom_domain}
                      onChange={e => updateSetting('custom_domain', e.target.value)}
                      placeholder="learn.acmefinancial.com" 
                    />
                    <p className="text-xs text-muted-foreground">Point your domain's CNAME record to our servers</p>
                  </div>
                  <Button 
                    className="gap-2"
                    disabled={saving === 'General settings'}
                    onClick={() => saveSettings(['company_name', 'tagline', 'custom_domain'], 'General settings')}
                  >
                    {saving === 'General settings' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
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
                          value={settings.primary_color} 
                          onChange={e => updateSetting('primary_color', e.target.value)}
                          className="w-12 h-10 rounded border border-border cursor-pointer"
                        />
                        <Input value={settings.primary_color} onChange={e => updateSetting('primary_color', e.target.value)} className="flex-1" />
                      </div>
                      <p className="text-xs text-muted-foreground">Used for navigation, buttons, and primary actions</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Accent Color</Label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="color" 
                          value={settings.accent_color} 
                          onChange={e => updateSetting('accent_color', e.target.value)}
                          className="w-12 h-10 rounded border border-border cursor-pointer"
                        />
                        <Input value={settings.accent_color} onChange={e => updateSetting('accent_color', e.target.value)} className="flex-1" />
                      </div>
                      <p className="text-xs text-muted-foreground">Used for CTAs, highlights, and success states</p>
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="p-6 rounded-lg border border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Preview</p>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded flex items-center justify-center text-white font-bold" style={{ backgroundColor: settings.primary_color }}>
                        {settings.company_name ? settings.company_name[0] : 'A'}
                      </div>
                      <span className="font-bold text-lg" style={{ color: settings.primary_color }}>
                        {settings.company_name || 'Your Company'}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 rounded text-white text-sm font-medium" style={{ backgroundColor: settings.primary_color }}>
                        Primary Button
                      </button>
                      <button className="px-4 py-2 rounded text-white text-sm font-medium" style={{ backgroundColor: settings.accent_color }}>
                        Accent Button
                      </button>
                    </div>
                  </div>
                  
                  <Button 
                    className="gap-2"
                    disabled={saving === 'Brand colors'}
                    onClick={() => saveSettings(['primary_color', 'accent_color'], 'Brand colors')}
                  >
                    {saving === 'Brand colors' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
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
                  
                  <Button className="gap-2" disabled>
                    <CheckCircle className="h-4 w-4" />
                    Save Assets
                  </Button>
                  <p className="text-xs text-muted-foreground">Asset uploads coming soon</p>
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
                      <Input 
                        value={settings.certificate_title}
                        onChange={e => updateSetting('certificate_title', e.target.value)}
                        placeholder="Certificate of Completion" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Signatory Name</Label>
                      <Input 
                        value={settings.signatory_name}
                        onChange={e => updateSetting('signatory_name', e.target.value)}
                        placeholder="John Smith, VP of Training" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Text</Label>
                    <Textarea 
                      value={settings.certificate_text}
                      onChange={e => updateSetting('certificate_text', e.target.value)}
                      placeholder="This certifies that the above-named individual has successfully completed..." 
                      rows={3} 
                    />
                  </div>
                  <div className="p-6 rounded-lg border border-border bg-muted/30">
                    <p className="text-sm font-medium text-muted-foreground mb-3">Certificate Preview</p>
                    <div className="bg-card p-8 rounded border border-border text-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{settings.certificate_title || 'Certificate of Completion'}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{settings.company_name || 'Your Company'}</p>
                      {settings.signatory_name && (
                        <p className="text-xs text-muted-foreground italic">Signed by: {settings.signatory_name}</p>
                      )}
                    </div>
                  </div>
                  <Button 
                    className="gap-2"
                    disabled={saving === 'Certificate settings'}
                    onClick={() => saveSettings(['certificate_title', 'signatory_name', 'certificate_text'], 'Certificate settings')}
                  >
                    {saving === 'Certificate settings' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
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
