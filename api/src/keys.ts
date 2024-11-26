import { BindingKey } from "@loopback/core";
import { IncrementIdService, PasswordHasher } from "./services";
import { TokenService, UserService } from "@loopback/authentication";
import { Users } from "./models";
import { Credentials } from "./repositories";

export namespace IncrementIdBindings {
  export const INCREMENT_ID = BindingKey.create<IncrementIdService>(
    "services.incrementid.service"
  );
}
export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER =
    BindingKey.create<PasswordHasher>("services.hasher");
  export const ROUNDS = BindingKey.create<number>("services.hasher.round");
}
export namespace UserServiceBindings {
  export const USER_SERVICE = BindingKey.create<
    UserService<Users, Credentials>
  >("services.user.service");
}
export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE =
    process.env.TOKEN_SECRET || "dvchgdvcjsdbhcbdjbvjb";
  export const TOKEN_EXPIRES_IN_VALUE = parseInt(
    process.env.TOKEN_EXPIRES_IN || "0"
  );
}
export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    "authentication.jwt.secret"
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<number>(
    "authentication.jwt.expiresIn"
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    "services.jwt.service"
  );
}
