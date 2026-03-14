import { Building2, Mail, Phone, Globe, Linkedin, Twitter, Facebook, Instagram } from "lucide-react";

export const FinPilotBrandFooter = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Company Info */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">FinPilot</h3>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 max-w-md">
                Navigate your financial future with expert guidance through comprehensive 
                professional development and training programs.
              </p>
              
              {/* Social Media Links */}
              <div className="flex space-x-4">
                <a href="https://linkedin.com" className="text-halo-navy hover:text-primary transition-colors p-1">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
                <a href="https://twitter.com" className="text-halo-navy hover:text-primary transition-colors p-1">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="https://facebook.com" className="text-halo-navy hover:text-primary transition-colors p-1">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </a>
                <a href="https://instagram.com" className="text-halo-navy hover:text-primary transition-colors p-1">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 sm:mb-4 uppercase tracking-wider">Contact</h4>
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                  <Globe className="h-4 w-4 text-primary shrink-0" />
                  <span>www.finpilot.com</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <span>training@finpilot.com</span>
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary shrink-0" />
                  <span>1-800-FINPILOT</span>
                </div>
              </div>
            </div>

            {/* Training Programs */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3 sm:mb-4 uppercase tracking-wider">Programs</h4>
              <div className="space-y-2">
                <a href="/course-catalog" className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">
                  Professional Training
                </a>
                <a href="/course-catalog" className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">
                  Commercial Lending Excellence
                </a>
                <a href="/course-catalog" className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">
                  Business Finance Mastery
                </a>
                <a href="/course-catalog" className="block text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors py-0.5">
                  Industry-Leading Curriculum
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-4 sm:py-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <p className="text-xs text-muted-foreground">
              © 2026 FinPilot. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a 
                href="/privacy" 
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </a>
              <a 
                href="/terms" 
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Use
              </a>
              <a 
                href="/data-security" 
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                Data & Security
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};