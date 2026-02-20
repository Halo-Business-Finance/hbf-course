import { Lightbulb } from "lucide-react";

interface KeyTakeawaysProps {
  objectives: string[];
  className?: string;
}

export function KeyTakeaways({ objectives, className = "" }: KeyTakeawaysProps) {
  if (!objectives || objectives.length === 0) return null;

  return (
    <div className={`border border-primary/20 rounded-lg p-4 sm:p-5 bg-primary/5 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="h-5 w-5 text-primary shrink-0" />
        <h3 className="font-semibold text-foreground text-sm sm:text-base">What You'll Learn</h3>
      </div>
      <ul className="space-y-2">
        {objectives.map((obj, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              {i + 1}
            </span>
            <span>{obj}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
