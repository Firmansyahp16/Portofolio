import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from "@loopback/repository";
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  getWhereSchemaFor,
} from "@loopback/rest";
import { Bids, Products, Users } from "../models";
import { UsersRepository } from "../repositories";
import { authenticate } from "@loopback/authentication";
import { inject } from "@loopback/core";

export class UsersController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository
  ) {}

  @post("/users")
  @response(200, {
    description: "Users model instance",
    content: { "application/json": { schema: getModelSchemaRef(Users) } },
  })
  async create(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Users, {
            title: "NewUsers",
            exclude: ["id"],
          }),
        },
      },
    })
    users: Omit<Users, "id">
  ): Promise<Users> {
    return this.usersRepository.create(users);
  }

  @get("/users/count")
  @response(200, {
    description: "Users model count",
    content: { "application/json": { schema: CountSchema } },
  })
  async count(@param.where(Users) where?: Where<Users>): Promise<Count> {
    return this.usersRepository.count(where);
  }

  @get("/users")
  @response(200, {
    description: "Array of Users model instances",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: getModelSchemaRef(Users, { includeRelations: true }),
        },
      },
    },
  })
  async find(@param.filter(Users) filter?: Filter<Users>): Promise<Users[]> {
    return this.usersRepository.find(filter);
  }

  @patch("/users")
  @response(200, {
    description: "Users PATCH success count",
    content: { "application/json": { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Users, { partial: true }),
        },
      },
    })
    users: Users,
    @param.where(Users) where?: Where<Users>
  ): Promise<Count> {
    return this.usersRepository.updateAll(users, where);
  }

  @get("/users/{id}")
  @response(200, {
    description: "Users model instance",
    content: {
      "application/json": {
        schema: getModelSchemaRef(Users, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string("id") id: string,
    @param.filter(Users, { exclude: "where" })
    filter?: FilterExcludingWhere<Users>
  ): Promise<Users> {
    return this.usersRepository.findById(id, filter);
  }

  @patch("/users/{id}")
  @response(204, {
    description: "Users PATCH success",
  })
  async updateById(
    @param.path.string("id") id: string,
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Users, { partial: true }),
        },
      },
    })
    users: Users
  ): Promise<void> {
    await this.usersRepository.updateById(id, users);
  }

  @put("/users/{id}")
  @response(204, {
    description: "Users PUT success",
  })
  async replaceById(
    @param.path.string("id") id: string,
    @requestBody() users: Users
  ): Promise<void> {
    await this.usersRepository.replaceById(id, users);
  }

  @del("/users/{id}")
  @response(204, {
    description: "Users DELETE success",
  })
  async deleteById(@param.path.string("id") id: string): Promise<void> {
    await this.usersRepository.deleteById(id);
  }

  // Bids

  @get("/users/{id}/bids", {
    responses: {
      "200": {
        description: "Array of Users has many Bids",
        content: {
          "application/json": {
            schema: { type: "array", items: getModelSchemaRef(Bids) },
          },
        },
      },
    },
  })
  async findBids(
    @param.path.string("id") id: string,
    @param.query.object("filter") filter?: Filter<Bids>
  ): Promise<Bids[]> {
    return this.usersRepository.bids(id).find(filter);
  }

  @post("/users/{id}/bids", {
    responses: {
      "200": {
        description: "Users model instance",
        content: { "application/json": { schema: getModelSchemaRef(Bids) } },
      },
    },
  })
  async createBid(
    @param.path.string("id") id: typeof Users.prototype.id,
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Bids, {
            title: "NewBidsInUsers",
            exclude: ["id"],
            optional: ["ownerId"],
          }),
        },
      },
    })
    bids: Omit<Bids, "id">
  ): Promise<Bids> {
    return this.usersRepository.bids(id).create(bids);
  }

  @patch("/users/{id}/bids", {
    responses: {
      "200": {
        description: "Users.Bids PATCH success count",
        content: { "application/json": { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.string("id") id: string,
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Bids, { partial: true }),
        },
      },
    })
    bids: Partial<Bids>,
    @param.query.object("where", getWhereSchemaFor(Bids)) where?: Where<Bids>
  ): Promise<Count> {
    return this.usersRepository.bids(id).patch(bids, where);
  }

  @del("/users/{id}/bids", {
    responses: {
      "200": {
        description: "Users.Bids DELETE success count",
        content: { "application/json": { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.string("id") id: string,
    @param.query.object("where", getWhereSchemaFor(Bids)) where?: Where<Bids>
  ): Promise<Count> {
    return this.usersRepository.bids(id).delete(where);
  }

  // Products

  @get("/users/{id}/products", {
    responses: {
      "200": {
        description: "Array of Users has many Products",
        content: {
          "application/json": {
            schema: { type: "array", items: getModelSchemaRef(Products) },
          },
        },
      },
    },
  })
  async findProducts(
    @param.path.string("id") id: string,
    @param.query.object("filter") filter?: Filter<Products>
  ): Promise<Products[]> {
    return this.usersRepository.products(id).find(filter);
  }

  @post("/users/{id}/products", {
    responses: {
      "200": {
        description: "Users model instance",
        content: {
          "application/json": { schema: getModelSchemaRef(Products) },
        },
      },
    },
  })
  async createProduct(
    @param.path.string("id") id: typeof Users.prototype.id,
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Products, {
            title: "NewProductsInUsers",
            exclude: ["id"],
            optional: ["ownerId"],
          }),
        },
      },
    })
    products: Omit<Products, "id">
  ): Promise<Products> {
    return this.usersRepository.products(id).create(products);
  }

  @patch("/users/{id}/products", {
    responses: {
      "200": {
        description: "Users.Products PATCH success count",
        content: { "application/json": { schema: CountSchema } },
      },
    },
  })
  async patchProduct(
    @param.path.string("id") id: string,
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Products, { partial: true }),
        },
      },
    })
    products: Partial<Products>,
    @param.query.object("where", getWhereSchemaFor(Products))
    where?: Where<Products>
  ): Promise<Count> {
    return this.usersRepository.products(id).patch(products, where);
  }

  @del("/users/{id}/products", {
    responses: {
      "200": {
        description: "Users.Products DELETE success count",
        content: { "application/json": { schema: CountSchema } },
      },
    },
  })
  async deleteProduct(
    @param.path.string("id") id: string,
    @param.query.object("where", getWhereSchemaFor(Products))
    where?: Where<Products>
  ): Promise<Count> {
    return this.usersRepository.products(id).delete(where);
  }

  // Authentication
}
