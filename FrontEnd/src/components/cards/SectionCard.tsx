interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  actionText?: string;
  onActionClick?: () => void;
}
export const SectionCard = ({ title, children,actionText }: SectionCardProps) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
    <div className="flex justify-between">
       <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white/90">
      {title}
    </h3>
    <div className="text-sm text-blue-500 mt-1">{actionText}</div>
    </div>
    
    {children}
  </div>
);