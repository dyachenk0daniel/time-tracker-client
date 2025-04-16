import { ComponentProps, useEffect } from 'react';
import { createPortal } from 'react-dom';
import cn from 'classnames';
import { Notification, useNotificationStore } from '@shared/stores/notification-store.ts';
import s from './styles.module.scss';

interface NotificationItemProps extends ComponentProps<'div'> {
  notification: Notification;
  onClose: (id: string) => void;
}

function NotificationItem({ notification, onClose, ...props }: NotificationItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  return (
    <div
      className={cn(s.notification, {
        [s.success]: notification.type === 'success',
        [s.error]: notification.type === 'error',
      })}
      {...props}
    >
      <span className={s.message}>{notification.message}</span>
      <button className={s.closeButton} onClick={() => onClose(notification.id)} aria-label="Close notification">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={s.closeIcon}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function NotificationContainer() {
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  if (!notifications.length) return null;

  return createPortal(
    <div className={s.notificationContainer}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
          style={notification.customStyles}
        />
      ))}
    </div>,
    document.body
  );
}

export default NotificationContainer;
