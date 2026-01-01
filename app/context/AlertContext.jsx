"use client";
import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState({
        isOpen: false,
        message: "",
        type: "success", // 'success', 'error', 'info', 'warning'
        title: "",
        onConfirm: null, // For confirmation dialogs
        showCancel: false
    });

    const showAlert = (message, type = "success", title = "", onConfirm = null) => {
        setAlert({
            isOpen: true,
            message,
            type,
            title: title || (type === "error" ? "Error" : type === "success" ? "Success" : "Info"),
            onConfirm: onConfirm,
            showCancel: !!onConfirm
        });
    };

    const closeAlert = () => {
        setAlert(prev => ({ ...prev, isOpen: false }));
    };

    return (
        <AlertContext.Provider value={{ alert, showAlert, closeAlert }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};
