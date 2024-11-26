import { Users } from "../models";
import { UsersRepository } from "../repositories";
import { inject } from "@loopback/core";
import { repository } from "@loopback/repository";
import { faker } from "@faker-js/faker";
import { ApiApplication } from "../application";

export class UserSeeder {
  constructor(
    @repository.getter("UsersRepository")
    public usersRepository: UsersRepository
  ) {}

  async seed() {
    await this.usersRepository.deleteAll();
    let user = new Users({
      fullName: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "admin",
    });
    await this.usersRepository.create(user);
    user = new Users({
      fullName: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "company",
    });
    await this.usersRepository.create(user);
    user = new Users({
      fullName: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "company",
    });
    await this.usersRepository.create(user);
    user = new Users({
      fullName: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "student",
    });
    await this.usersRepository.create(user);
    user = new Users({
      fullName: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "student",
    });
    await this.usersRepository.create(user);

    console.log("Finish seeding users");
  }
}

async function runSeeder() {
  const app = new ApiApplication();
  const usersRepository = await app.getRepository(UsersRepository);
  const seeder = new UserSeeder(usersRepository);

  await seeder.seed();
  process.exit(0);
}

runSeeder().catch((err) => {
  console.error(err);
  process.exit(1);
});
