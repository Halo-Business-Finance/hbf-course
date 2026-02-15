import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Award, Share2, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CertificateViewerProps {
  userName: string;
  courseTitle: string;
  completionDate: string;
  certificateNumber: string;
  finalScore?: number;
  completionPercentage?: number;
}

export const CertificateViewer = ({
  userName,
  courseTitle,
  completionDate,
  certificateNumber,
  finalScore,
  completionPercentage = 100,
}: CertificateViewerProps) => {
  const { toast } = useToast();
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = certificateRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Certificate - ${courseTitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;600&display=swap');
            body { margin: 0; padding: 40px; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: white; }
            .certificate { width: 800px; padding: 60px; border: 3px solid #0a1628; position: relative; font-family: 'Inter', sans-serif; }
            .certificate::before { content: ''; position: absolute; top: 8px; left: 8px; right: 8px; bottom: 8px; border: 1px solid #c9a84c; pointer-events: none; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo-text { font-family: 'Playfair Display', serif; font-size: 28px; color: #0a1628; letter-spacing: 3px; font-weight: 700; }
            .subtitle { font-size: 11px; letter-spacing: 6px; text-transform: uppercase; color: #c9a84c; margin-top: 8px; }
            .divider { width: 120px; height: 2px; background: linear-gradient(90deg, transparent, #c9a84c, transparent); margin: 30px auto; }
            .presents { font-size: 13px; color: #666; letter-spacing: 4px; text-transform: uppercase; text-align: center; }
            .cert-title { font-family: 'Playfair Display', serif; font-size: 36px; color: #0a1628; text-align: center; margin: 20px 0; font-weight: 700; }
            .recipient { text-align: center; margin: 30px 0; }
            .recipient-label { font-size: 12px; color: #888; letter-spacing: 3px; text-transform: uppercase; }
            .recipient-name { font-family: 'Playfair Display', serif; font-size: 30px; color: #0a1628; margin: 10px 0; border-bottom: 2px solid #c9a84c; display: inline-block; padding-bottom: 5px; }
            .course-info { text-align: center; margin: 30px 0; }
            .course-label { font-size: 12px; color: #888; letter-spacing: 2px; text-transform: uppercase; }
            .course-name { font-size: 18px; color: #0a1628; font-weight: 600; margin: 8px 0; }
            .details { display: flex; justify-content: space-between; margin-top: 50px; padding-top: 30px; border-top: 1px solid #e5e7eb; }
            .detail-item { text-align: center; }
            .detail-label { font-size: 10px; color: #888; letter-spacing: 2px; text-transform: uppercase; }
            .detail-value { font-size: 14px; color: #0a1628; font-weight: 600; margin-top: 4px; }
            .seal { width: 80px; height: 80px; border-radius: 50%; border: 2px solid #c9a84c; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
            .seal-text { font-size: 10px; color: #c9a84c; text-align: center; letter-spacing: 1px; text-transform: uppercase; font-weight: 600; }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <div class="logo-text">HALO</div>
              <div class="subtitle">Business Finance Academy</div>
            </div>
            <div class="divider"></div>
            <div class="presents">This certifies that</div>
            <div class="cert-title">Certificate of Completion</div>
            <div class="recipient">
              <div class="recipient-label">Awarded to</div>
              <div class="recipient-name">${userName}</div>
            </div>
            <div class="course-info">
              <div class="course-label">Has successfully completed</div>
              <div class="course-name">${courseTitle}</div>
            </div>
            <div class="details">
              <div class="detail-item">
                <div class="detail-label">Date</div>
                <div class="detail-value">${new Date(completionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              </div>
              <div class="detail-item">
                <div class="seal">
                  <div class="seal-text">Verified<br/>✓</div>
                </div>
              </div>
              <div class="detail-item">
                <div class="detail-label">Certificate No.</div>
                <div class="detail-value">${certificateNumber}</div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleShare = async () => {
    const shareData = {
      title: `Certificate of Completion - ${courseTitle}`,
      text: `I just completed ${courseTitle} at HALO Business Finance Academy!`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          `I just completed ${courseTitle} at HALO Business Finance Academy! Certificate #${certificateNumber}`
        );
        toast({
          title: "Copied to clipboard",
          description: "Certificate details copied. Share it on your social media!",
        });
      }
    } catch {
      // User cancelled share
    }
  };

  return (
    <div className="space-y-6">
      {/* Certificate Display */}
      <div
        ref={certificateRef}
        className="relative bg-white border-[3px] border-[#0a1628] p-8 md:p-12 mx-auto max-w-3xl"
      >
        {/* Inner border */}
        <div className="absolute inset-2 border border-[#c9a84c] pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0a1628] tracking-[0.2em]" style={{ fontFamily: "'Playfair Display', serif" }}>
            HALO
          </h1>
          <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#c9a84c] mt-1">
            Business Finance Academy
          </p>
        </div>

        {/* Divider */}
        <div className="w-32 h-0.5 mx-auto mb-8 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

        {/* Certificate Title */}
        <div className="text-center relative z-10">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-2">
            This certifies that
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#0a1628] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Certificate of Completion
          </h2>
        </div>

        {/* Recipient */}
        <div className="text-center mb-6 relative z-10">
          <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-2">
            Awarded to
          </p>
          <p
            className="text-2xl md:text-3xl text-[#0a1628] inline-block border-b-2 border-[#c9a84c] pb-1 px-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {userName}
          </p>
        </div>

        {/* Course Info */}
        <div className="text-center mb-8 relative z-10">
          <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-1">
            Has successfully completed
          </p>
          <p className="text-lg font-semibold text-[#0a1628]">{courseTitle}</p>
          {finalScore && (
            <Badge className="mt-2 bg-[#c9a84c] text-white">
              Score: {finalScore}%
            </Badge>
          )}
        </div>

        {/* Footer Details */}
        <div className="flex justify-between items-end pt-6 border-t border-gray-200 relative z-10">
          <div className="text-center">
            <p className="text-[9px] tracking-[0.15em] uppercase text-gray-400">Date</p>
            <p className="text-sm font-semibold text-[#0a1628]">
              {new Date(completionDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-2 border-[#c9a84c] flex items-center justify-center">
              <Award className="h-6 w-6 text-[#c9a84c]" />
            </div>
            <p className="text-[8px] tracking-[0.1em] uppercase text-[#c9a84c] mt-1 font-semibold">
              Verified
            </p>
          </div>
          <div className="text-center">
            <p className="text-[9px] tracking-[0.15em] uppercase text-gray-400">Certificate No.</p>
            <p className="text-sm font-semibold text-[#0a1628]">{certificateNumber}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={handlePrint} variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          Print Certificate
        </Button>
        <Button onClick={handleShare} variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
};
