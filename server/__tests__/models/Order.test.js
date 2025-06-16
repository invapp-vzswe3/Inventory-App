const sequelize = require("../../db");
const { Order } = require("../../models");

describe("Order Model Integration Tests", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await Order.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("should create a new order in the database", async () => {
    const orderData = {
      total: 250,
      status: "Processing",
    };
    const order = await Order.create(orderData);

    expect(order.id).toBe(1);
    expect(order.total).toBe(orderData.total);
    expect(order.status).toBe(orderData.status);
  });

  test("should create an order with a default status of 'Pending'", async () => {
    const order = await Order.create({ total: 150 });
    const foundOrder = await Order.findByPk(order.id);

    expect(foundOrder.status).toBe("Pending");
  });

  test("should read an order from the database", async () => {
    const orderData = { total: 300, status: "Shipped" };
    const createdOrder = await Order.create(orderData);

    const foundOrder = await Order.findByPk(createdOrder.id);

    expect(foundOrder).not.toBeNull();
    expect(foundOrder.id).toBe(createdOrder.id);
    expect(foundOrder.total).toBe(orderData.total);
    expect(foundOrder.status).toBe(orderData.status);
  });

  test("should return null if order is not found", async () => {
    const foundOrder = await Order.findByPk(999);
    expect(foundOrder).toBeNull();
  });

  test("should update an order in the database", async () => {
    const order = await Order.create({ total: 50, status: "Pending" });

    await order.update({ total: 75, status: "Delivered" });

    const foundOrder = await Order.findByPk(order.id);

    expect(foundOrder.total).toBe(75);
    expect(foundOrder.status).toBe("Delivered");
  });

  test("should delete an order from the database", async () => {
    const order = await Order.create({ total: 100 });
    const result = await Order.destroy({ where: { id: order.id } });

    expect(result).toBe(1);
  });
});
