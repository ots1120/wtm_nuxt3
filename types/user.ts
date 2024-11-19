export interface User {
  username: string;
  password: string;
  role: string;
  storeId?: number;
}

export type UserWithoutPassword = Omit<User, 'password'>;
