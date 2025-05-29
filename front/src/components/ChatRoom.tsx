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
}

function ChatRoom({ user, messages, onSendMessage, connected, onLogout, onUpdateColor }: ChatRoomProps) {
  const [messageText, setMessageText] = useState('');
  const viewport = useRef<HTMLDivElement>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (messageText.trim() && connected) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages.length]);

  return (
    <Stack h="70vh">
      <Group justify="space-between" mb={5}>
        <Group>
          <Text fw={700}>{user.name}</Text>
          <ActionIcon color={user.color} variant="light" onClick={open} title="Change your color">
            <IconPalette size="1.125rem" />
          </ActionIcon>
        </Group>
        <Group>
          <Text c="dimmed" size="xs">
            {connected ? 'Connected' : 'Disconnected'}
          </Text>
          <ActionIcon color="red" variant="light" onClick={onLogout} title="Logout">
            <IconLogout size="1.125rem" />
          </ActionIcon>
        </Group>
      </Group>

      <Paper withBorder p="xs" style={{ flex: 1 }}>
        <ScrollArea h="100%" viewportRef={viewport}>
          <Stack gap="md" p="xs">
            {messages.length === 0 ? (
              <Text c="dimmed" ta="center">No messages yet. Start the conversation!</Text>
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
      </Paper>

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Group align="flex-start">
          <TextInput
            style={{ flex: 1 }}
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={!connected}
          />
          <Button type="submit" disabled={!connected || !messageText.trim()}>
            <IconSend size="1.125rem" />
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
