const request = require("supertest");
const { app } = require("../index");
const { sequelize, connection } = require("../database/db");

describe("User API Tests", () => {
    it("should fetch user profile", async () => {
        const res = await request(app)
            .get("/api/user/profile")
            .set("Authorization", `Bearer token`);
        expect(res.statusCode).toBe(200);
    });
});