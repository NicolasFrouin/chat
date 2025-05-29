import { Modal, Button, Group, ColorPicker, Stack, Text } from '@mantine/core';
import { useState } from 'react';

interface ColorPickerModalProps {
  opened: boolean;
  close: () => void;
  currentColor: string;
  onColorChange: (color: string) => void;
}

function ColorPickerModal({ opened, close, currentColor, onColorChange }: ColorPickerModalProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor);

  const handleSubmit = () => {
    onColorChange(selectedColor);
    close();
  };

  return (
    <Modal opened={opened} onClose={close} title="Change Your Color" centered>
      <Stack>
        <Text size="sm">
          Choose a new color for your profile. This will update the color of your messages for everyone in the chat.
        </Text>
        
        <ColorPicker 
          format="hex"
          value={selectedColor}
          onChange={setSelectedColor}
          swatches={[
            '#ff0000', '#ff8000', '#ffff00', '#80ff00', '#00ff00',
            '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff',
            '#ff00ff', '#ff0080', '#ff69b4', '#9370db', '#3cb371'
          ]}
        />
        
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={close}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default ColorPickerModal;
