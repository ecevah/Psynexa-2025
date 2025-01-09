const request = require("supertest");
const app = require("../app");
const { Restrictions } = require("../models");

require("./setup");

describe("Restrictions Routes", () => {
  let superAdmin, supportAgent, testRole;
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

    // Test rolü oluştur
    testRole = await Restrictions.create({
      name: "Test Role",
      permissions: ["view_clients", "view_client_details"],
      is_active: true,
      priority_level: 50,
      description: "Test role description",
      metadata: { custom_field: "test_value" },
    });
  });

  describe("GET /list", () => {
    it("should allow super admin to list all roles", async () => {
      const response = await request(app)
        .get("/api/restrictions/list")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty("name");
      expect(response.body[0]).toHaveProperty("permissions");
    });

    it("should not allow support agent to list roles", async () => {
      const response = await request(app)
        .get("/api/restrictions/list")
        .set("Authorization", `Bearer ${supportAgentToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe("GET /:roleId", () => {
    it("should allow super admin to get role details", async () => {
      const response = await request(app)
        .get(`/api/restrictions/${testRole.id}`)
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", testRole.id);
      expect(response.body).toHaveProperty("name", testRole.name);
      expect(response.body).toHaveProperty("permissions");
      expect(response.body).toHaveProperty("is_active", true);
      expect(response.body).toHaveProperty("priority_level", 50);
      expect(response.body).toHaveProperty("description");
      expect(response.body).toHaveProperty("metadata");
    });

    it("should not allow support agent to get role details", async () => {
      const response = await request(app)
        .get(`/api/restrictions/${testRole.id}`)
        .set("Authorization", `Bearer ${supportAgentToken}`);

      expect(response.status).toBe(403);
    });

    it("should return 404 for non-existent role", async () => {
      const response = await request(app)
        .get("/api/restrictions/999999")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("POST /create", () => {
    it("should allow super admin to create new role", async () => {
      const newRoleData = {
        name: "New Test Role",
        permissions: ["view_clients", "manage_clients"],
        is_active: true,
        priority_level: 30,
        description: "New test role description",
        metadata: { custom_field: "new_test_value" },
      };

      const response = await request(app)
        .post("/api/restrictions/create")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send(newRoleData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe(newRoleData.name);
      expect(response.body.permissions).toEqual(newRoleData.permissions);
      expect(response.body.is_active).toBe(newRoleData.is_active);
      expect(response.body.priority_level).toBe(newRoleData.priority_level);
    });

    it("should not allow support agent to create role", async () => {
      const newRoleData = {
        name: "New Test Role",
        permissions: ["view_clients"],
        is_active: true,
        priority_level: 30,
      };

      const response = await request(app)
        .post("/api/restrictions/create")
        .set("Authorization", `Bearer ${supportAgentToken}`)
        .send(newRoleData);

      expect(response.status).toBe(403);
    });

    it("should validate required fields", async () => {
      const response = await request(app)
        .post("/api/restrictions/create")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          name: "New Test Role",
          // Missing required fields
        });

      expect(response.status).toBe(400);
    });

    it("should prevent duplicate role names", async () => {
      const response = await request(app)
        .post("/api/restrictions/create")
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          name: testRole.name, // Duplicate name
          permissions: ["view_clients"],
          is_active: true,
          priority_level: 30,
        });

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /:roleId", () => {
    it("should allow super admin to update role", async () => {
      const updatedData = {
        name: "Updated Test Role",
        permissions: ["view_clients", "manage_clients", "view_reports"],
        is_active: false,
        priority_level: 25,
        description: "Updated test role description",
        metadata: { custom_field: "updated_value" },
      };

      const response = await request(app)
        .put(`/api/restrictions/${testRole.id}`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Rol güncellendi");

      const updatedRole = await Restrictions.findByPk(testRole.id);
      expect(updatedRole.name).toBe(updatedData.name);
      expect(updatedRole.permissions).toEqual(updatedData.permissions);
      expect(updatedRole.is_active).toBe(updatedData.is_active);
      expect(updatedRole.priority_level).toBe(updatedData.priority_level);
    });

    it("should not allow support agent to update role", async () => {
      const updatedData = {
        name: "Updated Test Role",
        permissions: ["view_clients"],
      };

      const response = await request(app)
        .put(`/api/restrictions/${testRole.id}`)
        .set("Authorization", `Bearer ${supportAgentToken}`)
        .send(updatedData);

      expect(response.status).toBe(403);
    });

    it("should validate permission values", async () => {
      const response = await request(app)
        .put(`/api/restrictions/${testRole.id}`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          permissions: ["invalid_permission"],
        });

      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /:roleId", () => {
    it("should allow super admin to delete role", async () => {
      const response = await request(app)
        .delete(`/api/restrictions/${testRole.id}`)
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Rol silindi");

      const deletedRole = await Restrictions.findByPk(testRole.id);
      expect(deletedRole).toBeNull();
    });

    it("should not allow support agent to delete role", async () => {
      const response = await request(app)
        .delete(`/api/restrictions/${testRole.id}`)
        .set("Authorization", `Bearer ${supportAgentToken}`);

      expect(response.status).toBe(403);
    });

    it("should not allow deleting super admin role", async () => {
      const response = await request(app)
        .delete(`/api/restrictions/${superAdmin.restrictions_id}`)
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe("GET /permissions", () => {
    it("should allow super admin to list all available permissions", async () => {
      const response = await request(app)
        .get("/api/restrictions/permissions")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(typeof response.body[0]).toBe("string");
    });

    it("should not allow support agent to list permissions", async () => {
      const response = await request(app)
        .get("/api/restrictions/permissions")
        .set("Authorization", `Bearer ${supportAgentToken}`);

      expect(response.status).toBe(403);
    });
  });
});
