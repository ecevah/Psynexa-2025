const request = require("supertest");
const app = require("../app");
const { Staff, Client, Psychologist } = require("../models");
const jwt = require("jsonwebtoken");

require("./setup");

describe("Authentication Routes", () => {
  let testStaff, testClient, testPsychologist;

  beforeEach(async () => {
    // Test kullanıcılarını oluştur
    const users = await global.helpers.createTestUsers();
    testStaff = users.superAdmin;

    // Test müşterisi oluştur
    testClient = await Client.create({
      name: "Test",
      surname: "Client",
      email: "test.client@example.com",
      password: "Test123!",
    });

    // Test psikoloğu oluştur
    testPsychologist = await Psychologist.create({
      name: "Test",
      surname: "Psychologist",
      email: "test.psych@example.com",
      password: "Test123!",
      status: "active",
      approve_status: "approved",
    });
  });

  describe("Staff Authentication", () => {
    describe("POST /staff/login", () => {
      it("should authenticate staff with valid credentials", async () => {
        const response = await request(app).post("/api/auth/staff/login").send({
          email: testStaff.email,
          password: "Test123!",
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
        expect(response.body).toHaveProperty("staff");
        expect(response.body.staff).toHaveProperty("id", testStaff.id);
      });

      it("should reject invalid credentials", async () => {
        const response = await request(app).post("/api/auth/staff/login").send({
          email: testStaff.email,
          password: "WrongPassword123!",
        });

        expect(response.status).toBe(401);
      });

      it("should validate required fields", async () => {
        const response = await request(app).post("/api/auth/staff/login").send({
          email: testStaff.email,
          // Missing password
        });

        expect(response.status).toBe(400);
      });
    });

    describe("POST /staff/refresh-token", () => {
      it("should issue new tokens with valid refresh token", async () => {
        const { refreshToken } = global.helpers.generateTestTokens(
          testStaff.id,
          "staff"
        );

        const response = await request(app)
          .post("/api/auth/staff/refresh-token")
          .send({ refreshToken });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
      });

      it("should reject invalid refresh token", async () => {
        const response = await request(app)
          .post("/api/auth/staff/refresh-token")
          .send({ refreshToken: "invalid-token" });

        expect(response.status).toBe(401);
      });
    });
  });

  describe("Client Authentication", () => {
    describe("POST /client/login", () => {
      it("should authenticate client with valid credentials", async () => {
        const response = await request(app)
          .post("/api/auth/client/login")
          .send({
            email: testClient.email,
            password: "Test123!",
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
        expect(response.body).toHaveProperty("client");
        expect(response.body.client).toHaveProperty("id", testClient.id);
      });

      it("should reject invalid credentials", async () => {
        const response = await request(app)
          .post("/api/auth/client/login")
          .send({
            email: testClient.email,
            password: "WrongPassword123!",
          });

        expect(response.status).toBe(401);
      });
    });

    describe("POST /client/register", () => {
      it("should register new client", async () => {
        const newClientData = {
          name: "New",
          surname: "Client",
          email: "new.client@example.com",
          password: "NewClient123!",
        };

        const response = await request(app)
          .post("/api/auth/client/register")
          .send(newClientData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
        expect(response.body).toHaveProperty("client");
        expect(response.body.client.email).toBe(newClientData.email);
      });

      it("should prevent duplicate email registration", async () => {
        const response = await request(app)
          .post("/api/auth/client/register")
          .send({
            name: "Test",
            surname: "Client",
            email: testClient.email, // Duplicate email
            password: "Test123!",
          });

        expect(response.status).toBe(400);
      });

      it("should validate password strength", async () => {
        const response = await request(app)
          .post("/api/auth/client/register")
          .send({
            name: "Test",
            surname: "Client",
            email: "new.client@example.com",
            password: "weak", // Weak password
          });

        expect(response.status).toBe(400);
      });
    });

    describe("POST /client/refresh-token", () => {
      it("should issue new tokens with valid refresh token", async () => {
        const { refreshToken } = global.helpers.generateTestTokens(
          testClient.id,
          "client"
        );

        const response = await request(app)
          .post("/api/auth/client/refresh-token")
          .send({ refreshToken });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
      });
    });
  });

  describe("Psychologist Authentication", () => {
    describe("POST /psychologist/login", () => {
      it("should authenticate psychologist with valid credentials", async () => {
        const response = await request(app)
          .post("/api/auth/psychologist/login")
          .send({
            email: testPsychologist.email,
            password: "Test123!",
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
        expect(response.body).toHaveProperty("psychologist");
        expect(response.body.psychologist).toHaveProperty(
          "id",
          testPsychologist.id
        );
      });

      it("should reject unapproved psychologist", async () => {
        await testPsychologist.update({ approve_status: "pending" });

        const response = await request(app)
          .post("/api/auth/psychologist/login")
          .send({
            email: testPsychologist.email,
            password: "Test123!",
          });

        expect(response.status).toBe(403);
      });
    });

    describe("POST /psychologist/register", () => {
      it("should register new psychologist", async () => {
        const newPsychData = {
          name: "New",
          surname: "Psychologist",
          email: "new.psych@example.com",
          password: "NewPsych123!",
          phone: "+905551234567",
          specialization: "Clinical Psychology",
          education: "PhD in Psychology",
          experience_years: 5,
        };

        const response = await request(app)
          .post("/api/auth/psychologist/register")
          .send(newPsychData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty(
          "message",
          "Kayıt başarılı. Onay bekliyor."
        );
        expect(response.body).toHaveProperty("psychologist");
        expect(response.body.psychologist.email).toBe(newPsychData.email);
        expect(response.body.psychologist.approve_status).toBe("pending");
      });

      it("should validate required professional fields", async () => {
        const response = await request(app)
          .post("/api/auth/psychologist/register")
          .send({
            name: "New",
            surname: "Psychologist",
            email: "new.psych@example.com",
            password: "NewPsych123!",
            // Missing professional fields
          });

        expect(response.status).toBe(400);
      });
    });

    describe("POST /psychologist/refresh-token", () => {
      it("should issue new tokens with valid refresh token", async () => {
        const { refreshToken } = global.helpers.generateTestTokens(
          testPsychologist.id,
          "psychologist"
        );

        const response = await request(app)
          .post("/api/auth/psychologist/refresh-token")
          .send({ refreshToken });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
        expect(response.body).toHaveProperty("refreshToken");
      });
    });
  });

  describe("Password Reset", () => {
    describe("POST /forgot-password", () => {
      it("should send reset token for valid email", async () => {
        const response = await request(app)
          .post("/api/auth/forgot-password")
          .send({
            email: testClient.email,
            userType: "client",
          });

        expect(response.status).toBe(200);
        expect(response.body.message).toContain(
          "Şifre sıfırlama talimatları gönderildi"
        );
      });

      it("should handle non-existent email", async () => {
        const response = await request(app)
          .post("/api/auth/forgot-password")
          .send({
            email: "nonexistent@example.com",
            userType: "client",
          });

        expect(response.status).toBe(404);
      });
    });

    describe("POST /reset-password", () => {
      it("should reset password with valid token", async () => {
        // Önce şifre sıfırlama token'ı oluştur
        const resetToken = jwt.sign(
          { id: testClient.id, type: "client" },
          process.env.JWT_RESET_SECRET,
          { expiresIn: "1h" }
        );

        const response = await request(app)
          .post("/api/auth/reset-password")
          .send({
            token: resetToken,
            newPassword: "NewPassword123!",
          });

        expect(response.status).toBe(200);
        expect(response.body.message).toContain("Şifre başarıyla sıfırlandı");
      });

      it("should reject invalid reset token", async () => {
        const response = await request(app)
          .post("/api/auth/reset-password")
          .send({
            token: "invalid-token",
            newPassword: "NewPassword123!",
          });

        expect(response.status).toBe(401);
      });

      it("should validate new password strength", async () => {
        const resetToken = jwt.sign(
          { id: testClient.id, type: "client" },
          process.env.JWT_RESET_SECRET,
          { expiresIn: "1h" }
        );

        const response = await request(app)
          .post("/api/auth/reset-password")
          .send({
            token: resetToken,
            newPassword: "weak",
          });

        expect(response.status).toBe(400);
      });
    });
  });
});
