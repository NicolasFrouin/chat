export interface User {
  id: string;
  name: string;
  color: string;
  image?: string;
}

export interface Message {
  id: string;
  text: string;
  author: User;
  createdAt: string;
  modified: boolean;
}

export interface UserFormData {
  name: string;
  color: string;
}
