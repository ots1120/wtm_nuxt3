export interface User {
  email: string;
  password: string;
  roles: string[];
  storeId?: number;
}

export type UserWithoutPassword = Omit<User, 'password'>;
