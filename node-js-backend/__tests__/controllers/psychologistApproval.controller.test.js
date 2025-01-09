const request = require("supertest");
const app = require("../../app");
const { Psychologist, Staff, Restrictions } = require("../../models");

describe("PsychologistApprovalController", () => {
  let testPsychologist;
  let superAdmin;
  let superAdminToken;

  beforeEach(async () => {
    // Test kullanıcılarını oluştur
    const users = await global.helpers.createTestUsers();
    superAdmin = users.superAdmin;
    superAdminToken = global.helpers.generateTestTokens(
      superAdmin.id
    ).accessToken;

    // Test psikoloğunu oluştur
    testPsychologist = await Psychologist.create({
      name: "Test",
      surname: "Psychologist",
      email: "test.psych@example.com",
      password: "Test123!",
      phone: "+905551234567",
      specialization: "Clinical Psychology",
      education: "PhD in Psychology",
      experience_years: 5,
      status: "active",
      approve_status: "pending",
    });
  });

  describe("updateApprovalStatus", () => {
    it("should update psychologist approval status to approved", async () => {
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

    it("should update psychologist approval status to rejected", async () => {
      const response = await request(app)
        .put(`/api/psychologist-approval/${testPsychologist.id}/approval`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({
          approve_status: "rejected",
          rejection_reason: "Insufficient qualifications",
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Psikolog onay durumu güncellendi");

      const updatedPsychologist = await Psychologist.findByPk(
        testPsychologist.id
      );
      expect(updatedPsychologist.approve_status).toBe("rejected");
      expect(updatedPsychologist.rejection_reason).toBe(
        "Insufficient qualifications"
      );
    });

    it("should require rejection reason when rejecting", async () => {
      const response = await request(app)
        .put(`/api/psychologist-approval/${testPsychologist.id}/approval`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ approve_status: "rejected" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Ret nedeni belirtilmelidir");
    });

    it("should validate approval status value", async () => {
      const response = await request(app)
        .put(`/api/psychologist-approval/${testPsychologist.id}/approval`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ approve_status: "invalid_status" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Geçersiz onay durumu");
    });

    it("should handle non-existent psychologist", async () => {
      const response = await request(app)
        .put(`/api/psychologist-approval/999999/approval`)
        .set("Authorization", `Bearer ${superAdminToken}`)
        .send({ approve_status: "approved" });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe("Psikolog bulunamadı");
    });
  });

  describe("listPendingPsychologists", () => {
    it("should list all pending psychologists", async () => {
      const response = await request(app)
        .get("/api/psychologist-approval/pending")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].approve_status).toBe("pending");
    });

    it("should include necessary psychologist details", async () => {
      const response = await request(app)
        .get("/api/psychologist-approval/pending")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      const psychologist = response.body[0];
      expect(psychologist).toHaveProperty("id");
      expect(psychologist).toHaveProperty("name");
      expect(psychologist).toHaveProperty("email");
      expect(psychologist).toHaveProperty("specialization");
      expect(psychologist).toHaveProperty("education");
      expect(psychologist).toHaveProperty("experience_years");
      expect(psychologist).not.toHaveProperty("password");
    });
  });

  describe("listApprovedPsychologists", () => {
    beforeEach(async () => {
      await testPsychologist.update({ approve_status: "approved" });
    });

    it("should list all approved psychologists", async () => {
      const response = await request(app)
        .get("/api/psychologist-approval/approved")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].approve_status).toBe("approved");
    });
  });

  describe("listRejectedPsychologists", () => {
    beforeEach(async () => {
      await testPsychologist.update({
        approve_status: "rejected",
        rejection_reason: "Test rejection reason",
      });
    });

    it("should list all rejected psychologists", async () => {
      const response = await request(app)
        .get("/api/psychologist-approval/rejected")
        .set("Authorization", `Bearer ${superAdminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0].approve_status).toBe("rejected");
      expect(response.body[0].rejection_reason).toBe("Test rejection reason");
    });
  });

  describe("Authorization", () => {
    let supportAgent;
    let supportAgentToken;

    beforeEach(async () => {
      supportAgent = (await global.helpers.createTestUsers()).supportAgent;
      supportAgentToken = global.helpers.generateTestTokens(
        supportAgent.id
      ).accessToken;
    });

    it("should not allow support agent to update approval status", async () => {
      const response = await request(app)
        .put(`/api/psychologist-approval/${testPsychologist.id}/approval`)
        .set("Authorization", `Bearer ${supportAgentToken}`)
        .send({ approve_status: "approved" });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Bu işlem için yetkiniz yok");
    });

    it("should not allow support agent to list pending psychologists", async () => {
      const response = await request(app)
        .get("/api/psychologist-approval/pending")
        .set("Authorization", `Bearer ${supportAgentToken}`);

      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Bu işlem için yetkiniz yok");
    });

    it("should require authentication", async () => {
      const response = await request(app).get(
        "/api/psychologist-approval/pending"
      );

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Yetkilendirme başarısız");
    });
  });
});
