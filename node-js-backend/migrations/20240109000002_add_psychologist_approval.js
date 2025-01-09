"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Bu migration artık gerekli değil çünkü tüm alanlar ilk migration'da eklendi
    return Promise.resolve();
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.resolve();
  },
};
