-- Up Migration
CREATE TABLE "public"."users" (
  "user_id" VARCHAR(26),
  "email" VARCHAR(255) NOT NULL,
  "name" VARCHAR(70) NOT NULL,
  "password_hash" TEXT NOT NULL,
  "verified_at" TIMESTAMPTZ,
  "created_at" TIMESTAMPTZ NOT NULL,
  "updated_at" TIMESTAMPTZ NOT NULL,

  PRIMARY KEY ("user_id")
);

CREATE UNIQUE INDEX "unique_email_idx" ON "public"."users" ("email");

-- Down Migration
DROP TABLE "public"."users";
