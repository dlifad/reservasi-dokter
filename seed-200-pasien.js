const bcrypt = require("bcryptjs");
const db = require("./src/config/db");

const TOTAL_USERS = 200;
const PASSWORD = "123456";

const insertUser = db.prepare(`
  INSERT INTO users (name, email, password, role, is_active)
  VALUES (?, ?, ?, 'pasien', 1)
`);

const seedUsers = db.transaction(() => {
  for (let i = 1; i <= TOTAL_USERS; i++) {
    const name = `Test Pasien ${i}`;
    const email = `testpasien${i}@test.com`;
    const hashedPassword = bcrypt.hashSync(PASSWORD, 10);

    try {
      insertUser.run(name, email, hashedPassword);
      console.log(`✅ ${email}`);
    } catch (err) {
      console.log(`⚠️ Skip ${email}: ${err.message}`);
    }
  }
});

seedUsers();

console.log(`Selesai membuat ${TOTAL_USERS} akun pasien.`);
console.log(`Password semua akun: ${PASSWORD}`);