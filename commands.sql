CREATE TABLE blogs (
id SERIAL PRIMARY KEY,
author VARCHAR,
url VARCHAR NOT NULL,
title VARCHAR NOT NULL,
likes INT DEFAULT 0)
;