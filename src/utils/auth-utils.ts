import { UserRoles } from '../auth/user-roles.enum';
import { RequestWithUser } from '@/types/utils.types';
import * as bcrypt from 'bcrypt';

export const generateHashedPassword = async (password: string) => {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
};

export const isPasswordValid = async (
  password: string,
  encryptedPassword: string,
) => {
  return await bcrypt.compare(password, encryptedPassword);
};

export const getUserIdFromRequest = ({
  requestWithUser,
  connectAsUser = true,
}: {
  requestWithUser: RequestWithUser;
  connectAsUser?: boolean;
}) => {
  // L'administrateur essaie de se connecter en tant qu'un utilisateur, on renvoie l'ID de l'utilisateur.
  const isAdmin = requestWithUser?.user?.role === UserRoles.ADMINISTRATOR;
  const hasAsUserId = Boolean(requestWithUser?.user?.asUserId);
  const canConnectAsUser = connectAsUser && hasAsUserId;
  if (isAdmin && canConnectAsUser) {
    return requestWithUser?.user?.asUserId;
  }

  if (canConnectAsUser) {
    return requestWithUser?.user?.asUserId;
  }

  // L'utilisateur n'est pas administrateur
  // Ou il n'essaie pas de se connecter en tant qu'un autre utilisateur
  // Ou l'option connectAsUser est désactivée
  // On renvoie l'id de l'utilisateur connecté
  return requestWithUser?.user?.userId;
};
