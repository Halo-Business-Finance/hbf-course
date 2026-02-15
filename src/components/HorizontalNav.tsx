import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight } from "lucide-react";

export const HorizontalNav = () => {
  return (
    <div className="hidden lg:block bg-card/95 backdrop-blur-sm px-8 py-4 w-full border-b border-border">
      <div className="flex items-center gap-12 w-full max-w-7xl mx-auto">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-halo-navy rounded-sm flex items-center justify-center">
            <span className="text-white font-bold text-base">FP</span>
          </div>
          <span className="text-2xl font-bold text-foreground">FinPilot</span>
        </NavLink>

        {/* Navigation Menu */}
        <div className="flex items-center gap-6 flex-nowrap flex-1 justify-center">
          {[
            { to: "/about", label: "About" },
            { to: "/course-catalog", label: "Course Catalog" },
            { to: "/pricing", label: "Pricing" },
            { to: "/enterprise", label: "Enterprise" },
            { to: "/blog", label: "Blog" },
            { to: "/support", label: "Support" },
          ].map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `text-foreground hover:text-primary transition-colors font-medium text-base whitespace-nowrap ${
                  isActive ? "text-primary" : ""
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-border flex-shrink-0">
          <Button size="sm" asChild className="bg-halo-orange hover:bg-halo-orange/90 text-white text-sm">
            <NavLink to="/signup" className="flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="h-4 w-4" />
            </NavLink>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-sm border-halo-navy text-halo-navy hover:bg-halo-navy hover:text-white"
          >
            <NavLink to="/auth" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Sign In
            </NavLink>
          </Button>
        </div>
      </div>
    </div>
  );
};
