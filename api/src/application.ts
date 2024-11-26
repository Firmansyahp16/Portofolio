import { BootMixin } from "@loopback/boot";
import { ApplicationConfig } from "@loopback/core";
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from "@loopback/rest-explorer";
import { ServiceMixin } from "@loopback/service-proxy";
import {
  RestApplication,
  RestBindings,
  RestServerConfig,
} from "@loopback/rest";
import path from "path";
import { MySequence } from "./sequence";
import { RepositoryMixin } from "@loopback/repository";
import {
  IncrementIdBindings,
  PasswordHasherBindings,
  TokenServiceBindings,
  TokenServiceConstants,
  UserServiceBindings,
} from "./keys";
import { BcryptHasher, IncrementIdService, MyUserService } from "./services";
import {
  BidsRepository,
  ProductsRepository,
  UsersRepository,
} from "./repositories";
import { MongoDataSource } from "./datasources";
import { JWTService } from "./services";
import { SECURITY_SCHEME_SPEC } from "@loopback/authentication-jwt";

export { ApplicationConfig };

const restConfig: RestServerConfig = {
  cors: {
    origin: ["http://localhost:3000"], // URL React UI Anda
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
    // credentials: true, // Jika diperlukan
  },
};

export class ApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication))
) {
  constructor(options: ApplicationConfig = {}) {
    options.rest = { ...options.rest, ...restConfig };
    super(options);

    this.dataSource(MongoDataSource, "Mongo");

    // Set up the custom sequence
    this.sequence(MySequence);

    this.setupBinding();

    this.addSecuritySpec();

    this.repository(UsersRepository);
    this.repository(ProductsRepository);
    this.repository(BidsRepository);

    // Set up default home page
    this.static("/", path.join(__dirname, "../public"));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: "/explorer",
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ["controllers"],
        extensions: [".controller.js"],
        nested: true,
      },
    };
  }
  setupBinding(): void {
    this.bind(RestBindings.PORT).to(3000);
    this.bind(RestBindings.HOST).to("0.0.0.0");
    this.bind(IncrementIdBindings.INCREMENT_ID).toClass(IncrementIdService);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(PasswordHasherBindings.ROUNDS).to(10);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);

    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE
    );
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE
    );
  }
  addSecuritySpec(): void {
    this.api({
      openapi: "3.0.0",
      info: {
        title: "test application",
        version: "1.0.0",
      },
      paths: {},
      components: { securitySchemes: SECURITY_SCHEME_SPEC },
      security: [
        {
          // secure all endpoints with 'jwt'
          jwt: [],
        },
      ],
      servers: [{ url: "/" }],
    });
  }
}
