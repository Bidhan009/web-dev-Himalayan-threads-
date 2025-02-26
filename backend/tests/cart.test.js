const request = require("supertest");
const app = require("../index");
const { sequelize } = require("../database/db");

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe("Cart API Tests", () => {
    it("should add an item to the cart", async () => {
        const res = await request(app)
            .post("/api/cart/add")
            .send({ userId: 1, productId: 2, quantity: 1 });

        expect(res.statusCode).toBe(201);
    });

    it("should remove an item from the cart", async () => {
        const res = await request(app)
            .delete("/api/cart/remove")
            .send({ userId: 1, productId: 2 });

        expect(res.statusCode).toBe(200);
    });
});
