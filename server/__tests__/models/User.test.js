const sequelize = require("../../db");
const { User } = require("../../models");

describe("User Model Integration Tests", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("should create a new user in the database", async () => {
    const userData = {
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    };
    const user = await User.create(userData);

    expect(user.id).toBe(1);
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });

  test("should fail to create a user with invalid or missing email", async () => {
    await expect(
      User.create({ name: "Test User", password: "pw" }),
    ).rejects.toThrow();

    await expect(
      User.create({
        name: "Test User 2",
        email: "not-an-email",
        password: "pw",
      }),
    ).rejects.toThrow();
  });

  test("should fail to create a user with a non-unique email", async () => {
    const userData = {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "password123",
    };
    await User.create(userData);

    await expect(User.create(userData)).rejects.toThrow();
  });

  test("should read a user from the database", async () => {
    const userData = {
      name: "Peter Jones",
      email: "peter.jones@example.com",
      password: "password123",
    };
    const createdUser = await User.create(userData);
    const foundUser = await User.findByPk(createdUser.id);

    expect(foundUser).not.toBeNull();
    expect(foundUser.id).toBe(createdUser.id);
    expect(foundUser.name).toBe(userData.name);
    expect(foundUser.email).toBe(userData.email);
  });

  test("should return null if user is not found", async () => {
    const foundUser = await User.findByPk(999);
    expect(foundUser).toBeNull();
  });

  test("should update a user in the database", async () => {
    const user = await User.create({
      name: "Original Name",
      email: "original@example.com",
      password: "oldpassword",
    });

    await user.update({ name: "Updated Name", password: "newpassword" });
    const foundUser = await User.findByPk(user.id);

    expect(foundUser.name).toBe("Updated Name");
    expect(foundUser.password).toBe("newpassword");
  });

  test("should delete a user from the database", async () => {
    const user = await User.create({
      name: "Temp User",
      email: "temp@example.com",
      password: "pw",
    });
    const result = await User.destroy({ where: { id: user.id } });

    expect(result).toBe(1);
  });
});
