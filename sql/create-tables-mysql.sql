DROP TABLE if exists slots;
DROP TABLE if exists referents;

CREATE TABLE referents(
  id int NOT NULL,
   name VARCHAR(255) NOT NULL,
   PRIMARY KEY (ID)
);

CREATE TABLE slots(
  id INT NOT NULL,
  ref_id INT NOT NULL,
  day DATE NOT NULL,
  start_at VARCHAR(5) NOT NULL,
  end_at VARCHAR(5) NOT NULL,
  PRIMARY KEY (ID),
  CONSTRAINT fk_ref foreign key (ref_id) REFERENCES referents(id) on delete cascade
  );


insert into referents values
  (0, 'pierre'),
  (1, 'julie'),
  (2, 'antony'),
  (3, 'miriam');


insert into slots values (0, 0, '2024-01-24', '18:00', '20:30')
