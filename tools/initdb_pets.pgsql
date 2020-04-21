-- Drops pets table
DROP TABLE IF EXISTS pets;

-- Creates pets table
CREATE TABLE IF NOT EXISTS pets (
    id INT NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    animal_id integer NOT NULL,
    owner_id integer NOT NULL,
    CONSTRAINT pets_animal_id_fkey FOREIGN KEY (animal_id)
            REFERENCES animals (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
            NOT VALID,
    CONSTRAINT pets_owner_id_fkey FOREIGN KEY (owner_id)
            REFERENCES owners (id) MATCH SIMPLE
            ON UPDATE CASCADE
            ON DELETE CASCADE
            NOT VALID
);