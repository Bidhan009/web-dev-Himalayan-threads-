const request = require("supertest");
const app = require("../index"); // Import app
const { sequelize } = require("../database/db");

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset database
});

afterAll(async () => {
    await sequelize.close(); // Close DB connection
});

describe("Authentication API Tests", () => {
    it("should register a new user", async () => {
        const res = await request(app)
            .post("/api/auth/register")
            .send({ username: "testuser", email: "test@example.com", password: "password123" });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("token");
    });

    it("should log in a user", async () => {
        const res = await request(app)
            .post("/api/auth/login")
            .send({ email: "test@example.com", password: "password123" });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
    });
});
