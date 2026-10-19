export interface UserSummary {
  id: string;
  username: string;
  displayName: string;
}

export interface User extends UserSummary {
  email: string;
  createdAt: Date;
}

export interface UserWithPasswordHash extends User {
  passwordHash: string;
}
