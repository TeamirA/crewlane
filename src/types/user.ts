export interface UserSummaryDto {
  id: string;
  username: string;
  displayName: string;
}

export interface UserDto extends UserSummaryDto {
  email: string;
  createdAt: string;
}
