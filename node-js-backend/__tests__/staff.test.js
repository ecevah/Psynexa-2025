const request = require("supertest");
const app = require("../app");
const { Staff, Restrictions } = require("../models");

require("./setup");

describe("Staff Routes", () => {
  let superAdmin, supportAgent, testStaff;
  let superAdminToken, supportAgentToken;

  beforeEach(async () => {
    // Test kullanıcılarını oluştur
    const users = await global.helpers.createTestUsers();
    superAdmin = users.superAdmin;
    supportAgent = users.supportAgent;

    // Test token'larını oluştur
    const superAdminTokens = global.helpers.generateTestTokens(superAdmin.id);
    const supportAgentTokens = global.helpers.generateTestTokens(
      supportAgent.id
    );
    superAdminToken = superAdminTokens.accessToken;
    supportAgentToken = supportAgentTokens.accessToken;

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
      password: "Test123!",
      restrictions_id: testRole.id,
    });
  });

  describe("POST /login", () => {
    it("should authenticate staff with valid credentials", async () => {
      const response = await request(app).post("/api/staff/login").send({
        email: "superadmin@test.com",
        password: "Test123!",
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
      expect(response.body).toHaveProperty("refreshToken");
    });

    it("should reject invalid credentials", async () => {
      const response = await request(app).post("/api/staff/login").send({
        email: "superadmin@test.com",
        password: "WrongPassword123!",
      });

      expect(response.status).toBe(401);
    });
  });

  describe("GET /profile", () => {
    it("should return staff profile for authenticated user", async () => {
      const response = await request(app)
        .get("/api/staff/profile")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("email", superAdmin.email);
      expect(response.body).not.toHaveProperty("password");
    });

    it("should reject unauthenticated requests", async () => {
      const response = await request(app).get("/api/staff/profile");

      expect(response.status).toBe(401);
    });
  });

  describe("PUT /profile", () => {
    it("should update staff profile", async () => {
      const updatedData = {
        name: "Updated",
        surname: "Name",
        email: "updated.email@example.com",
      };

      const response = await request(app)
        .put("/api/staff/profile")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Profil güncellendi");

      const updatedStaff = await Staff.findByPk(superAdmin.id);
      expect(updatedStaff.name).toBe(updatedData.name);
      expect(updatedStaff.email).toBe(updatedData.email);
    });

    it("should validate email format", async () => {
      const response = await request(app)
        .put("/api/staff/profile")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          email: "invalid-email",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /change-password", () => {
    it("should change staff password with valid data", async () => {
      const response = await request(app)
        .put("/api/staff/change-password")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          currentPassword: "Test123!",
          newPassword: "NewTest123!",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Şifre başarıyla değiştirildi");
    });

    it("should reject invalid current password", async () => {
      const response = await request(app)
        .put("/api/staff/change-password")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          currentPassword: "WrongPassword123!",
          newPassword: "NewTest123!",
        });

      expect(response.status).toBe(401);
    });

    it("should validate new password format", async () => {
      const response = await request(app)
        .put("/api/staff/change-password")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          currentPassword: "Test123!",
          newPassword: "weak",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /list", () => {
    it("should allow super admin to list all staff", async () => {
      const response = await request(app)
        .get("/api/staff/list")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it("should not allow support agent to list staff", async () => {
      const response = await request(app)
        .get("/api/staff/list")
        .set("Authorization", `Bearer ${supportAgentToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe("POST /create", () => {
    it("should allow super admin to create new staff", async () => {
      const newStaffData = {
        name: "New",
        surname: "Staff",
        email: "new.staff@example.com",
        password: "NewStaff123!",
        restrictions_id: supportAgent.restrictions_id,
      };

      const response = await request(app)
        .post("/api/staff/create")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send(newStaffData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.email).toBe(newStaffData.email);
    });

    it("should not allow support agent to create staff", async () => {
      const newStaffData = {
        name: "New",
        surname: "Staff",
        email: "new.staff@example.com",
        password: "NewStaff123!",
        restrictions_id: supportAgent.restrictions_id,
      };

      const response = await request(app)
        .post("/api/staff/create")
        .set("Authorization", `Bearer ${supportAgentToken}`)
        .send(newStaffData);

      expect(response.status).toBe(403);
    });

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/staff/create")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          name: "New",
          // Missing required fields
        });

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /:staffId", () => {
    it("should allow super admin to update staff", async () => {
      const updatedData = {
        name: "Updated",
        surname: "Staff",
        email: "updated.staff@example.com",
        restrictions_id: supportAgent.restrictions_id,
      };

      const response = await request(app)
        .put(`/api/staff/${testStaff.id}`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Staff güncellendi");

      const updatedStaff = await Staff.findByPk(testStaff.id);
      expect(updatedStaff.name).toBe(updatedData.name);
      expect(updatedStaff.email).toBe(updatedData.email);
    });

    it("should not allow support agent to update staff", async () => {
      const updatedData = {
        name: "Updated",
        surname: "Staff",
        email: "updated.staff@example.com",
      };

      const response = await request(app)
        .put(`/api/staff/${testStaff.id}`)
        .set("Authorization", `Bearer ${supportAgentToken}`)
        .send(updatedData);

      expect(response.status).toBe(403);
    });
  });

  describe("DELETE /:staffId", () => {
    it("should allow super admin to delete staff", async () => {
      const response = await request(app)
        .delete(`/api/staff/${testStaff.id}`)
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Staff silindi");

      const deletedStaff = await Staff.findByPk(testStaff.id);
      expect(deletedStaff).toBeNull();
    });

    it("should not allow support agent to delete staff", async () => {
      const response = await request(app)
        .delete(`/api/staff/${testStaff.id}`)
        .set("Authorization", `Bearer ${supportAgentToken}`);

      expect(response.status).toBe(403);
    });

    it("should not allow deleting super admin", async () => {
      const response = await request(app)
        .delete(`/api/staff/${superAdmin.id}`)
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(403);
    });
  });
});
