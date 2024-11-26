import { inject, Getter } from "@loopback/core";
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
  HasManyRepositoryFactory,
  Options,
} from "@loopback/repository";
import { MongoDataSource } from "../datasources";
import { Products, ProductsRelations, Users, Bids } from "../models";
import { UsersRepository } from "./users.repository";
import { BidsRepository } from "./bids.repository";
import { IncrementIdBindings } from "../keys";
import { IncrementIdService } from "../services";

export class ProductsRepository extends DefaultCrudRepository<
  Products,
  typeof Products.prototype.id,
  ProductsRelations
> {
  public readonly owner: BelongsToAccessor<Users, typeof Products.prototype.id>;

  public readonly bids: HasManyRepositoryFactory<
    Bids,
    typeof Products.prototype.id
  >;

  constructor(
    @inject("datasources.Mongo") dataSource: MongoDataSource,
    @repository.getter("UsersRepository")
    protected usersRepositoryGetter: Getter<UsersRepository>,
    @repository.getter("BidsRepository")
    protected bidsRepositoryGetter: Getter<BidsRepository>,
    @inject(IncrementIdBindings.INCREMENT_ID)
    public incrementIdService: IncrementIdService
  ) {
    super(Products, dataSource);
    this.bids = this.createHasManyRepositoryFactoryFor(
      "bids",
      bidsRepositoryGetter
    );
    this.registerInclusionResolver("bids", this.bids.inclusionResolver);
    this.owner = this.createBelongsToAccessorFor(
      "owner",
      usersRepositoryGetter
    );
    this.registerInclusionResolver("owner", this.owner.inclusionResolver);
  }
  async create(product: Products, options?: Options): Promise<Products> {
    if (!product.id) {
      let unique = false;
      let id = "";
      while (!unique) {
        id = await this.incrementIdService.generateId({
          pad: 6,
          prefix: "PD-*YY-*MM",
          random: true,
        });
        const existing = await this.findOne({ where: { id } });
        unique = !existing;
      }
      product.id = id;
    }
    return super.create(product, options);
  }
}
