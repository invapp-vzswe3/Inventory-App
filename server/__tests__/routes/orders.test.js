const request = require("supertest");
const app = require("../../app");
const { Order, User, Item, Cart } = require("../../models");

jest.mock("../../models/Order", () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  belongsTo: jest.fn(),
  hasMany: jest.fn(),
}));

jest.mock("../../models/User", () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  belongsTo: jest.fn(),
  hasMany: jest.fn(),
}));

jest.mock("../../models/Item", () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn(),
  hasMany: jest.fn(),
}));

jest.mock("../../models/Cart", () => ({
  belongsTo: jest.fn(),
  hasMany: jest.fn(),
}));

describe("Testing /orders routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should have success on GET /orders", async () => {
    const mockOrders = [
      {
        id: 1,
        total: 150.5,
        UserId: 1,
        User: { id: 1, name: "John Doe" },
      },
      {
        id: 2,
        total: 75.0,
        UserId: 2,
        User: { id: 2, name: "Jane Smith" },
      },
    ];

    Order.findAll.mockResolvedValue(mockOrders);

    const response = await request(app).get("/api/orders");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockOrders);
  });

  it("Should have success on POST /orders", async () => {
    const mockRequestBody = {
      total: 200.0,
      UserId: 1,
    };
    const mockResolvedOrder = { id: 3, ...mockRequestBody };

    Order.create.mockResolvedValue(mockResolvedOrder);

    const response = await request(app)
      .post("/api/orders")
      .send(mockRequestBody);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(mockResolvedOrder);
  });

  it("Should handle errors on GET /orders", async () => {
    Order.findAll.mockRejectedValue(new Error("Database error"));
    const response = await request(app).get("/api/orders");
    expect(response.statusCode).toBe(500);
  });

  it("Should handle errors on POST /orders", async () => {
    const mockRequestBody = {
      total: 200.0,
      UserId: 1,
    };
    Order.create.mockRejectedValue(new Error("Creation failed"));
    const response = await request(app)
      .post("/api/orders")
      .send(mockRequestBody);
    expect(response.statusCode).toBe(500);
  });
});
