import { Kysely } from "kysely";
import { DB } from "../database.types";
import { faker } from '@faker-js/faker';

export async function seed(db: Kysely<DB>): Promise<void> {

    const fakeUsers = Array.from({ length: 10 }, () => ({
        email: faker.internet.email(),
        username: faker.internet.username(),
        password: faker.internet.password({ length: 20 }),
        access_token: null,
        avatar_url: faker.image.avatar(),
    }));

    await db
        .insertInto('users')
        .values(fakeUsers)
        .execute();

}