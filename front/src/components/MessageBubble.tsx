import { Paper, Text, Group, Stack, Avatar, ActionIcon, TextInput } from '@mantine/core';
import { IconEdit, IconCheck } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { useHover } from '@mantine/hooks';

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  onEditMessage?: (messageId: string, newText: string) => void;
}

function MessageBubble({ message, isCurrentUser, onEditMessage }: MessageBubbleProps) {
  const { id, text, author, createdAt, modified } = message;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);
  const { hovered, ref: hoverRef } = useHover();

  const formattedTime = new Date(createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEditClick = () => {
    setIsEditing(true);
    setEditText(text);
  };

  const handleSaveEdit = () => {
    if (editText.trim() !== text && onEditMessage) {
      onEditMessage(id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(text);
    }
  };

  return (
    <Group
      align='flex-start'
      justify={isCurrentUser ? 'flex-end' : 'flex-start'}
      wrap='nowrap'
    >
      {!isCurrentUser && (
        <Avatar
          color={author.color}
          radius='xl'
          src={author.image}
        >
          {author.name.charAt(0).toUpperCase()}
        </Avatar>
      )}

      <Stack
        gap={4}
        style={{ maxWidth: '80%' }}
        ref={hoverRef}
      >
        {!isCurrentUser && (
          <Text
            size='xs'
            c='dimmed'
            fw={500}
          >
            {author.name}
          </Text>
        )}

        <Paper
          p='sm'
          radius='md'
          bg={isCurrentUser ? 'blue' : 'gray.1'}
          c={isCurrentUser ? 'white' : 'dark'}
          style={{
            alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
            borderLeft: !isCurrentUser ? `4px solid ${author.color}` : undefined,
            borderRight: isCurrentUser ? `4px solid ${author.color}` : undefined,
            position: 'relative',
          }}
        >
          {isEditing ? (
            <TextInput
              value={editText}
              onChange={(e) => setEditText(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              rightSection={
                <ActionIcon
                  size='sm'
                  color='green'
                  onClick={handleSaveEdit}
                >
                  <IconCheck size='1rem' />
                </ActionIcon>
              }
              placeholder='Edit your message...'
              style={{
                width: '100%',
                minWidth: '150px',
                color: isCurrentUser ? 'white' : 'inherit',
              }}
              styles={(theme) => ({
                input: {
                  backgroundColor: 'transparent',
                  border: `1px solid ${isCurrentUser ? theme.white : theme.colors.gray[5]}`,
                  color: isCurrentUser ? theme.white : theme.black,
                },
                section: {
                  color: isCurrentUser ? theme.white : theme.black,
                },
              })}
            />
          ) : (
            <>
              <Text size='sm'>{text}</Text>

              {isCurrentUser && (
                <ActionIcon
                  size='xs'
                  variant='transparent'
                  color='gray.0'
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    opacity: 0.7,
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    backgroundColor: hovered ? 'blue' : 'transparent',
                  }}
                  onClick={handleEditClick}
                >
                  <IconEdit size='0.9rem' />
                </ActionIcon>
              )}
            </>
          )}
        </Paper>

        <Text
          size='xs'
          c='dimmed'
          ta={isCurrentUser ? 'right' : 'left'}
        >
          {formattedTime}
          {modified ? ' (edited)' : ''}
        </Text>
      </Stack>

      {isCurrentUser && (
        <Avatar
          color={author.color}
          radius='xl'
          src={author.image}
        >
          {author.name.charAt(0).toUpperCase()}
        </Avatar>
      )}
    </Group>
  );
}

export default MessageBubble;
