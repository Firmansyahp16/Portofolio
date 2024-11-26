import { inject } from "@loopback/core";
import { HttpErrors } from "@loopback/rest";
import { promisify } from "util";
import { TokenServiceBindings } from "../keys";
import { MyUserProfile } from "./user.service";
import { securityId } from "@loopback/security";

const jwt = require("jsonwebtoken");
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService {
  @inject(TokenServiceBindings.TOKEN_SECRET)
  public readonly jwtSecret?: string;
  @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
  public readonly expiresSecret?: number;

  async generateToken(userProfile: MyUserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        "Error while generating token :userProfile is null"
      );
    }
    let token = "";
    try {
      token = await signAsync(userProfile, this.jwtSecret, {
        expiresIn: this.expiresSecret,
      });
      return token;
    } catch (err) {
      throw new HttpErrors.Unauthorized(`error generating token ${err}`);
    }
  }

  async verifyToken(token: string): Promise<MyUserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token:'token' is null`
      );
    }
    let userProfile: MyUserProfile;
    try {
      const decryptedToken = await verifyAsync(token, this.jwtSecret);
      userProfile = Object.assign(
        { [securityId]: "", id: "", name: "", roles: [] },
        {
          [securityId]: decryptedToken.id,
          id: decryptedToken.id,
          name: decryptedToken.name,
          roles: decryptedToken.roles,
        }
      );
    } catch (err: any) {
      throw new HttpErrors.Unauthorized(`Error verifying token:${err.message}`);
    }
    return userProfile;
  }
}
