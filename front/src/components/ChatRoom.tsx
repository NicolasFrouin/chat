import { useRef, useEffect } from 'react';
import { Paper, Title, Stack, Text, Group, Badge, Button, ScrollArea } from '@mantine/core';
import { User, Message } from '../types';
import MessageForm from './MessageForm';
import MessageBubble from './MessageBubble';

interface ChatRoomProps {
  user: User;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onLogout: () => void;
  connected: boolean;
}

function ChatRoom({ user, messages, onSendMessage, onLogout, connected }: ChatRoomProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <Stack gap='md'>
      <Group
        justify='space-between'
        align='center'
      >
        <Title order={3}>Chat Room</Title>
        <Group gap='sm'>
          <Text size='sm'>
            Logged in as <strong>{user.name}</strong>
          </Text>
          <Badge
            color={connected ? 'green' : 'red'}
            variant='filled'
          >
            {connected ? 'Connected' : 'Disconnected'}
          </Badge>
          <Button
            variant='subtle'
            color='gray'
            size='xs'
            rightSection={'❌'}
            onClick={onLogout}
          >
            Logout
          </Button>
        </Group>
      </Group>

      <Paper
        withBorder
        p='xs'
        style={{ height: 'calc(100vh - 200px)' }}
      >
        <ScrollArea
          h='100%'
          viewportRef={scrollAreaRef}
        >
          <Stack
            gap='xs'
            p='xs'
          >
            {messages.length === 0 ? (
              <Text
                c='dimmed'
                ta='center'
                py='xl'
              >
                No messages yet. Be the first to say hello!
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
      </Paper>

      <MessageForm
        onSubmit={onSendMessage}
        disabled={!connected}
      />
    </Stack>
  );
}

export default ChatRoom;
