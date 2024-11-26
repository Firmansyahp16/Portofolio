import { Bids } from "../models";
import {
  ProductsRepository,
  UsersRepository,
  BidsRepository,
} from "../repositories";
import { inject } from "@loopback/core";
import { repository } from "@loopback/repository";
import { faker } from "@faker-js/faker";
import { ApiApplication } from "../application";

export class BidSeeder {
  constructor(
    @repository.getter("BidsRepository")
    public bidsRepository: BidsRepository,
    @repository.getter("ProductsRepository")
    public productRepository: ProductsRepository,
    @repository.getter("UsersRepository")
    public usersRepository: UsersRepository
  ) {}

  async seed() {
    await this.bidsRepository.deleteAll();
    const companies = await this.usersRepository.find({
      where: {
        role: "company",
      },
    });

    const products = await this.productRepository.find();

    // Menyimpan bids yang dibuat untuk setiap produk dan perusahaan
    const bidsToUpdateProducts = new Map<string, string[]>(); // Menyimpan ID bids per produk
    const bidsToUpdateCompanies = new Map<string, string[]>(); // Menyimpan ID bids per perusahaan

    for (const company of companies) {
      for (const product of products) {
        // Bid pertama dengan harga acak dalam rentang yang sesuai
        let bid = new Bids({
          ownerId: company.id,
          productId: product.id,
          amount: faker.number.float({
            max: Number(product.price) + 100,
            min: Number(product.price),
          }),
        });

        // Simpan bid ke database dan ambil ID-nya
        const createdBid = await this.bidsRepository.create(bid);

        // Menambahkan ID bid pada produk
        if (!bidsToUpdateProducts.has(product.id as string)) {
          bidsToUpdateProducts.set(product.id as string, []);
        }
        bidsToUpdateProducts
          .get(product.id as string)
          ?.push(createdBid.id as string);

        // Menambahkan ID bid pada perusahaan
        if (!bidsToUpdateCompanies.has(company.id as string)) {
          bidsToUpdateCompanies.set(company.id as string, []);
        }
        bidsToUpdateCompanies
          .get(company.id as string)
          ?.push(createdBid.id as string);

        // Bid kedua dengan harga acak lebih rendah
        bid = new Bids({
          ownerId: company.id,
          productId: product.id,
          amount: faker.number.float({
            max: Number(product.price) + 50,
            min: Number(product.price),
          }),
        });

        // Simpan bid kedua ke database dan ambil ID-nya
        const createdBid2 = await this.bidsRepository.create(bid);

        // Menambahkan ID bid kedua pada produk dan perusahaan
        bidsToUpdateProducts
          .get(product.id as string)
          ?.push(createdBid2.id as string);
        bidsToUpdateCompanies
          .get(company.id as string)
          ?.push(createdBid2.id as string);
      }
    }

    // Update produk dengan ID bids yang baru ditambahkan
    for (const [productId, bidIds] of bidsToUpdateProducts) {
      await this.productRepository.updateById(productId, {
        bidIds: bidIds, // Menyimpan ID bids dalam array
      });
    }

    // Update perusahaan dengan ID bids yang baru ditambahkan
    for (const [companyId, bidIds] of bidsToUpdateCompanies) {
      await this.usersRepository.updateById(companyId, {
        bidIds: bidIds, // Menyimpan ID bids dalam array
      });
    }
    console.log("Finish seeding bids");
  }
}

async function runSeeder() {
  const app = new ApiApplication();
  const usersRepository = await app.getRepository(UsersRepository);
  const productRepository = await app.getRepository(ProductsRepository);
  const bidsRepository = await app.getRepository(BidsRepository);
  const seeder = new BidSeeder(
    bidsRepository,
    productRepository,
    usersRepository
  );
  await seeder.seed();
  process.exit(0);
}

runSeeder().catch((err) => {
  console.error(err);
  process.exit(1);
});
