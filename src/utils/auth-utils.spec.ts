import { UserRoles } from '../auth/user-roles.enum';
import { getUserIdFromRequest, isPasswordValid } from './auth-utils';

describe('We extract user auth from request object. Admin users can connect as other users.', () => {
  it.each([
    {
      requestWithUser: {
        user: {
          asUserId: '100',
          role: UserRoles.ADMINISTRATOR,
          userId: '1',
        },
      },
      connectAsUser: true,
      expectedUserId: '100',
    },
    {
      requestWithUser: {
        user: {
          asUserId: '100',
          role: UserRoles.ADMINISTRATOR,
          userId: '1',
        },
      },
      connectAsUser: false,
      expectedUserId: '1',
    },
    {
      requestWithUser: {
        user: {
          asUserId: '100',
          role: UserRoles.USER,
          userId: '1',
        },
      },
      connectAsUser: false,
      expectedUserId: '1',
    },
    {
      requestWithUser: {
        user: {
          asUserId: '100',
          role: UserRoles.USER,
          userId: '1',
        },
      },
      connectAsUser: true,
      expectedUserId: '100',
    },
  ])(
    'Request returns correct user Id',
    ({ connectAsUser, expectedUserId, requestWithUser }) => {
      expect(
        getUserIdFromRequest({ requestWithUser, connectAsUser: connectAsUser }),
      ).toEqual(expectedUserId);
    },
  );
});

describe('Crypted password should be valid', () => {
  it.each([
    {
      password: 'GoodCollect.123',
      hashedPassword:
        '$2b$10$d0zLr3qbmeQmkO94lmP/Yu4ocAOYUBotkqysgmnm.cnivkIEB99kC',
      expectedValidity: true,
    },
    {
      password: 'GoodCollect.123',
      hashedPassword:
        '$2b$10$d0zLr3qbmeQmkO94l2942923291AOYUBotkqysgmnm.cnivkIEB99kC',
      expectedValidity: false,
    },
  ])(
    'Passing a password should return a hashed password',
    async ({ password, expectedValidity, hashedPassword }) => {
      expect(await isPasswordValid(password, hashedPassword)).toBe(
        expectedValidity,
      );
    },
  );
});
