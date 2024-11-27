import { BindingKey } from "@loopback/core";
import { IncrementIdService } from "./services";

export namespace IncrementIdBindings {
  export const INCREMENT_ID = BindingKey.create<IncrementIdService>(
    "services.incrementid.service"
  );
}
