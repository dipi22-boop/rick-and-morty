import { faker } from '@faker-js/faker';

interface User {
  firstName: string;
  lastName: string;
}

export function createRandomUser(): User {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName()
  };
}



export const USERS: User[] = faker.helpers.multiple(createRandomUser, {
  count: 5,
});