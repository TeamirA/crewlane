import type { ActivityLogRepository } from "../domain/repositories/activityLogRepository";
import type { ColumnRepository } from "../domain/repositories/columnRepository";
import type { CommentRepository } from "../domain/repositories/commentRepository";
import type { LabelRepository } from "../domain/repositories/labelRepository";
import type { NotificationRepository } from "../domain/repositories/notificationRepository";
import type { ProjectMemberRepository } from "../domain/repositories/projectMemberRepository";
import type { ProjectRepository } from "../domain/repositories/projectRepository";
import type { RefreshTokenRepository } from "../domain/repositories/refreshTokenRepository";
import type { TaskRepository } from "../domain/repositories/taskRepository";
import type { UserRepository } from "../domain/repositories/userRepository";
import type { PasswordHasher } from "../domain/services/passwordHasher";
import type { RateLimiter } from "../domain/services/rateLimiter";
import type { RealtimePublisher } from "../domain/services/realtimePublisher";
import type { TokenService } from "../domain/services/tokenService";

export interface AppDependencies {
  users: UserRepository;
  refreshTokens: RefreshTokenRepository;
  projects: ProjectRepository;
  members: ProjectMemberRepository;
  columns: ColumnRepository;
  tasks: TaskRepository;
  labels: LabelRepository;
  comments: CommentRepository;
  notifications: NotificationRepository;
  activity: ActivityLogRepository;
  passwordHasher: PasswordHasher;
  tokens: TokenService;
  rateLimiter: RateLimiter;
  realtime: RealtimePublisher;
}
