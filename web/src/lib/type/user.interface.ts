// types/user.ts

export interface User {
    id: string,
    username: string;
    password: string;
    email?: string;
    role: string;
    firstName?: string;
    lastName?: string;
    createdAt: string;
    updatedAt: string;
  }