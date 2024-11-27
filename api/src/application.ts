import { BootMixin } from "@loopback/boot";
import { ApplicationConfig } from "@loopback/core";
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from "@loopback/rest-explorer";
import { ServiceMixin } from "@loopback/service-proxy";
import { RestApplication } from "@loopback/rest";
import path from "path";
import { MySequence } from "./sequence";
import { RepositoryMixin } from "@loopback/repository";
import { IncrementIdBindings } from "./keys";
import { IncrementIdService } from "./services";
import {
  BidsRepository,
  ProductsRepository,
  UsersRepository,
} from "./repositories";
import { MongoDataSource } from "./datasources";

export { ApplicationConfig };

export class ApiApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication))
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    this.dataSource(MongoDataSource, "Mongo");

    // Set up the custom sequence
    this.sequence(MySequence);

    this.setupBinding();

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
    this.bind(IncrementIdBindings.INCREMENT_ID).toClass(IncrementIdService);
  }
}
