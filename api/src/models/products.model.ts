import {
  Entity,
  model,
  property,
  belongsTo,
  hasMany,
} from "@loopback/repository";
import { Users } from "./users.model";
import { Bids } from "./bids.model";

@model()
export class Products extends Entity {
  @property({
    type: "string",
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: "string",
  })
  name?: string;

  @property({
    type: "string",
  })
  description?: string;

  @property({
    type: "string",
  })
  category?: string;

  @property({
    type: "number",
  })
  price?: number;

  @belongsTo(() => Users)
  ownerId?: string;

  @hasMany(() => Bids, { keyTo: "productId", name: "bids" })
  bidIds?: string[];

  constructor(data?: Partial<Products>) {
    super(data);
  }
}

export interface ProductsRelations {
  // describe navigational properties here
}

export type ProductsWithRelations = Products & ProductsRelations;
