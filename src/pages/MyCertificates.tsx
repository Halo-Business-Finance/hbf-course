import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Share2, Linkedin, ExternalLink, Loader2, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";
import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/PageTransition";
import { motion } from "framer-motion";

interface CertificateRecord {
  id: string;
  course_id: string;
  certificate_number: string;
  issued_at: string;
  final_score: number | null;
  completion_percentage: number;
  course_title?: string;
}

export default function MyCertificates() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: certs, error } = await supabase
        .from("certificates")
        .select("id, course_id, certificate_number, issued_at, final_score, completion_percentage")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false });

      if (error) {
        console.error("Error fetching certificates:", error);
        setLoading(false);
        return;
      }

      if (!certs?.length) {
        setCertificates([]);
        setLoading(false);
        return;
      }

      // Fetch course titles
      const courseIds = [...new Set(certs.map((c) => c.course_id))];
      const { data: courses } = await supabase
        .from("courses")
        .select("id, title")
        .in("id", courseIds);

      const courseMap = new Map(courses?.map((c) => [c.id, c.title]) || []);

      setCertificates(
        certs.map((cert) => ({
          ...cert,
          course_title: courseMap.get(cert.course_id) || "Business Finance Course",
        }))
      );
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleShareLinkedIn = (cert: CertificateRecord) => {
    const url = encodeURIComponent(`${window.location.origin}/certificate/${cert.id}`);
    const text = encodeURIComponent(
      `I completed "${cert.course_title}" at HALO Business Finance Academy! Certificate #${cert.certificate_number}`
    );
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,
      "_blank",
      "width=600,height=500"
    );
  };

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
        title="My Certificates | FinPilot Business Finance Academy"
        description="View and share your earned certificates from HALO Business Finance Academy."
      />

      <div className="min-h-screen bg-background">
        <PageHeader
          title="My Certificates"
          subtitle={certificates.length === 0
            ? "Complete a course to earn your first certificate"
            : `${certificates.length} certificate${certificates.length !== 1 ? "s" : ""} earned`}
          icon={<Award className="h-5 w-5 text-white" />}
        />
        <div className="container mx-auto px-4 py-8 max-w-5xl">

          {certificates.length === 0 ? (
            <AnimatedSection>
              <Card className="border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <Award className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h2 className="text-xl font-semibold text-foreground mb-2">No Certificates Yet</h2>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    Complete all modules in a course to earn a professional certificate you can share on LinkedIn and add to your resume.
                  </p>
                  <Button
                    onClick={() => navigate("/dashboard")}
                    className="bg-halo-navy hover:bg-halo-navy/90 text-white gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Start Learning
                  </Button>
                </CardContent>
              </Card>
            </AnimatedSection>
          ) : (
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certificates.map((cert) => (
                <StaggerItem key={cert.id}>
                  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-2 border-transparent hover:border-halo-orange/20">
                      {/* Gold accent top */}
                      <div className="h-1.5 bg-gradient-to-r from-halo-navy via-accent-foreground to-halo-navy" />

                      <CardContent className="p-6">
                        {/* Certificate badge */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-accent/50 border-2 border-accent-foreground/30 flex items-center justify-center">
                              <Award className="h-6 w-6 text-accent-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground text-base leading-tight truncate">
                                {cert.course_title}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Issued {new Date(cert.issued_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-accent text-accent-foreground border-accent-foreground/20 text-xs shrink-0">
                            Verified
                          </Badge>
                        </div>

                        {/* Details */}
                        <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                          <span>Certificate #{cert.certificate_number}</span>
                          {cert.final_score && (
                            <span className="font-medium text-foreground">Score: {cert.final_score}%</span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => navigate(`/certificate/${cert.id}`)}
                            className="flex-1 bg-halo-navy hover:bg-halo-navy/90 text-white gap-1.5"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleShareLinkedIn(cert)}
                            className="gap-1.5 border-[#0077B5]/30 text-[#0077B5] hover:bg-[#0077B5]/10"
                          >
                            <Linkedin className="h-3.5 w-3.5" />
                            LinkedIn
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/certificate/${cert.id}`)}
                            className="gap-1.5"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>
      </div>
    </>
  );
}
