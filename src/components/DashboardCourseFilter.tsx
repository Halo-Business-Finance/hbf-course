import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useCourses, Course } from "@/hooks/useCourses";
import { GraduationCap, FileText, ClipboardCheck, Sparkles } from "lucide-react";

interface DashboardCourseFilterProps {
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  selectedTopic: string | null;
  onTopicSelect: (topic: string | null) => void;
  className?: string;
}

export function DashboardCourseFilter({
  selectedCategory,
  onCategorySelect,
  selectedTopic,
  onTopicSelect,
  className = ""
}: DashboardCourseFilterProps) {
  const { courses } = useCourses();

  const categorizedCourses = useMemo(() => {
    return courses.reduce((acc, course) => {
      let category = 'Loan Originator';
      if (course.title.toLowerCase().includes('processing')) {
        category = 'Loan Processing';
      } else if (course.title.toLowerCase().includes('underwriting')) {
        category = 'Loan Underwriting';
      } else if (course.title.toLowerCase().includes('originator') || course.title.toLowerCase().includes('origination')) {
        category = 'Loan Originator';
      }
      if (!acc[category]) acc[category] = [];
      acc[category].push(course);
      return acc;
    }, {} as Record<string, Course[]>);
  }, [courses]);

  const categoryConfig = [
    { key: "Loan Originator", label: "Loan Originator", icon: GraduationCap },
    { key: "Loan Processing", label: "Loan Processor", icon: FileText },
    { key: "Loan Underwriting", label: "Loan Underwriter", icon: ClipboardCheck },
  ];

  const filterTopics = [
    { label: "Featured", icon: Sparkles },
    { label: "SBA Lending" },
    { label: "Commercial Real Estate" },
    { label: "Equipment Financing" },
    { label: "Working Capital" },
    { label: "Credit Analysis" },
    { label: "Risk Management" },
  ];

  const getCategoryCount = (categoryKey: string) => {
    return categorizedCourses[categoryKey]?.length || 0;
  };

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Main Category Tabs */}
      <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none sm:flex-wrap sm:overflow-visible">
        <Button
          variant="outline"
          onClick={() => onCategorySelect(null)}
          className={`h-10 sm:h-12 px-3 sm:px-6 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
            selectedCategory === null
              ? "border-2 border-foreground text-foreground shadow-sm"
              : "border-2 border-border text-muted-foreground hover:border-foreground hover:text-foreground"
          }`}
        >
          All Programs
        </Button>
        
        {categoryConfig.map((category) => {
          const count = getCategoryCount(category.key);
          const Icon = category.icon;
          const isSelected = selectedCategory === category.key;
          
          return (
            <Button
              key={category.key}
              variant="outline"
              onClick={() => onCategorySelect(category.key)}
              disabled={count === 0}
              className={`h-10 sm:h-12 px-3 sm:px-6 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 gap-1.5 sm:gap-2 ${
                isSelected
                  ? "border-2 border-foreground text-foreground shadow-sm"
                  : "border-2 border-border text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-40"
              }`}
            >
              <Icon className="h-4 w-4" />
              {category.label}
              {count > 0 && (
                <span className={`ml-1.5 text-xs px-2 py-0.5 rounded-full font-medium ${
                  isSelected 
                    ? "text-foreground" 
                    : "text-muted-foreground"
                }`}>
                  {count}
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Filter Pills Row */}
      <div className="flex flex-wrap items-center gap-2">
        {filterTopics.map((topic, index) => {
          const isSelected = selectedTopic === topic.label;
          
          return (
            <button
              key={index}
              onClick={() => onTopicSelect(isSelected ? null : topic.label)}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 min-h-[40px] ${
                isSelected
                  ? "border-2 border-foreground text-foreground shadow-sm"
                  : "border-2 border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              {topic.icon && <topic.icon className="h-3.5 w-3.5" />}
              {topic.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
