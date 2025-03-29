import { user } from "../../../utils/types";
import { generateToken } from "../../../middleware/jwt";

export function generateUserData(userData: user) {
  if (!userData) {
    throw new Error("User data is required");
  }

  const user: user = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    createdAt: userData.createdAt,
    role: userData.role,
    profileId: userData.profileId,
  };

  const token = generateToken(user);

  return {
    ...userData,
    ...user,
    token,
  };
}
