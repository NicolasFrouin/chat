export interface User {
  id: string;
  name: string;
  color: string;
  image?: string;
}

export interface Message {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  author: User;
}

export interface UserFormData {
  name: string;
  color: string;
  image?: string;
}
