'use client';
import React from 'react';
import { Toaster } from 'sonner';
import { cn } from '@/lib/utils';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      className="group"
      toastOptions={{
        classNames: {
          toast: cn(
            "group relative rounded-lg shadow-lg !bg-white",
            "animate-in fade-in-0 zoom-in-95 data-[state=open]:slide-in-from-right-full",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-full",
            "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0",
            "data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=end]:animate-out",
            "before:absolute before:inset-0 before:rounded-lg before:animate-pulse before:ring-2 before:ring-offset-2"
          ),
          title: "text-base font-semibold",
          description: "text-sm",
          actionButton: "bg-primary text-primary-foreground hover:bg-primary/90",
          cancelButton: "bg-muted text-muted-foreground hover:bg-muted/90",
        },
        duration: 4000,
        style: {
          fontSize: '14px',
          transition: 'all 0.3s ease-in-out',
          transformOrigin: 'top right',
        },
      }}
      theme="light"
      style={
        {
          '--toast-success': '#2C8B3D',
          '--toast-warning': '#F2A024',
          '--toast-error': '#FF4D4F',
          '--toast-border-radius': '10px',
        } as React.CSSProperties
      }
    />
  );
}; 