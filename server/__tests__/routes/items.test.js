const request = require("supertest");
const app = require("../../app");
const { User, Order, Cart, Item } = require("../../models");

jest.mock("../../models/Order", () => ({
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
  hasMany: jest.fn(),
  findByPk: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  destroy: jest.fn(),
  update: jest.fn(),
}));

jest.mock("../../models/Cart", () => ({
  belongsTo: jest.fn(),
}));

describe("Testing /items routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should have success on GET /items", async () => {
    const mockItems = [
      { id: 1, name: "Test Item 1" },
      { id: 2, name: "Test Item 2" },
    ];

    Item.findAll.mockResolvedValue(mockItems);

    const response = await request(app).get("/api/items");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockItems);
  });

  it("Should have success on GET /items/:id", async () => {
    const mockItem = {
      id: "1",
      name: "Mock Item 1",
    };

    Item.findByPk.mockResolvedValue(mockItem);

    const response = await request(app).get("/api/items/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockItem);
  });

  it("Should have success on POST /items", async () => {
    const mockRequestBody = {
      name: "New Item",
      price: 100,
      description: "A brand new item",
      category: "Electronics",
      image: "image.url",
    };

    const mockResolvedItem = { id: 3, ...mockRequestBody };
    Item.create.mockResolvedValue(mockResolvedItem);

    const response = await request(app)
      .post("/api/items")
      .send(mockRequestBody);

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(mockResolvedItem);
  });

  it("Should have success on PUT /items/:id", async () => {
    const updateData = {
      name: "Updated Item Name",
      description: "Updated description",
      price: 150,
      category: "Updated Category",
      image: "updated.image.url",
    };

    const mockFoundItem = {
      update: jest.fn().mockResolvedValue({ id: 1, ...updateData }),
    };

    Item.findByPk.mockResolvedValue(mockFoundItem);

    const response = await request(app).put("/api/items/1").send(updateData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ id: 1, ...updateData });
  });

  it("Should have success on DELETE /items/:id", async () => {
    Item.destroy.mockResolvedValue(1);

    const response = await request(app).delete("/api/items/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Item deleted successfully");
  });

  it("Should handle not found on GET /items/:id", async () => {
    Item.findByPk.mockResolvedValue(null);

    const response = await request(app).get("/api/items/999");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: "Item not found" });
  });

  it("Should handle server error on GET /items/:id", async () => {
    Item.findByPk.mockRejectedValue(new Error("Server Error"));

    const response = await request(app).get("/api/items/1");

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Server Error" });
  });

  it("Should handle success on GET /items with a name query", async () => {
    const mockFilteredItems = [{ id: 1, name: "Filtered Item" }];

    Item.findAll.mockResolvedValue(mockFilteredItems);

    const response = await request(app).get("/api/items?name=Filtered");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockFilteredItems);
  });

  it("Should handle errors on GET /items", async () => {
    Item.findAll.mockRejectedValue(new Error("Database Error"));

    const response = await request(app).get("/api/items");

    expect(response.statusCode).toBe(500);
  });

  it("Should handle errors on POST /items", async () => {
    Item.create.mockRejectedValue(new Error("Creation Failed"));

    const response = await request(app)
      .post("/api/items")
      .send({ name: "Faulty" });

    expect(response.statusCode).toBe(500);
  });

  it("Should handle not found on PUT /items/:id", async () => {
    Item.findByPk.mockResolvedValue(null);

    const response = await request(app)
      .put("/api/items/999")
      .send({ name: "Update" });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Item not found ID: 999" });
  });

  it("Should handle errors on PUT /items/:id", async () => {
    Item.findByPk.mockRejectedValue(new Error("Update Failed"));

    const response = await request(app)
      .put("/api/items/1")
      .send({ name: "Faulty" });

    expect(response.statusCode).toBe(500);
  });

  it("Should handle not found on DELETE /items/:id", async () => {
    Item.destroy.mockResolvedValue(0);

    const response = await request(app).delete("/api/items/999");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ error: "Item not found" });
  });

  it("Should handle server error on DELETE /items/:id", async () => {
    Item.destroy.mockRejectedValue(new Error("Server Error"));

    const response = await request(app).delete("/api/items/1");

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({ error: "Server Error" });
  });
});
