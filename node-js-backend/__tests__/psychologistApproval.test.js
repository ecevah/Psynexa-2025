const request = require("supertest");
const app = require("../app");
const { Psychologist } = require("../models");

require("./setup");

describe("Psychologist Approval Routes", () => {
  let superAdmin, supportAgent, testPsychologist;
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

    // Test psikoloğu oluştur
    testPsychologist = await Psychologist.create({
      name: "Test",
      surname: "Psychologist",
      email: "test.psych@example.com",
      password: "Test123!",
      status: "active",
      approve_status: "pending",
    });
  });

  describe("PUT /:psychologistId/approval", () => {
    it("should allow super admin to update psychologist approval status", async () => {
      const response = await request(app)
        .put(`/api/psychologist-approval/${testPsychologist.id}/approval`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ approve_status: "approved" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Psikolog onay durumu güncellendi");

      const updatedPsychologist = await Psychologist.findByPk(
        testPsychologist.id
      );
      expect(updatedPsychologist.approve_status).toBe("approved");
    });

    it("should not allow support agent to update psychologist approval status", async () => {
      const response = await request(app)
        .put(`/api/psychologist-approval/${testPsychologist.id}/approval`)
        .set("Authorization", `Bearer ${supportAgentToken}`)
        .send({ approve_status: "approved" });

      expect(response.status).toBe(403);
    });

    it("should validate approval status input", async () => {
      const response = await request(app)
        .put(`/api/psychologist-approval/${testPsychologist.id}/approval`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ approve_status: "invalid_status" });

      expect(response.status).toBe(400);
    });
  });

  describe("GET /pending", () => {
    it("should allow super admin to list pending psychologists", async () => {
      const response = await request(app)
        .get("/api/psychologist-approval/pending")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].approve_status).toBe("pending");
    });

    it("should not allow support agent to list pending psychologists", async () => {
      const response = await request(app)
        .get("/api/psychologist-approval/pending")
        .set("Authorization", `Bearer ${supportAgentToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe("GET /approved", () => {
    beforeEach(async () => {
      await testPsychologist.update({ approve_status: "approved" });
    });

    it("should allow super admin to list approved psychologists", async () => {
      const response = await request(app)
        .get("/api/psychologist-approval/approved")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].approve_status).toBe("approved");
    });

    it("should not allow support agent to list approved psychologists", async () => {
      const response = await request(app)
        .get("/api/psychologist-approval/approved")
        .set("Authorization", `Bearer ${supportAgentToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe("GET /rejected", () => {
    beforeEach(async () => {
      await testPsychologist.update({ approve_status: "rejected" });
    });

    it("should allow super admin to list rejected psychologists", async () => {
      const response = await request(app)
        .get("/api/psychologist-approval/rejected")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].approve_status).toBe("rejected");
    });

    it("should not allow support agent to list rejected psychologists", async () => {
      const response = await request(app)
        .get("/api/psychologist-approval/rejected")
        .set("Authorization", `Bearer ${supportAgentToken}`);

      expect(response.status).toBe(403);
    });
  });
});
