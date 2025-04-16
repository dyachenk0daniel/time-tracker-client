import { CSSProperties, useCallback } from 'react';
import { useNotificationStore } from '@shared/stores/notification-store';

export function useNotifications() {
  const addNotification = useNotificationStore((state) => state.addNotification);

  const success = useCallback(
    (message: string, customStyles?: CSSProperties) => {
      addNotification(message, 'success', customStyles);
    },
    [addNotification]
  );

  const error = useCallback(
    (message: string) => {
      addNotification(message, 'error');
    },
    [addNotification]
  );

  return { success, error };
}
