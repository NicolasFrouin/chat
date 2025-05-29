import { useState, useEffect } from 'react';
import { AppShell, Container, LoadingOverlay } from '@mantine/core';
import { io, Socket } from 'socket.io-client';

import UserForm from './components/UserForm';
import ChatRoom from './components/ChatRoom';
import { User, Message, UserFormData } from './types';

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});

  // Check local storage for saved user
  useEffect(() => {
    const savedUserJson = localStorage.getItem('chatUser');
    if (savedUserJson) {
      try {
        const savedUser = JSON.parse(savedUserJson);
        setUser(savedUser);
      } catch (e) {
        console.error('Failed to parse saved user', e);
        localStorage.removeItem('chatUser');
      }
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    const socketInstance = io();
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);

      // Auto-login if we have a saved user
      if (user) {
        socketInstance.emit('login', { userId: user.id });
      }

      // Fetch initial chats
      socketInstance.emit('findAllChats');
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    // Handle login events
    socketInstance.on('loginSuccess', (loggedInUser: User) => {
      setUser(loggedInUser);
      localStorage.setItem('chatUser', JSON.stringify(loggedInUser));
      setLoading(false);
      setError(null);
    });

    socketInstance.on('loginError', (data: { message: string }) => {
      setError(data.message);
      setLoading(false);
    });

    socketInstance.on('userCreated', (createdUser: User) => {
      setUser(createdUser);
      localStorage.setItem('chatUser', JSON.stringify(createdUser));
      setLoading(false);
      setError(null);
    });

    // Handle chat messages
    socketInstance.on('chats', (initialChats: Message[]) => {
      setMessages(initialChats);
    });

    socketInstance.on('newChat', (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socketInstance.on('chatUpdated', (updatedMessage: Message) => {
      setMessages((prevMessages) => 
        prevMessages.map((msg) => 
          msg.id === updatedMessage.id ? updatedMessage : msg
        )
      );
    });

    socketInstance.on('chatRemoved', (data: { id: string }) => {
      setMessages((prevMessages) => prevMessages.filter((message) => message.id !== data.id));
    });

    // Handle user update events
    socketInstance.on('userUpdated', (updatedUser: User) => {
      // Update the current user if it's us
      if (user && updatedUser.id === user.id) {
        setUser(updatedUser);
        localStorage.setItem('chatUser', JSON.stringify(updatedUser));
      }
      
      // Update the user in any existing messages
      setMessages((prevMessages) => 
        prevMessages.map((message) => 
          message.author.id === updatedUser.id 
            ? { ...message, author: updatedUser } 
            : message
        )
      );
      
      setLoading(false);
    });

    socketInstance.on('updateError', (data: { message: string }) => {
      setError(data.message);
      setLoading(false);
    });

    // Handle user typing events
    socketInstance.on('userTyping', ({ userId, userName }) => {
      setTypingUsers(prev => ({ ...prev, [userId]: userName }));
    });

    socketInstance.on('userStoppedTyping', ({ userId }) => {
      setTypingUsers(prev => {
        const newTypingUsers = { ...prev };
        delete newTypingUsers[userId];
        return newTypingUsers;
      });
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.id]);

  // Function to handle user login/creation
  const handleUserLogin = (userData: UserFormData) => {
    if (!socket) return;

    setLoading(true);
    setError(null);

    // Send login with user data for creation or connecting to existing account
    socket.emit('login', { userData });

    // Let the server handle finding or creating the user
  };

  // Function to send a message
  const sendMessage = (text: string) => {
    if (socket && connected) {
      socket.emit('createChat', { text });
    }
  };

  // Function to edit a message
  const editMessage = (messageId: string, newText: string) => {
    if (socket && connected) {
      socket.emit('updateChat', { id: messageId, text: newText });
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('chatUser');
    setUser(null);

    // Reconnect socket to reset connection state
    if (socket) {
      socket.disconnect().connect();
    }
  };

  // Function to update user color
  const updateUserColor = (color: string) => {
    if (socket && connected && user) {
      setLoading(true);
      socket.emit('updateUserColor', { userId: user.id, color });
    }
  };

  // Function to handle user typing start
  const handleTypingStart = () => {
    if (socket && connected && user) {
      socket.emit('startTyping');
    }
  };

  // Function to handle user typing stop
  const handleTypingStop = () => {
    if (socket && connected && user) {
      socket.emit('stopTyping');
    }
  };

  return (
    <AppShell>
      <Container
        size='sm'
        py='xl'
        pos='relative'
      >
        <LoadingOverlay
          visible={loading}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />

        {user && connected ? (
          <ChatRoom
            user={user}
            messages={messages}
            onSendMessage={sendMessage}
            connected={connected}
            onLogout={handleLogout}
            onUpdateColor={updateUserColor}
            typingUsers={typingUsers}
            onTypingStart={handleTypingStart}
            onTypingStop={handleTypingStop}
            onEditMessage={editMessage} // Pass the edit message handler
          />
        ) : (
          <UserForm
            onSubmit={handleUserLogin}
            error={error}
            isLoading={loading}
          />
        )}
      </Container>
    </AppShell>
  );
}

export default App;
