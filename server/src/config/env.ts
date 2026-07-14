import "dotenv/config";

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    console.error(`\n[FATAL] Missing required env var: ${name}\n` + `Copy .env.example to .env and fill it in.\n`);
    process.exit(1);
  }
  return v;
}

export const env = {
  MONGODB_URI: required("MONGODB_URI"),
  JWT_SECRET: required("JWT_SECRET"),
  PORT: Number(process.env.PORT ?? 5000),
  CLIENT_URL: process.env.CLIENT_URL ?? "http://localhost:8080",
  EMAIL_USER: process.env.EMAIL_USER ?? "",
  EMAIL_PASS: process.env.EMAIL_PASS ?? "",
  EMAIL_FROM: process.env.EMAIL_FROM ?? "learnandcraft09@gmail.com",
  SMTP_HOST: process.env.SMTP_HOST ?? "smtp.gmail.com",
  SMTP_PORT: Number(process.env.SMTP_PORT ?? 465),
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ?? "learnandcraft09@gmail.com",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ?? "Pratik@12210570",
  ADMIN_NAME: process.env.ADMIN_NAME ?? "Admin",
};