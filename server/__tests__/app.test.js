const request = require("supertest");
const app = require("../app");

describe("404 Not Found Middleware", () => {
  test("Should return 404 and a specific error message for an undefined route", async () => {
    const response = await request(app).get("/non-existent-route");

    expect(response.statusCode).toBe(404);

    expect(response.body).toEqual({
      error: "404 - Not Found",
      message: "No route found for the requested URL",
    });
  });
});
