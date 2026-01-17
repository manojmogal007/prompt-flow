import { createContext, useState, type ReactNode } from "react";
import { Toast } from "../utils/helperComponents/Toast";
type ToastType = "success" | "error" | "warning" | "info";

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
  description: string;
  duration: number;
}

interface ToastContextProps {
  showToast: (message: string, type: ToastType, description?: string, duration?: number) => void;
}
export const ToastContext = createContext<ToastContextProps | null>(null);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType, description: string = '', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, description, duration }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-5 right-5 space-y-2 z-100 ">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            description={toast.description}
            duration={toast.duration}
            onClose={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
