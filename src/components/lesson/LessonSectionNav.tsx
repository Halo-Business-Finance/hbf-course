import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Section {
  type: string;
  title: string;
  icon: LucideIcon;
}

interface LessonSectionNavProps {
  sections: Section[];
  currentSection: number;
  onSectionSelect: (index: number) => void;
}

export const LessonSectionNav = ({ sections, currentSection, onSectionSelect }: LessonSectionNavProps) => {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 px-1">
      {sections.map((section, index) => {
        const Icon = section.icon;
        return (
          <Button
            key={index}
            variant={index === currentSection ? "navy" : index < currentSection ? "outline" : "ghost"}
            size="sm"
            className={`flex items-center gap-2 whitespace-nowrap transition-all ${
              index < currentSection ? "border-primary/30 text-primary" : ""
            } ${index === currentSection ? "shadow-md" : ""}`}
            disabled={index > currentSection}
            onClick={() => index <= currentSection && onSectionSelect(index)}
          >
            {index < currentSection ? (
              <CheckCircle className="h-4 w-4 text-primary" />
            ) : (
              <Icon className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">{section.title}</span>
            <span className="sm:hidden">{index + 1}</span>
          </Button>
        );
      })}
    </div>
  );
};
