import { toast, Toast } from 'react-hot-toast';
import { createElement } from 'react';
import { ConfirmDialog } from '../component/ConfirmDialog';
  

export const showConfirmDialog = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    toast.custom(
      (t: Toast) =>
        createElement(ConfirmDialog, {
          message,
          onConfirm: () => {
            toast.dismiss(t.id);
            resolve(true);
          },
          onCancel: () => {
            toast.dismiss(t.id);
            resolve(false);
          },
        }),
      { duration: Infinity }
    );
  });
};