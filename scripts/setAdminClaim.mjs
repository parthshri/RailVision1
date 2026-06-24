import { readFileSync } from "node:fs";
import admin from "firebase-admin";

const email = process.argv[2];

if (!email) {
  console.error("Usage: npm run set-admin -- founder@railvision.ai");
  process.exit(1);
}

const serviceAccountPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "firebase-service-account.json";

const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const user = await admin.auth().getUserByEmail(email);
await admin.auth().setCustomUserClaims(user.uid, { admin: true });

console.log(`Admin claim set for ${email}`);
