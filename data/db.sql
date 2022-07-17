
drop table categories;

CREATE TABLE categories (
   id serial PRIMARY KEY,
   name varchar(50) Unique Not Null,
   description varchar(100),
   imageUrl varchar(1000),
);