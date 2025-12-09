import { hash } from 'bcrypt';
import { setSeederFactory } from 'typeorm-extension';
import UserTypeOrmEntity, { UserRole } from '../../../../modules/v1/user/entities/user.entity';


export default setSeederFactory(UserTypeOrmEntity, async (faker) => {
    const user = new UserTypeOrmEntity();

    user.firstName = faker.person.firstName();
    user.lastName = faker.person.lastName();
    user.userName = faker.internet.username({ firstName: user.firstName, lastName: user.lastName });
      user.email = faker.internet.email(); 
    user.password = await hash(faker.internet.password(), 10);
    user.phone = faker.phone.number();
    user.avatar = faker.image.avatar();
    user.role = faker.helpers.arrayElement([
        UserRole.ADMIN,
        UserRole.MEMBER,
        UserRole.GUEST,
    ]);
    user.isActivated = faker.datatype.boolean();

    return user;
});