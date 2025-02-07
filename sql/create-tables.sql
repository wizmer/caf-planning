\connect caf;
DROP TABLE if exists events;
DROP TABLE if exists slots;
DROP TABLE if exists referents;

CREATE TABLE referents(
  id SERIAL PRIMARY KEY,
   name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE slots(
  id SERIAL PRIMARY KEY,
  ref_id INTEGER REFERENCES referents (id),
  day VARCHAR(10) NOT NULL,
  start_at TIME WITHOUT TIME ZONE NOT NULL,
  end_at TIME WITHOUT TIME ZONE NOT NULL
  );

CREATE TABLE events(
  id SERIAL PRIMARY KEY,
  day VARCHAR(10) NOT NULL UNIQUE,
  type VARCHAR NOT NULL
);

GRANT ALL ON referents to bcoste;
GRANT ALL ON slots to bcoste;
GRANT ALL ON events to bcoste;
GRANT USAGE ON SEQUENCE slots_id_seq TO bcoste;


INSERT INTO referents(name) VALUES
('Christophe'),
('Jerome'),
('Dom S.'),
('Florian'),
('Dominique'),
('Benoît C'),
('Noémie'),
('Nicolas'),
('Alain'),
('Jonathan'),
('Timothée'),
('Pierre S.'),
('Josiane');

INSERT INTO slots VALUES (DEFAULT, 1, '2025-01-27', '18:00', '20:30');

INSERT INTO events VALUES
  (DEFAULT, '2024-05-01', 'cancelled'),
  (DEFAULT, '2025-02-12', 'new-slot');

