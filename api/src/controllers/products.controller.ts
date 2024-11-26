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
import { ProductsRepository } from "../repositories";
import { authenticate } from "@loopback/authentication";

export class ProductsController {
  constructor(
    @repository(ProductsRepository)
    public productsRepository: ProductsRepository
  ) {}

  @authenticate("jwt")
  @post("/products")
  @response(200, {
    description: "Products model instance",
    content: { "application/json": { schema: getModelSchemaRef(Products) } },
  })
  async create(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Products, {
            title: "NewProducts",
            exclude: ["id"],
          }),
        },
      },
    })
    products: Omit<Products, "id">
  ): Promise<Products> {
    return this.productsRepository.create(products);
  }

  @authenticate("jwt")
  @get("/products/count")
  @response(200, {
    description: "Products model count",
    content: { "application/json": { schema: CountSchema } },
  })
  async count(@param.where(Products) where?: Where<Products>): Promise<Count> {
    return this.productsRepository.count(where);
  }

  @authenticate("jwt")
  @get("/products")
  @response(200, {
    description: "Array of Products model instances",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: getModelSchemaRef(Products, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Products) filter?: Filter<Products>
  ): Promise<Products[]> {
    return this.productsRepository.find(filter);
  }

  @authenticate("jwt")
  @patch("/products")
  @response(200, {
    description: "Products PATCH success count",
    content: { "application/json": { schema: CountSchema } },
  })
  async updateAll(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Products, { partial: true }),
        },
      },
    })
    products: Products,
    @param.where(Products) where?: Where<Products>
  ): Promise<Count> {
    return this.productsRepository.updateAll(products, where);
  }

  @authenticate("jwt")
  @get("/products/{id}")
  @response(200, {
    description: "Products model instance",
    content: {
      "application/json": {
        schema: getModelSchemaRef(Products, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string("id") id: string,
    @param.filter(Products, { exclude: "where" })
    filter?: FilterExcludingWhere<Products>
  ): Promise<Products> {
    return this.productsRepository.findById(id, filter);
  }

  @authenticate("jwt")
  @patch("/products/{id}")
  @response(204, {
    description: "Products PATCH success",
  })
  async updateById(
    @param.path.string("id") id: string,
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Products, { partial: true }),
        },
      },
    })
    products: Products
  ): Promise<void> {
    await this.productsRepository.updateById(id, products);
  }

  @authenticate("jwt")
  @put("/products/{id}")
  @response(204, {
    description: "Products PUT success",
  })
  async replaceById(
    @param.path.string("id") id: string,
    @requestBody() products: Products
  ): Promise<void> {
    await this.productsRepository.replaceById(id, products);
  }

  @authenticate("jwt")
  @del("/products/{id}")
  @response(204, {
    description: "Products DELETE success",
  })
  async deleteById(@param.path.string("id") id: string): Promise<void> {
    await this.productsRepository.deleteById(id);
  }

  // Bids

  @authenticate("jwt")
  @get("/products/{id}/bids")
  @response(200, {
    description: "Array of Products has many Bids",
    content: {
      "application/json": {
        schema: { type: "array", items: getModelSchemaRef(Bids) },
      },
    },
  })
  async findBids(
    @param.path.string("id") id: string,
    @param.query.object("filter") filter?: Filter<Bids>
  ): Promise<Bids[]> {
    return this.productsRepository.bids(id).find(filter);
  }

  @authenticate("jwt")
  @post("/products/{id}/bids")
  @response(200, {
    description: "Products model instance",
    content: { "application/json": { schema: getModelSchemaRef(Bids) } },
  })
  async createBid(
    @param.path.string("id") id: typeof Products.prototype.id,
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Bids, {
            title: "NewBidsInProducts",
            exclude: ["id"],
            optional: ["productId"],
          }),
        },
      },
    })
    bids: Omit<Bids, "id">
  ): Promise<Bids> {
    return this.productsRepository.bids(id).create(bids);
  }

  @authenticate("jwt")
  @patch("/products/{id}/bids")
  @response(200, {
    description: "Products.Bids PATCH success count",
    content: { "application/json": { schema: CountSchema } },
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
    return this.productsRepository.bids(id).patch(bids, where);
  }

  @authenticate("jwt")
  @del("/products/{id}/bids")
  @response(200, {
    description: "Products.Bids DELETE success count",
    content: { "application/json": { schema: CountSchema } },
  })
  async delete(
    @param.path.string("id") id: string,
    @param.query.object("where", getWhereSchemaFor(Bids)) where?: Where<Bids>
  ): Promise<Count> {
    return this.productsRepository.bids(id).delete(where);
  }

  // Owner

  @authenticate("jwt")
  @get("/products/{id}/owner")
  @response(200, {
    description: "Owner belonging to Products",
    content: {
      "application/json": {
        schema: getModelSchemaRef(Users),
      },
    },
  })
  async getUsers(
    @param.path.string("id") id: typeof Products.prototype.id
  ): Promise<Users> {
    return this.productsRepository.owner(id);
  }
}
