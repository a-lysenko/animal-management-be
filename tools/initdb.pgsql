-- Drops animals table
DROP TABLE IF EXISTS animals;

-- Creates animals table
CREATE TABLE IF NOT EXISTS animals (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , birthday date
    , species varchar(50)
    , vaccinated boolean
);
