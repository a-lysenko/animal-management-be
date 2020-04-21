-- Drops wild_animals table
DROP TABLE IF EXISTS wild_animals;

-- Drops animals table
DROP TABLE IF EXISTS animals CASCADE;

-- Creates animals table
CREATE TABLE IF NOT EXISTS animals (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY
    , birthday date
    , species varchar(50)
    , vaccinated boolean
);

-- Creates wild_animals table
CREATE TABLE IF NOT EXISTS wild_animals (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    animal_id integer NOT NULL,
    trackingid integer NOT NULL,
    CONSTRAINT wild_animals_animal_id_fkey FOREIGN KEY (animal_id)
        REFERENCES animals (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
);
