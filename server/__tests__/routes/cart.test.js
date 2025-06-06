const request = require("supertest");
const app = require("../../app");
const { Order, User, Item, Cart } = require("../../models");

jest.mock("../../models/Order", () => ({
  belongsTo: jest.fn(),
  hasMany: jest.fn(),
}));

jest.mock("../../models/User", () => ({
  belongsTo: jest.fn(),
  hasMany: jest.fn(),
}));

jest.mock("../../models/Item", () => ({
  update: jest.fn(),
  hasMany: jest.fn(),
}));

jest.mock("../../models/Cart", () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  destroy: jest.fn(),
  belongsTo: jest.fn(),
  hasMany: jest.fn(),
}));

describe("Testing /cart routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should get all items in a user's cart", async () => {
    const mockCartContents = [
      {
        id: 1,
        quantity: 2,
        userId: 1,
        itemId: 101,
        Item: { id: 101, name: "Test Item A", price: 50 },
      },
      {
        id: 2,
        quantity: 1,
        userId: 1,
        itemId: 102,
        Item: { id: 102, name: "Test Item B", price: 75 },
      },
    ];

    Cart.findAll.mockResolvedValue(mockCartContents);

    const response = await request(app).get("/api/cart/1");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockCartContents);
  });

  it("Should add an item to the cart", async () => {
    const mockRequestBody = {
      userId: 1,
      itemId: 103,
      quantity: 3,
    };
    const mockResolvedCartItem = { id: 3, ...mockRequestBody };

    Cart.create.mockResolvedValue(mockResolvedCartItem);

    const response = await request(app).post("/api/cart").send(mockRequestBody);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(mockResolvedCartItem);
  });

  it("Should delete an item from the cart", async () => {
    Cart.destroy.mockResolvedValue(1);

    const response = await request(app).delete("/api/cart/1");

    expect(response.statusCode).toBe(204);
  });
});
