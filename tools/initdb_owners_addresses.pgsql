-- Drops addresses table
DROP TABLE IF EXISTS addresses;

-- Drops owners table
DROP TABLE IF EXISTS owners CASCADE;

-- Creates owners table
CREATE TABLE IF NOT EXISTS owners (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , fullname varchar(80) NOT NULL
);

-- Creates addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id integer NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    owner_id integer NOT NULL,
    city varchar(50),
    country varchar(50),
    street varchar(50),
    zipcode varchar(10),
    CONSTRAINT addresses_owner_id_fkey FOREIGN KEY (owner_id)
        REFERENCES owners (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
);