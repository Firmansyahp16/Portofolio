import { injectable, /* inject, */ BindingScope } from "@loopback/core";
import { DateTime } from "luxon";

@injectable({ scope: BindingScope.TRANSIENT })
export class IncrementIdService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
  public generateId = async (options: {
    pad: number;
    prefix: string;
    random?: boolean;
  }) => {
    let id = "";
    const date = DateTime.now();
    let prefix = options.prefix;
    let random = "";
    if (options.random) {
      random = Math.floor(Math.random() * 90 + 10).toString();
    }
    if (prefix) {
      prefix = prefix.replace("*YYYY", date.toFormat("yyyy"));
      prefix = prefix.replace("*YY", date.toFormat("yy"));
      prefix = prefix.replace("*MM", date.toFormat("MM"));
      prefix = prefix.replace("*DD", date.toFormat("dd"));
      prefix = prefix.replace("*RR", random);
    }
    if (options.pad) {
      id = Math.round(date.toSeconds()).toString().slice(-options.pad);
    }
    id = prefix + "-" + id;
    return id;
  };
}
