DROP TABLE if exists slots;
DROP TABLE if exists referents;

CREATE TABLE referents(
  id SERIAL PRIMARY KEY,
   name VARCHAR NOT NULL UNIQUE
);

CREATE TABLE slots(
  id SERIAL PRIMARY KEY,
  ref_id INTEGER REFERENCES referents (id),
  day DATE NOT NULL,
  start_at TIME WITHOUT TIME ZONE NOT NULL,
  end_at TIME WITHOUT TIME ZONE NOT NULL
  );


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

INSERT INTO slots VALUES (DEFAULT, 1, '2024-01-24', '18:00', '20:30');
