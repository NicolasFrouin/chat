import { Paper, Text, Group, Stack, Avatar } from '@mantine/core';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

function MessageBubble({ message, isCurrentUser }: MessageBubbleProps) {
  const { text, author, createdAt } = message;
  const formattedTime = new Date(createdAt).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return (
    <Group 
      align="flex-start" 
      justify={isCurrentUser ? 'flex-end' : 'flex-start'}
      wrap="nowrap"
    >
      {!isCurrentUser && (
        <Avatar 
          color={author.color}
          radius="xl"
          src={author.image}
        >
          {author.name.charAt(0).toUpperCase()}
        </Avatar>
      )}
      
      <Stack gap={4} style={{ maxWidth: '80%' }}>
        {!isCurrentUser && (
          <Text size="xs" c="dimmed" fw={500}>
            {author.name}
          </Text>
        )}
        
        <Paper 
          p="sm"
          radius="md" 
          bg={isCurrentUser ? 'blue' : 'gray.1'} 
          c={isCurrentUser ? 'white' : 'dark'}
          style={{ 
            alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
            borderLeft: !isCurrentUser ? `4px solid ${author.color}` : undefined,
            borderRight: isCurrentUser ? `4px solid ${author.color}` : undefined,
          }}
        >
          <Text size="sm">{text}</Text>
        </Paper>
        
        <Text size="xs" c="dimmed" ta={isCurrentUser ? 'right' : 'left'}>
          {formattedTime}
        </Text>
      </Stack>
      
      {isCurrentUser && (
        <Avatar 
          color={author.color}
          radius="xl"
          src={author.image}
        >
          {author.name.charAt(0).toUpperCase()}
        </Avatar>
      )}
    </Group>
  );
}

export default MessageBubble;
