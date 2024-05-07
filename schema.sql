-- Adminer 4.8.1 PostgreSQL 16.0 (Debian 16.0-1.pgdg120+1) dump

\connect "autoscout";

DROP TABLE IF EXISTS "cars";
CREATE TABLE "public"."cars" (
    "car" character(255) NOT NULL,
    "details" text,
    "price" character(255),
    "location" character(255),
    "chilometraggio" character(255),
    "cambio" character(255),
    "carburante" character(255),
    "potenza" character(255),
    "venditore" character(255),
    "image_url" json,
    "seller_note" text,
    "car_id" character(255) NOT NULL,
    "anno" character(255),
    "url" character(255)
) WITH (oids = false);



-- 2023-10-10 09:45:25.994798+00