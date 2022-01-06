import { Migration } from '@mikro-orm/migrations';

export class lastGeofenceEvent1641361229812 extends Migration {
    name = 'lastGeofenceEvent1641361229812'

    public async up(): Promise<void> {
        this.addSql(`CREATE TABLE "temporary_join_user_hub" ("userId" integer NOT NULL, "hubId" integer NOT NULL, "isOwner" boolean NOT NULL, "starred" boolean NOT NULL DEFAULT (0), "isPresent" boolean NOT NULL DEFAULT (0), "lastUpdated" varchar, "lastGeofenceEvent" varchar, CONSTRAINT "FK_77f66af41fadebe148e9717499d" FOREIGN KEY ("hubId") REFERENCES "hub" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_9b7e78f7bcde729db66f0981bf8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("userId", "hubId"))`);
        this.addSql(`INSERT INTO "temporary_join_user_hub"("userId", "hubId", "isOwner", "starred", "isPresent", "lastUpdated") SELECT "userId", "hubId", "isOwner", "starred", "isPresent", "lastUpdated" FROM "join_user_hub"`);
        this.addSql(`DROP TABLE "join_user_hub"`);
        this.addSql(`ALTER TABLE "temporary_join_user_hub" RENAME TO "join_user_hub"`);
    }

    public async down(): Promise<void> {
        this.addSql(`ALTER TABLE "join_user_hub" RENAME TO "temporary_join_user_hub"`);
        this.addSql(`CREATE TABLE "join_user_hub" ("userId" integer NOT NULL, "hubId" integer NOT NULL, "isOwner" boolean NOT NULL, "starred" boolean NOT NULL DEFAULT (0), "isPresent" boolean NOT NULL DEFAULT (0), "lastUpdated" varchar, CONSTRAINT "FK_77f66af41fadebe148e9717499d" FOREIGN KEY ("hubId") REFERENCES "hub" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_9b7e78f7bcde729db66f0981bf8" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("userId", "hubId"))`);
        this.addSql(`INSERT INTO "join_user_hub"("userId", "hubId", "isOwner", "starred", "isPresent", "lastUpdated") SELECT "userId", "hubId", "isOwner", "starred", "isPresent", "lastUpdated" FROM "temporary_join_user_hub"`);
        this.addSql(`DROP TABLE "temporary_join_user_hub"`);
    }

}
