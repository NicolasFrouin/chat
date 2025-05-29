import { useForm } from '@mantine/form';
import { 
  TextInput, 
  Button, 
  Paper, 
  Title, 
  Stack, 
  ColorInput,
  Alert
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { UserFormData } from '../types';

// Generate a random color in hex format
const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

interface UserFormProps {
  onSubmit: (userData: UserFormData) => void;
  error: string | null;
  isLoading?: boolean;
}

function UserForm({ onSubmit, error, isLoading = false }: UserFormProps) {
  const form = useForm<UserFormData>({
    initialValues: {
      name: '',
      color: getRandomColor(),
    },
    validate: {
      name: (value) => (!value.trim() ? 'Name is required' : null),
    },
  });

  const handleSubmit = (values: UserFormData) => {
    onSubmit(values);
  };

  return (
    <Paper radius="md" p="xl" withBorder>
      <Title order={2} ta="center" mb="lg">
        Join the Chat Room
      </Title>

      {error && (
        <Alert 
          icon={<IconAlertCircle size={16} />} 
          title="Error" 
          color="red" 
          mb="md"
        >
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="Your name"
            placeholder="John Doe"
            required
            disabled={isLoading}
            {...form.getInputProps('name')}
          />

          <ColorInput
            label="Your color"
            placeholder="Pick a color"
            format="hex"
            disabled={isLoading}
            swatches={['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']}
            {...form.getInputProps('color')}
          />

          <Button 
            type="submit" 
            fullWidth 
            mt="md"
            loading={isLoading}
          >
            Join Chat
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

export default UserForm;
