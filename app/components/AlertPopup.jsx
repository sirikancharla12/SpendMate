"use client";

import React from "react";
import { useAlert } from "../context/AlertContext";
import {
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AlertPopup = () => {
  const { alert, closeAlert } = useAlert();

  if (!alert?.isOpen) return null;

  const ICONS = {
    success: <CheckCircle size={32} className="text-green-500" />,
    error: <AlertCircle size={32} className="text-red-500" />,
    warning: <AlertTriangle size={32} className="text-yellow-500" />,
    info: <Info size={32} className="text-blue-500" />,
  };

  const BORDER_COLORS = {
    success: "border-green-500",
    error: "border-red-500",
    warning: "border-yellow-500",
    info: "border-blue-500",
  };

  const BUTTON_COLORS = {
    success: "bg-green-500 hover:bg-green-600",
    error: "bg-red-500 hover:bg-red-600",
    warning: "bg-yellow-500 hover:bg-yellow-600",
    info: "bg-blue-500 hover:bg-blue-600",
  };

  const handleConfirm = () => {
    if (typeof alert.onConfirm === "function") {
      alert.onConfirm();
    }
    closeAlert();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`bg-card w-full max-w-sm rounded-xl shadow-2xl border-l-4 ${
            BORDER_COLORS[alert.type || "info"]
          }`}
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0">
                {ICONS[alert.type || "info"]}
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-semibold capitalize">
                  {alert.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {alert.message}
                </p>
              </div>

              <button
                onClick={closeAlert}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              {alert.showCancel && (
                <button
                  onClick={closeAlert}
                  className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:bg-secondary"
                >
                  Cancel
                </button>
              )}

              <button
                onClick={handleConfirm}
                className={`rounded-lg px-6 py-2 text-sm font-medium text-white shadow-md ${
                  BUTTON_COLORS[alert.type || "info"]
                }`}
              >
                {alert.showCancel ? "Confirm" : "OK"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AlertPopup;
