'use client';
import React from 'react';
import { Toaster } from 'sonner';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: {
          fontSize: '14px',
        },
      }}
      theme="light"
      style={
        {
          '--toast-success': '#2C8B3D',
          '--toast-warning': '#F2A024',
          '--toast-error': '#FF4D4F',
        } as React.CSSProperties
      }
    />
  );
}; 