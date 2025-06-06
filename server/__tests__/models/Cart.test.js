const sequelize = require("../../db");
const { Cart } = require("../../models");

describe("Cart Model Integration Tests", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await Cart.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("should create a new cart item in the database", async () => {
    const cartItem = await Cart.create({ quantity: 5 });

    expect(cartItem.id).toBe(1);
    expect(cartItem.quantity).toBe(5);
  });

  test("should create a cart item with a default quantity of 1", async () => {
    const cartItem = await Cart.create();
    const foundItem = await Cart.findByPk(cartItem.id);

    expect(foundItem.quantity).toBe(1);
  });

  test("should read a cart item from the database", async () => {
    const createdItem = await Cart.create({ quantity: 3 });
    const foundItem = await Cart.findByPk(createdItem.id);

    expect(foundItem.id).toBe(createdItem.id);
    expect(foundItem.quantity).toBe(3);
  });

  test("should return null if cart item is not found", async () => {
    const foundItem = await Cart.findByPk(999);
    expect(foundItem).toBeNull();
  });

  test("should update a cart item in the database", async () => {
    const cartItem = await Cart.create({ quantity: 2 });

    await cartItem.update({ quantity: 7 });

    const foundItem = await Cart.findByPk(cartItem.id);
    expect(foundItem.quantity).toBe(7);
  });

  test("should delete a cart item from the database", async () => {
    const cartItem = await Cart.create({ quantity: 1 });
    const id = cartItem.id;

    const result = await Cart.destroy({ where: { id: id } });

    const foundItem = await Cart.findByPk(id);
    expect(result).toBe(1);
    expect(foundItem).toBeNull();
  });
});
