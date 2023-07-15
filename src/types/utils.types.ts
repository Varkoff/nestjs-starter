import { UserRoles } from '@/auth/user-roles.enum';

export type ApiFeedbackResponse = Promise<{
  error: boolean;
  message: string;
}>;

export type JWTPayloadType = {
  userId: string;
  asUserId: string | null;
  role: UserRoles;
};

export type RequestWithUser = {
  user: JWTPayloadType;
};
