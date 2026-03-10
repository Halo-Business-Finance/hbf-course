import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  actions?: ReactNode;
}

export const PageHeader = ({ title, subtitle, icon, actions }: PageHeaderProps) => {
  return (
    <motion.div
      className="border-b border-border bg-black"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="px-4 sm:px-6 lg:px-10 py-6 sm:py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 rounded-lg bg-halo-navy flex items-center justify-center flex-shrink-0">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
              <p className="text-sm text-white/70 mt-1">{subtitle}</p>
            </div>
          </div>
          {actions && <div className="flex gap-2 flex-wrap">{actions}</div>}
        </div>
      </div>
    </motion.div>
  );
};
