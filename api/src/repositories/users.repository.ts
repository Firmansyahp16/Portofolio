import { inject, Getter } from "@loopback/core";
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
  Options,
} from "@loopback/repository";
import { MongoDataSource } from "../datasources";
import { Users, UsersRelations, Products, Bids } from "../models";
import { ProductsRepository } from "./products.repository";
import { BidsRepository } from "./bids.repository";
import { IncrementIdService } from "../services";
import { IncrementIdBindings } from "../keys";

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.id,
  UsersRelations
> {
  public readonly products: HasManyRepositoryFactory<
    Products,
    typeof Users.prototype.id
  >;

  public readonly bids: HasManyRepositoryFactory<
    Bids,
    typeof Users.prototype.id
  >;

  constructor(
    @inject("datasources.Mongo") dataSource: MongoDataSource,
    @repository.getter("ProductsRepository")
    protected productsRepositoryGetter: Getter<ProductsRepository>,
    @repository.getter("BidsRepository")
    protected bidsRepositoryGetter: Getter<BidsRepository>,
    @inject(IncrementIdBindings.INCREMENT_ID)
    public incrementIdService: IncrementIdService
  ) {
    super(Users, dataSource);
    this.bids = this.createHasManyRepositoryFactoryFor(
      "bids",
      bidsRepositoryGetter
    );
    this.registerInclusionResolver("bids", this.bids.inclusionResolver);
    this.products = this.createHasManyRepositoryFactoryFor(
      "products",
      productsRepositoryGetter
    );
    this.registerInclusionResolver("products", this.products.inclusionResolver);
  }

  async create(user: Users, options?: Options): Promise<Users> {
    if (!user.id) {
      let unique = false;
      let id = "";
      while (!unique) {
        id = await this.incrementIdService.generateId({
          pad: 6,
          prefix: "US-*YY-*MM",
          random: true,
        });
        const exist = await this.findOne({ where: { id: id } });
        unique = !exist;
      }
      user.id = id;
    }
    return super.create(user, options);
  }
}
