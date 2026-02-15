import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, Loader2 } from "lucide-react";
import { CertificateViewer } from "@/components/CertificateViewer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SEOHead } from "@/components/SEOHead";

const Certificate = () => {
  const { certificateId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    const fetchCertificate = async () => {
      if (!certificateId) return;

      try {
        const { data, error } = await supabase
          .from("certificates")
          .select("*")
          .eq("id", certificateId)
          .maybeSingle();

        if (error || !data) {
          console.error("Error fetching certificate:", error);
          setLoading(false);
          return;
        }

        setCertificate(data);

        // Fetch course title
        const { data: course } = await supabase
          .from("courses")
          .select("title")
          .eq("id", data.course_id)
          .maybeSingle();

        if (course) {
          setCertificate((prev: any) => ({ ...prev, course_title: course.title }));
        }

        // Fetch user name
        if (data.user_id) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("user_id", data.user_id)
            .maybeSingle();

          if (profile?.name) {
            setUserName(profile.name);
          }
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificate();
  }, [certificateId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Certificate Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This certificate could not be found or has been revoked.
            </p>
            <Button onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={`Certificate - ${certificate.course_title || "Course Completion"}`}
        description="View your HALO Business Finance Academy certificate of completion."
      />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/achievements")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Achievements
        </Button>

        <CertificateViewer
          userName={userName}
          courseTitle={certificate.course_title || "Business Finance Course"}
          completionDate={certificate.issued_at}
          certificateNumber={certificate.certificate_number}
          finalScore={certificate.final_score}
          completionPercentage={certificate.completion_percentage}
        />
      </div>
    </div>
  );
};

export default Certificate;
