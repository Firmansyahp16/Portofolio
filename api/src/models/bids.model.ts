import { Entity, model, property, belongsTo } from "@loopback/repository";
import { Users } from "./users.model";
import { Products } from "./products.model";

@model()
export class Bids extends Entity {
  @property({
    type: "string",
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: "number",
    default: 0,
  })
  amount?: number;

  @belongsTo(() => Users)
  ownerId?: string;

  @belongsTo(() => Products)
  productId?: string;

  constructor(data?: Partial<Bids>) {
    super(data);
  }
}

export interface BidsRelations {
  // describe navigational properties here
}

export type BidsWithRelations = Bids & BidsRelations;
