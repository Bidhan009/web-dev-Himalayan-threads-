const request = require("supertest");
const app = require("../index");
const { sequelize } = require("../database/db");

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Reset DB before tests
});

afterAll(async () => {
    await sequelize.close(); // Close connection
});

describe("Admin API Tests", () => {
    it("should allow admin to add a product", async () => {
        const res = await request(app)
            .post("/api/admin/add-product")
            .send({ name: "Nepali Dress", price: 100, stock: 50 });

        expect(res.statusCode).toBe(201);
    });

    it("should allow admin to get all users", async () => {
        const res = await request(app).get("/api/admin/users");
        expect(res.statusCode).toBe(200);
    });
});
