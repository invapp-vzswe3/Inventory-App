const request = require("supertest");
const app = require("../../app");
const { User, Order, Cart } = require("../../models");

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
}));

jest.mock("../../models/Cart", () => ({
  belongsTo: jest.fn(),
}));

describe("Testing /users routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Should have success on /GET /users", async () => {
    const mockUsers = [
      { id: 1, name: "Test User 1" },
      { id: 2, name: "Test User 2" },
    ];
    User.findAll.mockResolvedValue(mockUsers);

    const response = await request(app).get("/api/users");
    console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(mockUsers);
  });

  it("Should have success on /POST /users", async () => {
    const mockRequest = {
      name: "User One",
      email: "userone@gmail.com",
      password: "useronepassword",
    };

    User.create.mockResolvedValue(mockRequest);

    const response = await request(app).post("/api/users").send(mockRequest);
    console.log(response.body);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(mockRequest);
  });

  // --- Appended Tests for 100% Coverage ---

  it("Should handle errors on GET /users", async () => {
    User.findAll.mockRejectedValue(new Error("Database connection error"));
    const response = await request(app).get("/api/users");
    expect(response.statusCode).toBe(500);
  });

  it("Should handle case where no users are found on GET /users", async () => {
    User.findAll.mockResolvedValue(null);
    const response = await request(app).get("/api/users");
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Could not find users" });
  });

  it("Should handle errors on POST /users", async () => {
    User.create.mockRejectedValue(new Error("Validation error"));
    const response = await request(app)
      .post("/api/users")
      .send({ name: "test" });
    expect(response.statusCode).toBe(500);
  });

  it("Should handle case where user creation returns nothing on POST /users", async () => {
    User.create.mockResolvedValue(null);
    const response = await request(app)
      .post("/api/users")
      .send({ name: "test" });
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({ error: "Could not find user" });
  });
});
