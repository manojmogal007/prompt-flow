import React, { useEffect } from "react";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning" | "info";
  onClose: () => void;
  duration?: number; // milliseconds
}

const icons: Record<ToastProps["type"], React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 mr-2" />,
  error: <XCircle className="w-4 h-4 mr-2" />,
  warning: <AlertTriangle className="w-4 h-4 mr-2" />,
  info: <Info className="w-4 h-4 mr-2" />,
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeStyles: Record<ToastProps["type"], string> = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-400 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div
      className={`flex items-center px-4 py-2 rounded-lg shadow-lg text-sm font-medium
        ${typeStyles[type]} 
        transform transition-all duration-300 ease-in-out
        animate-slideIn`}
    >
      {icons[type]}
      <span>{message}</span>
    </div>
  );
};
