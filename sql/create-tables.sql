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


insert into referents values
  (0, 'pierre'),
  (1, 'julie'),
  (2, 'antony'),
  (3, 'miriam');


insert into slots values (0, 0, '2024-01-24', '18:00', '20:30')
