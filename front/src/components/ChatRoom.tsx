import { Stack, TextInput, Button, Text, Paper, ScrollArea, Group, ActionIcon } from '@mantine/core';
import { useState, useRef, useEffect } from 'react';
import { IconSend, IconLogout, IconPalette } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

import MessageBubble from './MessageBubble';
import ColorPickerModal from './ColorPickerModal';
import { Message, User } from '../types';

interface ChatRoomProps {
  user: User;
  messages: Message[];
  onSendMessage: (text: string) => void;
  connected: boolean;
  onLogout: () => void;
  onUpdateColor: (color: string) => void;
  typingUsers: Record<string, string>; // Map of userId to username
  onTypingStart: () => void;
  onTypingStop: () => void;
}

function ChatRoom({
  user,
  messages,
  onSendMessage,
  connected,
  onLogout,
  onUpdateColor,
  typingUsers,
  onTypingStart,
  onTypingStop,
}: ChatRoomProps) {
  const [messageText, setMessageText] = useState('');
  const viewport = useRef<HTMLDivElement>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const typingTimeoutRef = useRef<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (messageText.trim() && connected) {
      onSendMessage(messageText.trim());
      setMessageText('');
      // Clear typing indicator when message is sent
      onTypingStop();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setMessageText(newText);

    // Handle typing indicator
    if (newText.length > 0) {
      // If user wasn't already marked as typing, emit typing start event
      onTypingStart();

      // Reset the timeout each time the user types
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        onTypingStop();
      }, 2000);
    } else {
      // If the input is empty, stop typing indicator immediately
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      onTypingStop();
    }
  };

  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages.length]);

  // Create typing indicator message
  const typingUsersArray = Object.values(typingUsers).filter((name) => name !== user.name);
  let typingMessage = '';

  if (typingUsersArray.length === 1) {
    typingMessage = `${typingUsersArray[0]} is typing...`;
  } else if (typingUsersArray.length === 2) {
    typingMessage = `${typingUsersArray[0]} and ${typingUsersArray[1]} are typing...`;
  } else if (typingUsersArray.length > 2) {
    typingMessage = `${typingUsersArray[0]}, ${typingUsersArray[1]} and ${
      typingUsersArray.length - 2
    } more are typing...`;
  }

  return (
    <Stack h='70vh'>
      <Group
        justify='space-between'
        mb={5}
      >
        <Group>
          <Text fw={700}>{user.name}</Text>
          <ActionIcon
            color={user.color}
            variant='light'
            onClick={open}
            title='Change your color'
          >
            <IconPalette size='1.125rem' />
          </ActionIcon>
        </Group>
        <Group>
          <Text
            c='dimmed'
            size='xs'
          >
            {connected ? 'Connected' : 'Disconnected'}
          </Text>
          <ActionIcon
            color='red'
            variant='light'
            onClick={onLogout}
            title='Logout'
          >
            <IconLogout size='1.125rem' />
          </ActionIcon>
        </Group>
      </Group>

      <Paper
        withBorder
        p='xs'
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <ScrollArea
          h='100%'
          viewportRef={viewport}
          style={{ flex: 1 }}
        >
          <Stack
            gap='md'
            p='xs'
          >
            {messages.length === 0 ? (
              <Text
                c='dimmed'
                ta='center'
              >
                No messages yet. Start the conversation!
              </Text>
            ) : (
              messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isCurrentUser={message.author.id === user.id}
                />
              ))
            )}
          </Stack>
        </ScrollArea>

        {typingMessage && (
          <Text
            size='xs'
            fs='italic'
            p='xs'
            c='dimmed'
          >
            {typingMessage}
          </Text>
        )}
      </Paper>

      <form
        onSubmit={handleSubmit}
        style={{ width: '100%' }}
      >
        <Group align='flex-start'>
          <TextInput
            style={{ flex: 1 }}
            placeholder='Type your message...'
            value={messageText}
            onChange={handleInputChange}
            disabled={!connected}
          />
          <Button
            type='submit'
            disabled={!connected || !messageText.trim()}
          >
            <IconSend size='1.125rem' />
          </Button>
        </Group>
      </form>

      <ColorPickerModal
        opened={opened}
        close={close}
        currentColor={user.color}
        onColorChange={onUpdateColor}
      />
    </Stack>
  );
}

export default ChatRoom;
