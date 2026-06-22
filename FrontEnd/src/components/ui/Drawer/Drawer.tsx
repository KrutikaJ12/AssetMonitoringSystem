interface DrawerProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;

  width?: "sm" | "md" | "lg" | "xl";
  position?: "left" | "right";
  showCloseButton?: boolean;
}
const Drawer: React.FC<DrawerProps> = ({
  children,
  isOpen,
  title,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40" onClick={onClose}>
      {/* Drawer */}
      <div className="fixed top-19 right-0 h-screen w-[400px] bg-white shadow-xl z-50 ">
        <div className="flex justify-between items-center p-4 border-b">
          <h2>{title}</h2>

          <button onClick={onClose}>✕</button>
        </div>

        <div className="p-4 bg-gray-50 h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
