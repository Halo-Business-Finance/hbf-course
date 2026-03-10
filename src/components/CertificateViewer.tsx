import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Award, Share2, Printer, Linkedin, Copy, Check } from "lucide-react";
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
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date(completionDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const certificateUrl = `${window.location.origin}/certificate/${certificateNumber}`;

  const handlePrint = () => {
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
            .score-badge { display: inline-block; background: #c9a84c; color: white; padding: 4px 16px; border-radius: 4px; font-size: 13px; margin-top: 8px; }
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
              ${finalScore ? `<div class="score-badge">Score: ${finalScore}%</div>` : ''}
            </div>
            <div class="details">
              <div class="detail-item">
                <div class="detail-label">Date</div>
                <div class="detail-value">${formattedDate}</div>
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

  const handleDownloadPDF = () => {
    // Use print-to-PDF via browser's print dialog (Save as PDF option)
    handlePrint();
    toast({
      title: "Download Certificate",
      description: "Use your browser's 'Save as PDF' option in the print dialog to download.",
    });
  };

  const handleShareLinkedIn = () => {
    const text = encodeURIComponent(
      `I just completed "${courseTitle}" at HALO Business Finance Academy! Certificate #${certificateNumber}`
    );
    const url = encodeURIComponent(certificateUrl);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${text}`,
      '_blank',
      'width=600,height=500'
    );
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(certificateUrl);
      setCopied(true);
      toast({ title: "Link copied", description: "Certificate link copied to clipboard." });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Copy failed", description: "Could not copy link to clipboard.", variant: "destructive" });
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `Certificate of Completion - ${courseTitle}`,
      text: `I just completed ${courseTitle} at HALO Business Finance Academy!`,
      url: certificateUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        handleCopyLink();
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
        className="relative bg-white border-[3px] border-halo-navy p-8 md:p-12 mx-auto max-w-3xl"
      >
        <div className="absolute inset-2 border border-accent-foreground/40 pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-halo-navy tracking-[0.2em]" style={{ fontFamily: "'Playfair Display', serif" }}>
            HALO
          </h1>
          <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-accent-foreground mt-1">
            Business Finance Academy
          </p>
        </div>

        <div className="w-32 h-0.5 mx-auto mb-8 bg-gradient-to-r from-transparent via-accent-foreground to-transparent" />

        {/* Title */}
        <div className="text-center relative z-10">
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-2">This certifies that</p>
          <h2 className="text-2xl md:text-3xl font-bold text-halo-navy mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Certificate of Completion
          </h2>
        </div>

        {/* Recipient */}
        <div className="text-center mb-6 relative z-10">
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-2">Awarded to</p>
          <p className="text-2xl md:text-3xl text-halo-navy inline-block border-b-2 border-accent-foreground pb-1 px-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {userName}
          </p>
        </div>

        {/* Course */}
        <div className="text-center mb-8 relative z-10">
          <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">Has successfully completed</p>
          <p className="text-lg font-semibold text-halo-navy">{courseTitle}</p>
          {finalScore && (
            <Badge className="mt-2 bg-accent-foreground text-white">Score: {finalScore}%</Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end pt-6 border-t border-border relative z-10">
          <div className="text-center">
            <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground">Date</p>
            <p className="text-sm font-semibold text-halo-navy">{formattedDate}</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full border-2 border-accent-foreground flex items-center justify-center">
              <Award className="h-6 w-6 text-accent-foreground" />
            </div>
            <p className="text-[8px] tracking-[0.1em] uppercase text-accent-foreground mt-1 font-semibold">Verified</p>
          </div>
          <div className="text-center">
            <p className="text-[9px] tracking-[0.15em] uppercase text-muted-foreground">Certificate No.</p>
            <p className="text-sm font-semibold text-halo-navy">{certificateNumber}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={handleDownloadPDF} className="gap-2 bg-halo-navy hover:bg-halo-navy/90 text-white">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
        <Button onClick={handleShareLinkedIn} variant="outline" className="gap-2 border-[#0077B5] text-[#0077B5] hover:bg-[#0077B5]/10">
          <Linkedin className="h-4 w-4" />
          Share on LinkedIn
        </Button>
        <Button onClick={handlePrint} variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          Print
        </Button>
        <Button onClick={handleShare} variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
        <Button onClick={handleCopyLink} variant="outline" className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy Link"}
        </Button>
      </div>
    </div>
  );
};
