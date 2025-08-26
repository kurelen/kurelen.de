export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MAIL_DRIVER?: "smtp" | "console" | "ethereal";
      SMTP_HOST?: string;
      SMTP_PORT?: string;
      SMTP_USER?: string;
      SMTP_PASS?: string;
      MAIL_FROM?: string;
      NODE_ENV?: "development" | "production" | "test";
    }
  }
}
