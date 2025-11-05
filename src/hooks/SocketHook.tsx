'use client';

import { useSocketContext } from '@/providers/SocketProvider';
import { Socket } from 'socket.io-client';

interface UseSocketResponse {
  socket: Socket | null;
  isConnected: boolean;
  joinUserRoom: (userId: string) => void;
  leaveUserRoom: (userId: string) => void;
  currentUserId: string | null;
  isReady: boolean;
}

const useSocket = (): UseSocketResponse => {
  const socketContext = useSocketContext();

  return {
    socket: socketContext.socket,
    isConnected: socketContext.isConnected,
    joinUserRoom: socketContext.joinUserRoom,
    leaveUserRoom: socketContext.leaveUserRoom,
    currentUserId: socketContext.currentUserId,
    isReady: socketContext.isConnected && socketContext.socket !== null,
  };
};

export default useSocket;
