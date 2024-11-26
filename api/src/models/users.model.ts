import { Entity, model, property, hasMany } from "@loopback/repository";
import { Products } from "./products.model";
import { Bids } from "./bids.model";

@model()
export class Users extends Entity {
  @property({
    type: "string",
    id: true,
    generated: false,
  })
  id?: string;

  @property({
    type: "string",
  })
  fullName?: string;

  @property({
    type: "string",
  })
  email?: string;

  @property({
    type: "string",
  })
  password?: string;

  @property({
    type: "string",
  })
  role?: "admin" | "company" | "student";

  @hasMany(() => Products, { keyTo: "ownerId", name: "products" })
  productIds?: string[];

  @hasMany(() => Bids, { keyTo: "ownerId", name: "bids" })
  bidIds?: string[];

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;
