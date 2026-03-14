import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, Printer, Linkedin, Copy, Check } from "lucide-react";
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

  const printStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f8f7f4; font-family: 'Inter', sans-serif; }
    .cert-page { width: 900px; background: white; padding: 0; position: relative; box-shadow: 0 4px 30px rgba(0,0,0,0.08); }
    .cert-border { border: 2px solid #0a1628; margin: 12px; padding: 48px 56px; position: relative; }
    .cert-border::before { content: ''; position: absolute; top: 6px; left: 6px; right: 6px; bottom: 6px; border: 1px solid #b8975a; pointer-events: none; }
    .cert-corner { position: absolute; width: 40px; height: 40px; }
    .cert-corner svg { width: 100%; height: 100%; }
    .cert-corner.tl { top: -2px; left: -2px; }
    .cert-corner.tr { top: -2px; right: -2px; transform: rotate(90deg); }
    .cert-corner.bl { bottom: -2px; left: -2px; transform: rotate(-90deg); }
    .cert-corner.br { bottom: -2px; right: -2px; transform: rotate(180deg); }
    .cert-header { text-align: center; margin-bottom: 32px; }
    .cert-logo { font-family: 'Inter', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 8px; color: #0a1628; text-transform: uppercase; }
    .cert-logo-accent { display: block; font-size: 10px; letter-spacing: 5px; color: #b8975a; margin-top: 4px; font-weight: 500; }
    .cert-divider { width: 80px; height: 1px; background: #b8975a; margin: 24px auto; position: relative; }
    .cert-divider::before { content: '◆'; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 0 12px; color: #b8975a; font-size: 8px; }
    .cert-type { font-family: 'Playfair Display', serif; font-size: 32px; color: #0a1628; text-align: center; font-weight: 700; letter-spacing: 2px; margin-bottom: 6px; }
    .cert-subtitle { font-size: 10px; letter-spacing: 6px; text-transform: uppercase; color: #888; text-align: center; margin-bottom: 28px; }
    .cert-presents { font-size: 11px; color: #999; letter-spacing: 4px; text-transform: uppercase; text-align: center; margin-bottom: 12px; }
    .cert-name { font-family: 'Playfair Display', serif; font-size: 36px; color: #0a1628; text-align: center; font-weight: 600; padding-bottom: 8px; border-bottom: 2px solid #b8975a; display: inline-block; margin: 0 auto 24px; }
    .cert-name-wrap { text-align: center; }
    .cert-course-label { font-size: 10px; color: #999; letter-spacing: 4px; text-transform: uppercase; text-align: center; margin-bottom: 8px; }
    .cert-course { font-size: 20px; color: #0a1628; font-weight: 600; text-align: center; margin-bottom: 8px; }
    .cert-score { display: inline-block; background: linear-gradient(135deg, #b8975a, #d4af6e); color: white; padding: 4px 20px; border-radius: 3px; font-size: 12px; font-weight: 600; letter-spacing: 1px; }
    .cert-score-wrap { text-align: center; margin-bottom: 32px; }
    .cert-footer { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 24px; border-top: 1px solid #e8e6e1; }
    .cert-footer-item { text-align: center; min-width: 140px; }
    .cert-footer-label { font-size: 9px; color: #aaa; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 4px; }
    .cert-footer-value { font-size: 13px; color: #0a1628; font-weight: 600; }
    .cert-seal { width: 72px; height: 72px; border-radius: 50%; border: 2px solid #b8975a; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 0 auto; }
    .cert-seal-text { font-size: 8px; color: #b8975a; letter-spacing: 2px; text-transform: uppercase; font-weight: 700; }
    .cert-seal-check { font-size: 16px; color: #b8975a; margin-bottom: 2px; }
    .cert-id { text-align: center; margin-top: 16px; font-size: 8px; color: #ccc; letter-spacing: 2px; }
    @media print { body { background: white; } .cert-page { box-shadow: none; } }
  `;

  const certificateHTML = `
    <div class="cert-page">
      <div class="cert-border">
        <div class="cert-header">
          <div class="cert-logo">
            FinPilot
            <span class="cert-logo-accent">Business Finance Academy</span>
          </div>
        </div>
        <div class="cert-divider"></div>
        <div class="cert-type">Certificate of Completion</div>
        <div class="cert-subtitle">Professional Development Program</div>
        <div class="cert-presents">This is to certify that</div>
        <div class="cert-name-wrap">
          <div class="cert-name">${userName}</div>
        </div>
        <div class="cert-course-label">Has successfully completed the course</div>
        <div class="cert-course">${courseTitle}</div>
        <div class="cert-score-wrap">
          ${finalScore ? `<span class="cert-score">Final Score: ${finalScore}%</span>` : `<span class="cert-score">Completion: ${completionPercentage}%</span>`}
        </div>
        <div class="cert-footer">
          <div class="cert-footer-item">
            <div class="cert-footer-label">Date of Completion</div>
            <div class="cert-footer-value">${formattedDate}</div>
          </div>
          <div class="cert-footer-item">
            <div class="cert-seal">
              <div class="cert-seal-check">✓</div>
              <div class="cert-seal-text">Verified</div>
            </div>
          </div>
          <div class="cert-footer-item">
            <div class="cert-footer-label">Certificate Number</div>
            <div class="cert-footer-value">${certificateNumber}</div>
          </div>
        </div>
        <div class="cert-id">FINPILOT BUSINESS FINANCE ACADEMY · VERIFY AT ${window.location.origin}</div>
      </div>
    </div>
  `;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`<html><head><title>Certificate - ${courseTitle}</title><style>${printStyles}</style></head><body>${certificateHTML}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownloadPDF = () => {
    handlePrint();
    toast({
      title: "Download Certificate",
      description: "Use your browser's 'Save as PDF' option in the print dialog to download.",
    });
  };

  const handleShareLinkedIn = () => {
    const text = encodeURIComponent(
      `I just completed "${courseTitle}" at FinPilot Business Finance Academy! Certificate #${certificateNumber}`
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
      text: `I just completed ${courseTitle} at FinPilot Business Finance Academy!`,
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
        className="relative bg-white mx-auto max-w-3xl shadow-lg"
      >
        {/* Outer border */}
        <div className="border-2 border-halo-navy m-3 p-6 sm:p-10 md:p-12 relative">
          {/* Inner gold border */}
          <div className="absolute inset-[6px] border border-[hsl(38,40%,53%)] pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 relative z-10">
            <h1
              className="text-sm sm:text-base font-bold tracking-[0.5em] uppercase text-halo-navy"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              FinPilot
            </h1>
            <p className="text-[9px] sm:text-[10px] tracking-[0.35em] uppercase text-[hsl(38,40%,53%)] mt-1 font-medium">
              Business Finance Academy
            </p>
          </div>

          {/* Decorative divider */}
          <div className="relative w-20 h-px mx-auto mb-6 sm:mb-8 bg-[hsl(38,40%,53%)]">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-[hsl(38,40%,53%)] text-[8px]">
              ◆
            </span>
          </div>

          {/* Title */}
          <div className="text-center relative z-10 mb-1">
            <h2
              className="text-2xl sm:text-3xl md:text-[32px] font-bold text-halo-navy tracking-wide"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Certificate of Completion
            </h2>
            <p className="text-[9px] sm:text-[10px] tracking-[0.4em] uppercase text-muted-foreground mt-1.5 mb-6 sm:mb-7">
              Professional Development Program
            </p>
          </div>

          {/* Presents */}
          <p className="text-[10px] sm:text-xs tracking-[0.3em] uppercase text-muted-foreground text-center mb-3">
            This is to certify that
          </p>

          {/* Recipient */}
          <div className="text-center mb-6 relative z-10">
            <p
              className="text-2xl sm:text-3xl md:text-4xl text-halo-navy inline-block border-b-2 border-[hsl(38,40%,53%)] pb-2 px-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {userName}
            </p>
          </div>

          {/* Course */}
          <div className="text-center mb-6 sm:mb-8 relative z-10">
            <p className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">
              Has successfully completed the course
            </p>
            <p className="text-lg sm:text-xl font-semibold text-halo-navy mb-3">
              {courseTitle}
            </p>
            {finalScore ? (
              <span className="inline-block bg-gradient-to-r from-[hsl(38,40%,53%)] to-[hsl(38,50%,60%)] text-white px-5 py-1 rounded-sm text-xs font-semibold tracking-wider">
                Final Score: {finalScore}%
              </span>
            ) : (
              <span className="inline-block bg-gradient-to-r from-[hsl(38,40%,53%)] to-[hsl(38,50%,60%)] text-white px-5 py-1 rounded-sm text-xs font-semibold tracking-wider">
                Completion: {completionPercentage}%
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end pt-5 sm:pt-6 border-t border-border relative z-10">
            <div className="text-center min-w-[100px] sm:min-w-[130px]">
              <p className="text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-muted-foreground mb-1">
                Date of Completion
              </p>
              <p className="text-xs sm:text-sm font-semibold text-halo-navy">{formattedDate}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 sm:w-[68px] sm:h-[68px] rounded-full border-2 border-[hsl(38,40%,53%)] flex flex-col items-center justify-center">
                <span className="text-[hsl(38,40%,53%)] text-base sm:text-lg leading-none">✓</span>
                <span className="text-[7px] sm:text-[8px] tracking-[0.15em] uppercase text-[hsl(38,40%,53%)] font-bold mt-0.5">
                  Verified
                </span>
              </div>
            </div>
            <div className="text-center min-w-[100px] sm:min-w-[130px]">
              <p className="text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-muted-foreground mb-1">
                Certificate Number
              </p>
              <p className="text-xs sm:text-sm font-semibold text-halo-navy">{certificateNumber}</p>
            </div>
          </div>

          {/* Verification URL */}
          <p className="text-center text-[7px] sm:text-[8px] tracking-[0.15em] uppercase text-muted-foreground/50 mt-4">
            FinPilot Business Finance Academy · Verify at {window.location.origin}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        <Button onClick={handleDownloadPDF} className="gap-2 bg-halo-navy hover:bg-halo-navy/90 text-white">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download PDF</span>
          <span className="sm:hidden">PDF</span>
        </Button>
        <Button onClick={handleShareLinkedIn} variant="outline" className="gap-2 border-[#0077B5] text-[#0077B5] hover:bg-[#0077B5]/10">
          <Linkedin className="h-4 w-4" />
          <span className="hidden sm:inline">Share on LinkedIn</span>
          <span className="sm:hidden">LinkedIn</span>
        </Button>
        <Button onClick={handlePrint} variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          <span className="hidden sm:inline">Print</span>
        </Button>
        <Button onClick={handleShare} variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
        <Button onClick={handleCopyLink} variant="outline" className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Link"}</span>
        </Button>
      </div>
    </div>
  );
};
