CREATE TABLE "book_page_text" (
	"book_id" uuid NOT NULL,
	"page" integer NOT NULL,
	"text" text NOT NULL,
	"display" text NOT NULL,
	"spans" jsonb NOT NULL,
	CONSTRAINT "book_page_text_book_id_page_pk" PRIMARY KEY("book_id","page")
);
--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "publisher" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "isbn" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "collection" text DEFAULT 'TEXTBOOK' NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "searchable" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "book_page_text" ADD CONSTRAINT "book_page_text_book_id_books_id_fk" FOREIGN KEY ("book_id") REFERENCES "public"."books"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "books_collection_idx" ON "books" USING btree ("collection","published");--> statement-breakpoint
ALTER TABLE "books" ADD CONSTRAINT "books_collection" CHECK ("books"."collection" in ('TEXTBOOK', 'AUTHOR'));