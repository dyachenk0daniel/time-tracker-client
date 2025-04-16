import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { CSSProperties } from 'react';

export type NotificationType = 'success' | 'error';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  customStyles?: CSSProperties;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (message: string, type: NotificationType, customStyles?: CSSProperties) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (message, type, customStyles) => {
    const id = nanoid();

    set((state) => ({
      notifications: [...state.notifications, { id, message, type, customStyles }],
    }));

    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 5000);
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
