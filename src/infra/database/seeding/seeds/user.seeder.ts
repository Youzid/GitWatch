import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import UserTypeOrmEntity, { UserRole } from '../../../../modules/v1/user/entities/user.entity';
import { faker } from '@faker-js/faker';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(UserTypeOrmEntity);

    const data = {
       firstName: 'Admin',
    lastName: 'User',
    userName: 'admin',
    email: "admin@gitscope.com",
    password: await hash('admin', 10),
    phone: faker.phone.number(),
    avatar: faker.image.avatar(),
    role: UserRole.ADMIN,
    isActivated: true,
    };

    const user = await repository.findOneBy({ userName: data.userName });

    // Insert only one record with this username.
    if (!user) {
      await repository.insert([data]);
    }

    // ---------------------------------------------------

    const userFactory =  factoryManager.get(UserTypeOrmEntity);

    // Insert only one record.
    await userFactory.save();

    // Insert many records in database.
    await userFactory.saveMany(40);
  }
}
