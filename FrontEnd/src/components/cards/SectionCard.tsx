interface SectionCardProps {
  title: string;
  actionText?: string;
  onActionClick?: () => void;
  children: React.ReactNode;
}

export const SectionCard = ({
  title,
  actionText,
  onActionClick,
  children,
}: SectionCardProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        {actionText && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onActionClick) onActionClick();
            }}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer relative z-10"
          >
            {actionText}
          </button>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};