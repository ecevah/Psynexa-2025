const request = require("supertest");
const app = require("../../app");
const { Staff, Restrictions } = require("../../models");
const bcrypt = require("bcryptjs");

describe("Staff Auth Controller", () => {
  let superAdmin, testStaff;
  let superAdminToken;

  beforeEach(async () => {
    // Test kullanıcılarını oluştur
    const users = await global.helpers.createTestUsers();
    superAdmin = users.superAdmin;
    superAdminToken = global.helpers.generateTestTokens(
      superAdmin.id
    ).accessToken;

    // Test staff rolü oluştur
    const testRole = await Restrictions.create({
      name: "Test Role",
      permissions: ["view_clients"],
      is_active: true,
      priority_level: 50,
    });

    // Test staff kullanıcısı oluştur
    testStaff = await Staff.create({
      name: "Test",
      surname: "Staff",
      email: "test.staff@example.com",
      password: await bcrypt.hash("Test123!", 10),
      restrictions_id: testRole.id,
    });
  });

  describe("Login", () => {
    it("should authenticate staff with valid credentials", async () => {
      const response = await request(app).post("/api/staff/login").send({
        email: testStaff.email,
        password: "Test123!",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
      expect(response.body).toHaveProperty("staff");
      expect(response.body.staff).toHaveProperty("id", testStaff.id);
      expect(response.body.staff).not.toHaveProperty("password");
    });

    it("should reject invalid password", async () => {
      const response = await request(app).post("/api/staff/login").send({
        email: testStaff.email,
        password: "WrongPassword123!",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Geçersiz email veya şifre");
    });

    it("should reject non-existent email", async () => {
      const response = await request(app).post("/api/staff/login").send({
        email: "nonexistent@example.com",
        password: "Test123!",
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Geçersiz email veya şifre");
    });

    it("should validate required fields", async () => {
      const response = await request(app).post("/api/staff/login").send({
        email: testStaff.email,
        // Missing password
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Email ve şifre gereklidir");
    });

    it("should validate email format", async () => {
      const response = await request(app).post("/api/staff/login").send({
        email: "invalid-email",
        password: "Test123!",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Geçersiz email formatı");
    });
  });

  describe("Register", () => {
    it("should allow super admin to create new staff", async () => {
      const newStaffData = {
        name: "New",
        surname: "Staff",
        email: "new.staff@example.com",
        password: "NewStaff123!",
        restrictions_id: testStaff.restrictions_id,
      };

      const response = await request(app)
        .post("/api/staff/register")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send(newStaffData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("email", newStaffData.email);
      expect(response.body).not.toHaveProperty("password");
    });

    it("should hash password before saving", async () => {
      const newStaffData = {
        name: "New",
        surname: "Staff",
        email: "new.staff@example.com",
        password: "NewStaff123!",
        restrictions_id: testStaff.restrictions_id,
      };

      const response = await request(app)
        .post("/api/staff/register")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send(newStaffData);

      const savedStaff = await Staff.findByPk(response.body.id);
      expect(savedStaff.password).not.toBe(newStaffData.password);
      expect(
        await bcrypt.compare(newStaffData.password, savedStaff.password)
      ).toBe(true);
    });

    it("should prevent duplicate email registration", async () => {
      const response = await request(app)
        .post("/api/staff/register")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          name: "New",
          surname: "Staff",
          email: testStaff.email, // Existing email
          password: "NewStaff123!",
          restrictions_id: testStaff.restrictions_id,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Bu email adresi zaten kullanımda");
    });

    it("should validate password strength", async () => {
      const response = await request(app)
        .post("/api/staff/register")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          name: "New",
          surname: "Staff",
          email: "new.staff@example.com",
          password: "weak",
          restrictions_id: testStaff.restrictions_id,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Şifre en az 8 karakter uzunluğunda olmalı ve en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir"
      );
    });

    it("should require valid restrictions_id", async () => {
      const response = await request(app)
        .post("/api/staff/register")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          name: "New",
          surname: "Staff",
          email: "new.staff@example.com",
          password: "NewStaff123!",
          restrictions_id: 999999, // Non-existent role
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Geçersiz rol ID");
    });
  });

  describe("Change Password", () => {
    it("should allow staff to change their password", async () => {
      const staffToken = global.helpers.generateTestTokens(
        testStaff.id
      ).accessToken;

      const response = await request(app)
        .put("/api/staff/change-password")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          currentPassword: "Test123!",
          newPassword: "NewTest123!",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Şifre başarıyla değiştirildi");

      // Verify new password works
      const loginResponse = await request(app).post("/api/staff/login").send({
        email: testStaff.email,
        password: "NewTest123!",
      });

      expect(loginResponse.status).toBe(200);
    });

    it("should reject incorrect current password", async () => {
      const staffToken = global.helpers.generateTestTokens(
        testStaff.id
      ).accessToken;

      const response = await request(app)
        .put("/api/staff/change-password")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          currentPassword: "WrongPassword123!",
          newPassword: "NewTest123!",
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Mevcut şifre yanlış");
    });

    it("should validate new password strength", async () => {
      const staffToken = global.helpers.generateTestTokens(
        testStaff.id
      ).accessToken;

      const response = await request(app)
        .put("/api/staff/change-password")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          currentPassword: "Test123!",
          newPassword: "weak",
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Yeni şifre en az 8 karakter uzunluğunda olmalı ve en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir"
      );
    });
  });

  describe("Reset Password", () => {
    it("should send reset password email", async () => {
      const response = await request(app)
        .post("/api/staff/forgot-password")
        .send({
          email: testStaff.email,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Şifre sıfırlama talimatları email adresinize gönderildi"
      );
    });

    it("should handle non-existent email for reset", async () => {
      const response = await request(app)
        .post("/api/staff/forgot-password")
        .send({
          email: "nonexistent@example.com",
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe(
        "Bu email adresiyle kayıtlı kullanıcı bulunamadı"
      );
    });

    it("should reset password with valid token", async () => {
      // Önce şifre sıfırlama token'ı oluştur
      const resetToken = global.helpers.generateTestTokens(
        testStaff.id,
        "reset"
      ).accessToken;

      const response = await request(app)
        .post("/api/staff/reset-password")
        .send({
          token: resetToken,
          newPassword: "ResetTest123!",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Şifre başarıyla sıfırlandı");

      // Verify new password works
      const loginResponse = await request(app).post("/api/staff/login").send({
        email: testStaff.email,
        password: "ResetTest123!",
      });

      expect(loginResponse.status).toBe(200);
    });

    it("should reject invalid reset token", async () => {
      const response = await request(app)
        .post("/api/staff/reset-password")
        .send({
          token: "invalid-token",
          newPassword: "ResetTest123!",
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Geçersiz veya süresi dolmuş token");
    });
  });

  describe("Refresh Token", () => {
    it("should issue new tokens with valid refresh token", async () => {
      const { refreshToken } = global.helpers.generateTestTokens(testStaff.id);

      const response = await request(app)
        .post("/api/staff/refresh-token")
        .send({ refreshToken });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
    });

    it("should reject invalid refresh token", async () => {
      const response = await request(app)
        .post("/api/staff/refresh-token")
        .send({ refreshToken: "invalid-token" });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Geçersiz refresh token");
    });

    it("should reject expired refresh token", async () => {
      const expiredToken = jwt.sign(
        { staff_id: testStaff.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "0s" }
      );

      const response = await request(app)
        .post("/api/staff/refresh-token")
        .send({ refreshToken: expiredToken });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Token süresi dolmuş");
    });
  });
});
