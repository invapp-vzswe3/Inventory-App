const sequelize = require("../../db");
const { Item } = require("../../models");

describe("Item Model Integration Tests", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await Item.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("should create a new item in the database", async () => {
    const itemData = {
      name: "Gaming Keyboard",
      description: "A mechanical keyboard with RGB.",
      price: 120,
      category: "Electronics",
      image: "keyboard.jpg",
    };
    const item = await Item.create(itemData);

    expect(item.id).toBe(1);
    expect(item.name).toBe(itemData.name);
    expect(item.price).toBe(itemData.price);
    expect(item.description).toBe(itemData.description);
  });

  test("should fail to create an item without a name or price", async () => {
    await expect(
      Item.create({ description: "No name or price" }),
    ).rejects.toThrow();
    await expect(Item.create({ name: "Incomplete Item" })).rejects.toThrow();
  });

  test("should read an item from the database", async () => {
    const itemData = { name: "Wireless Mouse", price: 75 };
    const createdItem = await Item.create(itemData);

    const foundItem = await Item.findByPk(createdItem.id);

    expect(foundItem).not.toBeNull();
    expect(foundItem.id).toBe(createdItem.id);
    expect(foundItem.name).toBe(itemData.name);
    expect(foundItem.price).toBe(itemData.price);
  });

  test("should return null if item is not found", async () => {
    const foundItem = await Item.findByPk(999);
    expect(foundItem).toBeNull();
  });

  test("should update an item in the database", async () => {
    const item = await Item.create({ name: "Old Monitor", price: 200 });

    await item.update({ name: "New 4K Monitor", price: 350 });

    const foundItem = await Item.findByPk(item.id);

    expect(foundItem.name).toBe("New 4K Monitor");
    expect(foundItem.price).toBe(350);
  });

  test("should delete an item from the database", async () => {
    const item = await Item.create({ name: "USB Hub", price: 25 });
    const result = await Item.destroy({ where: { id: item.id } });

    expect(result).toBe(1);
  });
});
