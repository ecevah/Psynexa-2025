const sequelize = require("../config/database");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Test öncesi veritabanı bağlantısını kur
beforeAll(async () => {
  try {
    await sequelize.authenticate();
    console.log("Test veritabanı bağlantısı başarılı");
  } catch (error) {
    console.error("Test veritabanı bağlantı hatası:", error);
    process.exit(1);
  }
});

// Test sonrası bağlantıyı kapat
afterAll(async () => {
  await sequelize.close();
});

// Her test öncesi veritabanını temizle
beforeEach(async () => {
  await sequelize.truncate({ cascade: true });
});

// Test yardımcı fonksiyonları
global.helpers = {
  // Test kullanıcıları oluştur
  createTestUsers: async () => {
    const { Staff, Restrictions } = require("../models");

    // Super Admin rolü oluştur
    const superAdminRole = await Restrictions.create({
      name: "Super Admin",
      permissions: [
        "view_psychologist_approvals",
        "manage_psychologist_approvals",
        "view_staff",
        "manage_staff",
        "view_restrictions",
        "manage_restrictions",
      ],
      is_active: true,
      priority_level: 1,
    });

    // Super Admin kullanıcısı oluştur
    const superAdmin = await Staff.create({
      name: "Super",
      surname: "Admin",
      email: "superadmin@test.com",
      password: "Test123!",
      restrictions_id: superAdminRole.id,
    });

    // Support Agent rolü oluştur
    const supportRole = await Restrictions.create({
      name: "Support Agent",
      permissions: ["view_clients", "view_client_details"],
      is_active: true,
      priority_level: 40,
    });

    // Support Agent kullanıcısı oluştur
    const supportAgent = await Staff.create({
      name: "Support",
      surname: "Agent",
      email: "support@test.com",
      password: "Test123!",
      restrictions_id: supportRole.id,
    });

    return { superAdmin, supportAgent };
  },

  // Test token'ları oluştur
  generateTestTokens: (userId, type = "staff") => {
    const accessToken = jwt.sign(
      { [type + "_id"]: userId },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { [type + "_id"]: userId },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return { accessToken, refreshToken };
  },

  // Test verisi oluştur
  createTestData: async () => {
    const {
      Client,
      Psychologist,
      Package,
      Payment,
      Test,
      Question,
      Response,
    } = require("../models");

    // Test psikoloğu oluştur
    const psychologist = await Psychologist.create({
      name: "Test",
      surname: "Psychologist",
      email: "psych@test.com",
      password: "Test123!",
      status: "active",
      approve_status: "approved",
    });

    // Test müşterisi oluştur
    const client = await Client.create({
      name: "Test",
      surname: "Client",
      email: "client@test.com",
      password: "Test123!",
    });

    // Test paketi oluştur
    const testPackage = await Package.create({
      name: "Test Package",
      price: 100,
      session_count: 4,
    });

    // Test ödemesi oluştur
    const payment = await Payment.create({
      client_id: client.id,
      package_id: testPackage.id,
      amount: 100,
      status: "completed",
    });

    // Test testi oluştur
    const test = await Test.create({
      title: "Test Assessment",
      description: "Test description",
      created_by: psychologist.id,
    });

    // Test sorusu oluştur
    const question = await Question.create({
      test_id: test.id,
      question: "Test question?",
      type: "multiple_choice",
      options: ["Option 1", "Option 2", "Option 3"],
      created_by: psychologist.id,
    });

    // Test cevabı oluştur
    const response = await Response.create({
      client_id: client.id,
      test_id: test.id,
      question_id: question.id,
      answer: "Option 1",
    });

    return {
      psychologist,
      client,
      testPackage,
      payment,
      test,
      question,
      response,
    };
  },
};

// Test matchers'ları genişlet
expect.extend({
  toBeValidUUID(received) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    return {
      pass,
      message: () =>
        `expected ${received} ${pass ? "not " : ""}to be a valid UUID`,
    };
  },
});
