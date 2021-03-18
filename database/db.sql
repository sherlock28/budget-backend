DROP DATABASE IF EXISTS database_budget;
CREATE DATABASE IF NOT EXISTS database_budget;

USE database_budget;

-- types operations table
CREATE TABLE types_operations(
    id INT(11) NOT NULL AUTO_INCREMENT,
    type_description VARCHAR(10) NOT NULL,
    PRIMARY KEY (id)
);

INSERT into types_operations (type_description) values ('Ingreso');
INSERT into types_operations (type_description) values ('Egreso');

DESCRIBE types_operations;

-- transactions table
CREATE TABLE operations(
    id INT(11) NOT NULL AUTO_INCREMENT,
    concept VARCHAR(50) NOT NULL,
    amount FLOAT NOT NULL,
    date_registered DATE NOT NULL,
    type_operation_id INT(11),
    CONSTRAINT fk_type_operation FOREIGN KEY (type_operation_id) REFERENCES types_operations(id),
    PRIMARY KEY (id)
);

DESCRIBE operations;

CREATE TABLE balances(
    id INT(11) NOT NULL AUTO_INCREMENT,
    last_balance FLOAT NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO operations (concept, amount, date_registered, type_operation_id) VALUES ('Cobro de sueldo', 60000, '2021-03-10', 1);
INSERT INTO operations (concept, amount, date_registered, type_operation_id) VALUES ('Compra de auriculares', 3000, '2021-03-15', 2);
INSERT INTO operations (concept, amount, date_registered, type_operation_id) VALUES ('Compra libros', 3600, '2021-03-15', 2);
INSERT INTO operations (concept, amount, date_registered, type_operation_id) VALUES ('Gastos supermercado', 11000, '2021-03-16', 2);
INSERT INTO operations (concept, amount, date_registered, type_operation_id) VALUES ('Burger King', 950, '2021-03-17', 2);

INSERT INTO balances (last_balance) VALUES (41450);

DESCRIBE balances;