// ================================================================>> Third Party Library
import SequelizeConfig from "@/config/sequelize.config";
import "colors";
import * as readlineSync from 'readline-sync';
import { Sequelize } from 'sequelize-typescript';
import { UserSeeder } from "./seeds/user/seed";
import { OrderSeeder } from "./seeds/order/seed";
import { PaymentSeeder } from "./seeds/payment/seed";
import { ScrapData } from "./seeds/product/stylekorean.scrap";

// ================================================================>> Custom Library


class SeederInitializer {

    private sequelize: Sequelize;

    constructor() {
        this.sequelize = new Sequelize(SequelizeConfig);
    }

    private async confirmSeeding(): Promise<boolean> {
        const tableNames = await this.sequelize.getQueryInterface().showAllTables();
        if (tableNames.length > 0) {
            const message = 'This will drop and seed again. Are you sure you want to proceed?'.yellow;
            return readlineSync.keyInYNStrict(message);
        }
        return true;
    }

    private async dropAndSyncDatabase() {
        await this.sequelize.sync({ force: true });
    }

    private async seedData() {
        //===================== user data
        await UserSeeder.seed();
        await ScrapData.seed();
        // await ProductGeneratorSeeder.seed(200);
        await OrderSeeder.seed();
        await PaymentSeeder.seed();
        // await OrderPaymentSeeder.seed(100)

        console.log('\x1b[32m%s\x1b[0m', 'Seeding completed successfully.');
    }

    private async handleSeedingError(error: Error) {
        await this.sequelize.sync({ force: true });
        console.log('\x1b[31m%s\x1b[0m', error.message);
        process.exit(0);
    }

    public async startSeeding() {
        try {
            const confirmation = await this.confirmSeeding();
            if (!confirmation) {
                console.log('\nSeeders have been cancelled.'.cyan);
                process.exit(0);
            }

            await this.dropAndSyncDatabase();
            await this.seedData();
            process.exit(0);
        } catch (error) {
            await this.handleSeedingError(error);
        }
    }
}

const seederInitializer = new SeederInitializer();
seederInitializer.startSeeding();
