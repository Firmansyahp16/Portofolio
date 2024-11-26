import { UserService } from "@loopback/authentication";
import { securityId, UserProfile } from "@loopback/security";
import { Users } from "../models";
import { Credentials, UsersRepository } from "../repositories";
import { repository } from "@loopback/repository";
import { PasswordHasherBindings } from "../keys";
import { PasswordHasher } from "./hash-password.service";
import { inject } from "@loopback/core";

export interface MyUserProfile extends UserProfile {
  name?: string;
  id?: string;
  email?: string;
  roles: string[];
}

export class MyUserService implements UserService<Users, Credentials> {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: PasswordHasher
  ) {}
  async verifyCredentials(credentials: Credentials): Promise<Users> {
    const user = await this.usersRepository.findOne({
      where: {
        email: credentials.email,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const passwordMatches = await this.hasher.comparePassword(
      credentials.password,
      String(user.password)
    );
    if (!passwordMatches) {
      throw new Error("Invalid password");
    }
    return user;
  }
  convertToUserProfile(user: Users): MyUserProfile {
    return {
      [securityId]: user.id!.toString(),
      name: user.fullName,
      id: user.id,
      email: user.email,
      roles: [String(user.role)],
    };
  }
}
