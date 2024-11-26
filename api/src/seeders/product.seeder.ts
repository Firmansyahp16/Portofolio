import { Products } from "../models";
import { ProductsRepository, UsersRepository } from "../repositories";
import { inject } from "@loopback/core";
import { repository } from "@loopback/repository";
import { faker } from "@faker-js/faker";
import { ApiApplication } from "../application";

export class ProductSeeder {
  constructor(
    @repository.getter("ProductsRepository")
    public productRepository: ProductsRepository,
    @repository.getter("UsersRepository")
    public usersRepository: UsersRepository
  ) {}

  async seed() {
    await this.productRepository.deleteAll();
    const users = await this.usersRepository.find({
      where: {
        role: "student",
      },
    });
    for (const user of users) {
      let product = new Products({
        name: faker.commerce.productName(),
        category: faker.commerce.department(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        ownerId: user.id,
      });
      await this.productRepository.create(product);
      product = new Products({
        name: faker.commerce.productName(),
        category: faker.commerce.department(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        ownerId: user.id,
      });
      await this.productRepository.create(product);
    }
    console.log("Finish seeding products");
  }
}

async function runSeeder() {
  const app = new ApiApplication();
  const usersRepository = await app.getRepository(UsersRepository);
  const productRepository = await app.getRepository(ProductsRepository);
  const seeder = new ProductSeeder(productRepository, usersRepository);
  await seeder.seed();
  process.exit(0);
}

runSeeder().catch((err) => {
  console.error(err);
  process.exit(1);
});
