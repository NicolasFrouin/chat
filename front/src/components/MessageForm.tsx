import { useState } from 'react';
import { TextInput, Button, Group } from '@mantine/core';

interface MessageFormProps {
  onSubmit: (text: string) => void;
  disabled?: boolean;
}

function MessageForm({ onSubmit, disabled }: MessageFormProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    onSubmit(trimmedMessage);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <Group
        wrap='nowrap'
        align='flex-start'
      >
        <TextInput
          placeholder={disabled ? 'Connecting...' : 'Type your message...'}
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          style={{ flexGrow: 1 }}
          disabled={disabled}
        />
        <Button
          type='submit'
          disabled={!message.trim() || disabled}
          rightSection={'✅'}
        >
          Send
        </Button>
      </Group>
    </form>
  );
}

export default MessageForm;
