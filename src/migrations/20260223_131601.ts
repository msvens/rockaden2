import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_training_groups_status" AS ENUM('draft', 'active', 'archived');
  CREATE TYPE "public"."enum_training_sessions_games_result" AS ENUM('1-0', '0.5-0.5', '0-1', 'bye-white', 'bye-black');
  CREATE TABLE "training_groups_participants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"ssf_id" numeric NOT NULL,
  	"active" boolean DEFAULT true
  );
  
  CREATE TABLE "training_groups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"status" "enum_training_groups_status" DEFAULT 'draft' NOT NULL,
  	"event_id" integer,
  	"description" varchar,
  	"semester" varchar,
  	"has_tournament" boolean DEFAULT false,
  	"created_by_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "training_sessions_attendance" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"participant_id" varchar NOT NULL,
  	"present" boolean DEFAULT false
  );
  
  CREATE TABLE "training_sessions_games" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"round" numeric NOT NULL,
  	"white_id" varchar NOT NULL,
  	"black_id" varchar NOT NULL,
  	"result" "enum_training_sessions_games_result"
  );
  
  CREATE TABLE "training_sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"group_id" integer NOT NULL,
  	"session_date" timestamp(3) with time zone NOT NULL,
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "training_groups_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "training_sessions_id" integer;
  ALTER TABLE "training_groups_participants" ADD CONSTRAINT "training_groups_participants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."training_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "training_groups" ADD CONSTRAINT "training_groups_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "training_groups" ADD CONSTRAINT "training_groups_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "training_sessions_attendance" ADD CONSTRAINT "training_sessions_attendance_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."training_sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "training_sessions_games" ADD CONSTRAINT "training_sessions_games_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."training_sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_group_id_training_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."training_groups"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "training_groups_participants_order_idx" ON "training_groups_participants" USING btree ("_order");
  CREATE INDEX "training_groups_participants_parent_id_idx" ON "training_groups_participants" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "training_groups_slug_idx" ON "training_groups" USING btree ("slug");
  CREATE INDEX "training_groups_event_idx" ON "training_groups" USING btree ("event_id");
  CREATE INDEX "training_groups_created_by_idx" ON "training_groups" USING btree ("created_by_id");
  CREATE INDEX "training_groups_updated_at_idx" ON "training_groups" USING btree ("updated_at");
  CREATE INDEX "training_groups_created_at_idx" ON "training_groups" USING btree ("created_at");
  CREATE INDEX "training_sessions_attendance_order_idx" ON "training_sessions_attendance" USING btree ("_order");
  CREATE INDEX "training_sessions_attendance_parent_id_idx" ON "training_sessions_attendance" USING btree ("_parent_id");
  CREATE INDEX "training_sessions_games_order_idx" ON "training_sessions_games" USING btree ("_order");
  CREATE INDEX "training_sessions_games_parent_id_idx" ON "training_sessions_games" USING btree ("_parent_id");
  CREATE INDEX "training_sessions_group_idx" ON "training_sessions" USING btree ("group_id");
  CREATE INDEX "training_sessions_updated_at_idx" ON "training_sessions" USING btree ("updated_at");
  CREATE INDEX "training_sessions_created_at_idx" ON "training_sessions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_training_groups_fk" FOREIGN KEY ("training_groups_id") REFERENCES "public"."training_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_training_sessions_fk" FOREIGN KEY ("training_sessions_id") REFERENCES "public"."training_sessions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_training_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("training_groups_id");
  CREATE INDEX "payload_locked_documents_rels_training_sessions_id_idx" ON "payload_locked_documents_rels" USING btree ("training_sessions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "training_groups_participants" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "training_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "training_sessions_attendance" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "training_sessions_games" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "training_sessions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "training_groups_participants" CASCADE;
  DROP TABLE "training_groups" CASCADE;
  DROP TABLE "training_sessions_attendance" CASCADE;
  DROP TABLE "training_sessions_games" CASCADE;
  DROP TABLE "training_sessions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_training_groups_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_training_sessions_fk";
  
  DROP INDEX "payload_locked_documents_rels_training_groups_id_idx";
  DROP INDEX "payload_locked_documents_rels_training_sessions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "training_groups_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "training_sessions_id";
  DROP TYPE "public"."enum_training_groups_status";
  DROP TYPE "public"."enum_training_sessions_games_result";`)
}
