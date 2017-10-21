DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
	id INT NOT NULL AUTO_INCREMENT,
    product VARCHAR(100),
    department VARCHAR(100),
    price DECIMAL(8,2) NOT NULL,
    stock INT(100)NOT NULL,
    PRIMARY KEY (id)
);	

INSERT INTO products (product, department, price, stock)
VALUES ("Iphone6", "Electronics", 899.00, 100),
   ("samsung8", "Electronics", 799.00, 80),
   ("Beats Solo2", "Electronics", 149.00, 95),
   ("Samsung Galaxy Tab", "Electronics", 99.00, 100),
   ("Rechargeable Batteries", "Electronics", 23.99, 500),
   ("Dog leash", "Pet", 6.99, 200),
   ("Dog food", "Pet", 39.99, 120),
   ("Tooth paste", "Personal Care", 4.98, 100),
   ("Pantene", "Personal Care", 25.77, 150),
   ("Body Lotion", "Personal Care", 17.99, 150);

SELECT * FROM products;