import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { mutate } from 'swr';
import { getCurrentSession } from '@/requests/session.request';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinUserRoom: (userId: string) => void;
  leaveUserRoom: (userId: string) => void;
  currentUserId: string | null;
}

interface SocketProviderProps {
  children: ReactNode;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const joinUserRoom = (userId: string) => {
    if (socket && userId) {
      socket.emit('user_login', userId);
      setCurrentUserId(userId);
    }
  };

  const leaveUserRoom = (userId: string) => {
    if (socket && userId) {
      socket.emit('user_logout', userId);
      setCurrentUserId(null);
    }
  };

  useEffect(() => {
    const initializeSocket = async () => {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        'https://my-shop-backend-usaq.onrender.com';

      const userInformation = await getCurrentSession();
      const sessionId = userInformation?.data?.sessionId || null;
      const userId = userInformation?.data?.userId || null;

      const socketInstance = io(backendUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
        timeout: 20000,
      });

      // Connection Events
      socketInstance.on('connect', () => {
        setIsConnected(true);

        // Join session room
        socketInstance.emit('join_session', sessionId);

        // Auto-join user room if user is logged in
        if (userId) {
          socketInstance.emit('user_login', userId);
          setCurrentUserId(userId);
        }
      });

      socketInstance.on('disconnect', () => {
        setIsConnected(false);
        setCurrentUserId(null);
      });

      // User Room Events
      socketInstance.on('user_room_joined', (data: { userId: string }) => {
        setCurrentUserId(data.userId);
      });

      // User Events
      socketInstance.on('order_status_updated', (data: any) => {
        mutate('orders');
        mutate('/api/orders');
        if (data.orderId) {
          mutate(`order-${data.orderId}`);
        }
      });

      // socketInstance.on('notification', (data: any) => {
      //   console.log('🔔 New notification:', data);
      //   // todo: if time add a banner for something like a new product so all user can see a notification or something like this
      // });

      socketInstance.on(
        'products_updated',
        (data: { productIds: string[]; timestamp: string }) => {
          mutate('products'); // for card list view update
          data.productIds.forEach((productId: string) => {
            mutate(productId); // for single product update
          });
        },
      );

      socketInstance.on(
        'cart_updated',
        (data: {
          productId: string;
          timestamp: string;
          sessionId: string;
          userId?: string;
        }) => {
          if (data.userId) {
            mutate(`cart-${data.userId}`);
          } else {
            mutate(`cart-${data.sessionId}`);
          }
        },
      );

      setSocket(socketInstance);

      return () => {
        // Cleanup on unmount
        if (userId) {
          socketInstance.emit('user_logout', userId);
        }
        socketInstance.disconnect();
      };
    };

    initializeSocket();
  }, []);

  const contextValue: SocketContextType = {
    socket,
    isConnected,
    joinUserRoom,
    leaveUserRoom,
    currentUserId,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
