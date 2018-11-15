class User {
  constructor(
    public firstName: string,
    public lastName: string,
    public age: number
  ) {}

  update({ firstName, lastName, age }: Partial<User>) {
    if(firstName) this.firstName = firstName;
    if(lastName) this.lastName = lastName;
    if(age) this.age = age;
  }

  updateName({ firstName, lastName }: Pick<User, 'firstName' | 'lastName'>) {
    this.firstName = firstName;
    this.lastName = lastName;
  }
}

const alan = new User('Alan', 'Cooper', 24);

alan.update({ firstName: 'Alex' });

alan.updateName({ firstName: 'Markus', lastName: 'Person' });


enum HttpCodes {
  BAD_REQUEST = 400,
  NOT_FOUND = 404
}

