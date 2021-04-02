DROP DATABASE IF EXISTS database_budget;
CREATE DATABASE IF NOT EXISTS database_budget;

USE database_budget;

-- types operations table
CREATE TABLE types_operations(
    id INT(11) NOT NULL AUTO_INCREMENT,
    type_description VARCHAR(10) NOT NULL,
    PRIMARY KEY (id)
);

DESCRIBE types_operations;

-- categories table
CREATE TABLE categories(
    id INT(11) NOT NULL AUTO_INCREMENT,
    category_description VARCHAR(60) NOT NULL,
    PRIMARY KEY (id)
);

DESCRIBE categories;

-- users table
CREATE TABLE users(
    id INT(11) NOT NULL AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(200) NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

DESCRIBE users;

-- sessions table
CREATE TABLE sessions(
    id INT(11) NOT NULL AUTO_INCREMENT,
    user_id INT(11),
    token VARCHAR(200) NOT NULL,
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sessions_user_id FOREIGN KEY (user_id) REFERENCES users(id),
    PRIMARY KEY (id)
);

DESCRIBE sessions;

-- operations table
CREATE TABLE operations(
    id INT(11) NOT NULL AUTO_INCREMENT,
    concept VARCHAR(50) NOT NULL,
    amount FLOAT NOT NULL,
    date_registered DATE NOT NULL,

    type_operation_id INT(11),
    CONSTRAINT fk_operations_type_operation FOREIGN KEY (type_operation_id) REFERENCES types_operations(id),

    category_id INT(11),
    CONSTRAINT fk_operations_category FOREIGN KEY (category_id) REFERENCES categories(id),

    user_id INT(11),
    CONSTRAINT fk_operations_user_id FOREIGN KEY (user_id) REFERENCES users(id),

    PRIMARY KEY (id)
);

DESCRIBE operations;

-- balances table
CREATE TABLE balances(
    id INT(11) NOT NULL AUTO_INCREMENT,
    last_balance FLOAT NOT NULL,

    user_id INT(11),
    CONSTRAINT fk_balances_user_id FOREIGN KEY (user_id) REFERENCES users(id),
    
    PRIMARY KEY (id)
);

DESCRIBE balances;

INSERT into users (id, email, password) values (1, 'admin@gmail.com', '7a7e5290926084cc2487b4468bcf486c');

INSERT into types_operations (type_description) values ('Ingreso');
INSERT into types_operations (type_description) values ('Egreso');

INSERT into categories (id, category_description) values (1, 'General');

INSERT INTO operations (concept, amount, date_registered, type_operation_id, category_id, user_id) VALUES ('Cobro de sueldo', 60000, '2021-03-10', 1, 1, 1);
INSERT INTO operations (concept, amount, date_registered, type_operation_id, category_id, user_id) VALUES ('Compra de auriculares', 3000, '2021-03-15', 2, 1, 1);
INSERT INTO operations (concept, amount, date_registered, type_operation_id, category_id, user_id) VALUES ('Compra libros', 3600, '2021-03-15', 2, 1, 1);
INSERT INTO operations (concept, amount, date_registered, type_operation_id, category_id, user_id) VALUES ('Gastos supermercado', 11000, '2021-03-16', 2, 1, 1);
INSERT INTO operations (concept, amount, date_registered, type_operation_id, category_id, user_id) VALUES ('Burger King', 950, '2021-03-17', 2, 1, 1);

INSERT INTO balances (last_balance, user_id) VALUES (41450, 1);