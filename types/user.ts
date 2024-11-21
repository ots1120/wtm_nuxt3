export interface User {
  username: string;
  password: string;
  role: string;
  storeId?: number;
  userId: string;
}

export type UserWithoutPassword = Omit<User, 'password'>;
