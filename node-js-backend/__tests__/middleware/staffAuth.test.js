const request = require("supertest");
const app = require("../../app");
const { Staff, Restrictions } = require("../../models");
const jwt = require("jsonwebtoken");

describe("Staff Auth Middleware", () => {
  let superAdmin, supportAgent;
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
  });

  describe("Authentication", () => {
    it("should allow access with valid token", async () => {
      const response = await request(app)
        .get("/api/staff/profile")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
    });

    it("should reject access without token", async () => {
      const response = await request(app).get("/api/staff/profile");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Yetkilendirme başarısız");
    });

    it("should reject access with invalid token", async () => {
      const response = await request(app)
        .get("/api/staff/profile")
        .set("Authorization", "Bearer invalid_token");

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Geçersiz token");
    });

    it("should reject access with expired token", async () => {
      const expiredToken = jwt.sign(
        { staff_id: superAdmin.id },
        process.env.JWT_SECRET,
        { expiresIn: "0s" }
      );

      const response = await request(app)
        .get("/api/staff/profile")
        .set("Authorization", `Bearer ${expiredToken}`);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Token süresi dolmuş");
    });

    it("should reject access with non-staff token", async () => {
      const clientToken = jwt.sign({ client_id: 1 }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const response = await request(app)
        .get("/api/staff/profile")
        .set("Authorization", `Bearer ${clientToken}`);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Geçersiz token");
    });
  });

  describe("Authorization", () => {
    it("should allow super admin to access restricted endpoints", async () => {
      const response = await request(app)
        .get("/api/restrictions/list")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
    });

    it("should not allow support agent to access restricted endpoints", async () => {
      const response = await request(app)
        .get("/api/restrictions/list")
        .set("Authorization", `Bearer ${supportAgentToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Bu işlem için yetkiniz yok");
    });

    it("should check specific permissions for endpoints", async () => {
      // Support agent'a geçici olarak yeni bir yetki ekle
      await Restrictions.update(
        {
          permissions: ["view_clients", "view_client_details", "view_staff"],
        },
        {
          where: { id: supportAgent.restrictions_id },
        }
      );

      // Staff listesini görüntüleme yetkisi verildi
      const staffListResponse = await request(app)
        .get("/api/staff/list")
        .set("Authorization", `Bearer ${supportAgentToken}`);

      expect(staffListResponse.status).toBe(200);

      // Ama staff oluşturma yetkisi yok
      const createStaffResponse = await request(app)
        .post("/api/staff/create")
        .set("Authorization", `Bearer ${supportAgentToken}`)
        .send({
          name: "New",
          surname: "Staff",
          email: "new.staff@example.com",
          password: "Test123!",
        });

      expect(createStaffResponse.status).toBe(403);
    });

    it("should handle staff with no restrictions", async () => {
      // Restrictions olmayan bir staff oluştur
      const noRestrictionsStaff = await Staff.create({
        name: "No",
        surname: "Restrictions",
        email: "no.restrictions@example.com",
        password: "Test123!",
      });

      const token = global.helpers.generateTestTokens(
        noRestrictionsStaff.id
      ).accessToken;

      const response = await request(app)
        .get("/api/staff/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Kullanıcı yetkileri bulunamadı");
    });

    it("should handle inactive staff restrictions", async () => {
      // Restrictions'ı inactive yap
      await Restrictions.update(
        { is_active: false },
        { where: { id: supportAgent.restrictions_id } }
      );

      const response = await request(app)
        .get("/api/staff/profile")
        .set("Authorization", `Bearer ${supportAgentToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Kullanıcı yetkileri pasif durumda");
    });
  });

  describe("Permission Inheritance", () => {
    it("should allow access to lower priority endpoints", async () => {
      // Super admin (priority: 1) should access support (priority: 40) endpoints
      const response = await request(app)
        .get("/api/clients")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).not.toBe(403);
    });

    it("should not allow access to higher priority endpoints", async () => {
      // Support agent (priority: 40) should not access admin (priority: 1) endpoints
      const response = await request(app)
        .get("/api/staff/list")
        .set("Authorization", `Bearer ${supportAgentToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors gracefully", async () => {
      // Simulate a database error by temporarily breaking the Staff model
      const originalFindByPk = Staff.findByPk;
      Staff.findByPk = jest.fn().mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .get("/api/staff/profile")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe("Sunucu hatası");

      // Restore the original function
      Staff.findByPk = originalFindByPk;
    });

    it("should handle missing staff gracefully", async () => {
      const token = jwt.sign({ staff_id: 999999 }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const response = await request(app)
        .get("/api/staff/profile")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Kullanıcı bulunamadı");
    });
  });
});
