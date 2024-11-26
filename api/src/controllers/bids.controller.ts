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
} from "@loopback/rest";
import { Bids, Products, Users } from "../models";
import { BidsRepository } from "../repositories";
import { authenticate } from "@loopback/authentication";

export class BidsController {
  constructor(
    @repository(BidsRepository)
    public bidsRepository: BidsRepository
  ) {}

  @authenticate("jwt")
  @post("/bids")
  @response(200, {
    description: "Bids model instance",
    content: { "application/json": { schema: getModelSchemaRef(Bids) } },
  })
  async create(
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Bids, {
            title: "NewBids",
            exclude: ["id"],
          }),
        },
      },
    })
    bids: Omit<Bids, "id">
  ): Promise<Bids> {
    return this.bidsRepository.create(bids);
  }

  @authenticate("jwt")
  @get("/bids/count")
  @response(200, {
    description: "Bids model count",
    content: { "application/json": { schema: CountSchema } },
  })
  async count(@param.where(Bids) where?: Where<Bids>): Promise<Count> {
    return this.bidsRepository.count(where);
  }

  @authenticate("jwt")
  @get("/bids")
  @response(200, {
    description: "Array of Bids model instances",
    content: {
      "application/json": {
        schema: {
          type: "array",
          items: getModelSchemaRef(Bids, { includeRelations: true }),
        },
      },
    },
  })
  async find(@param.filter(Bids) filter?: Filter<Bids>): Promise<Bids[]> {
    return this.bidsRepository.find(filter);
  }

  @authenticate("jwt")
  @get("/bids/{id}")
  @response(200, {
    description: "Bids model instance",
    content: {
      "application/json": {
        schema: getModelSchemaRef(Bids, { includeRelations: true }),
      },
    },
  })
  async findById(
    @param.path.string("id") id: string,
    @param.filter(Bids, { exclude: "where" })
    filter?: FilterExcludingWhere<Bids>
  ): Promise<Bids> {
    return this.bidsRepository.findById(id, filter);
  }

  @authenticate("jwt")
  @patch("/bids/{id}")
  @response(204, {
    description: "Bids PATCH success",
  })
  async updateById(
    @param.path.string("id") id: string,
    @requestBody({
      content: {
        "application/json": {
          schema: getModelSchemaRef(Bids, { partial: true }),
        },
      },
    })
    bids: Bids
  ): Promise<void> {
    await this.bidsRepository.updateById(id, bids);
  }

  @authenticate("jwt")
  @del("/bids/{id}")
  @response(204, {
    description: "Bids DELETE success",
  })
  async deleteById(@param.path.string("id") id: string): Promise<void> {
    await this.bidsRepository.deleteById(id);
  }

  // Products

  @authenticate("jwt")
  @get("/bids/{id}/products")
  @response(200, {
    description: "Products belonging to Bids",
    content: {
      "application/json": {
        schema: getModelSchemaRef(Products),
      },
    },
  })
  async getProducts(
    @param.path.string("id") id: typeof Bids.prototype.id
  ): Promise<Products> {
    return this.bidsRepository.product(id);
  }

  // Owner

  @authenticate("jwt")
  @get("/bids/{id}/owner")
  @response(200, {
    description: "Owner belonging to Bids",
    content: {
      "application/json": {
        schema: getModelSchemaRef(Users),
      },
    },
  })
  async getUsers(
    @param.path.string("id") id: typeof Bids.prototype.id
  ): Promise<Users> {
    return this.bidsRepository.owner(id);
  }
}
