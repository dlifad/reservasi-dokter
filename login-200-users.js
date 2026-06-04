const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:5000";
const TOTAL_USERS = 200;
const PASSWORD = "123456";

async function loginAllUsers() {
  const results = [];

  for (let i = 1; i <= TOTAL_USERS; i++) {
    const email = `testpasien${i}@test.com`;

    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password: PASSWORD,
        }),
      });

      const data = await res.json();

      results.push({
        email,
        status: res.status,
        token: data.token || null,
        raw: data,
      });

      console.log(`[${res.status}] ${email}`);
    } catch (err) {
      results.push({
        email,
        status: "ERROR",
        token: null,
        error: err.message,
      });

      console.log(`[ERROR] ${email} -> ${err.message}`);
    }
  }

  const outputPath = path.join(__dirname, "tokens-200.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\nSelesai. Hasil disimpan ke: ${outputPath}`);
}

loginAllUsers();