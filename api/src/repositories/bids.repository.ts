import { inject, Getter } from "@loopback/core";
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
  Options,
} from "@loopback/repository";
import { MongoDataSource } from "../datasources";
import { Bids, BidsRelations, Users, Products } from "../models";
import { UsersRepository } from "./users.repository";
import { ProductsRepository } from "./products.repository";
import { IncrementIdService } from "../services";
import { IncrementIdBindings } from "../keys";

export class BidsRepository extends DefaultCrudRepository<
  Bids,
  typeof Bids.prototype.id,
  BidsRelations
> {
  public readonly owner: BelongsToAccessor<Users, typeof Bids.prototype.id>;

  public readonly product: BelongsToAccessor<
    Products,
    typeof Bids.prototype.id
  >;

  constructor(
    @inject("datasources.Mongo") dataSource: MongoDataSource,
    @repository.getter("UsersRepository")
    protected usersRepositoryGetter: Getter<UsersRepository>,
    @repository.getter("ProductsRepository")
    protected productsRepositoryGetter: Getter<ProductsRepository>,
    @inject(IncrementIdBindings.INCREMENT_ID)
    public incrementIdService: IncrementIdService
  ) {
    super(Bids, dataSource);
    this.product = this.createBelongsToAccessorFor(
      "product",
      productsRepositoryGetter
    );
    this.registerInclusionResolver("product", this.product.inclusionResolver);
    this.owner = this.createBelongsToAccessorFor(
      "owner",
      usersRepositoryGetter
    );
    this.registerInclusionResolver("owner", this.owner.inclusionResolver);
  }
  async create(bid: Bids, options?: Options): Promise<Bids> {
    if (!bid.id) {
      let unique = false;
      let id = "";
      while (!unique) {
        id = await this.incrementIdService.generateId({
          pad: 6,
          prefix: "BD-*YY-*MM",
          random: true,
        });
        const exist = await this.findOne({ where: { id: id } });
        unique = !exist;
      }
      bid.id = id;
    }
    return super.create(bid, options);
  }
}
