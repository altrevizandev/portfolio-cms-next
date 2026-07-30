DROP INDEX "projects_status_published_at_idx";

ALTER TABLE "projects"
ADD COLUMN "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "projects_status_featured_sort_order_published_at_idx"
ON "projects"("status", "featured", "sort_order", "published_at");
