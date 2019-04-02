DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50),
  department_name VARCHAR(30),
  price DECIMAL(10,2),
  stock_quantity INTEGER,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("ANCO AR-14D Rear Wiper Blade", "Auto Parts", 10.53, 15), 
("SanDisk 64GB USB Flash Drive", "Electronics", 12.99, 421), 
("Pooping Pooches 2019 Calendar", "Books", 16.99, 40),
("iPhone 7 Phone Case", "Cell Phones & Accessories", 9.98, 305),
("50ft Expandable Garden Hose", "Home & Garden", 17.99, 62),
("Echo - Second Generation - Grey", "Electronics", 99.99, 250),
("iPhone 7 Glass Screen Protector", "Cell Phones & Accessories", 6.99, 100),
("EltaMD UV Sport SPF 50, 7.0 oz", "Health & Beauty", 47.50, 30),
("Bridgestone e6 Golf Balls - 12-pack", "Sporting Goods", 23.99, 12),
("32oz Hydro Flask (Green)", "Home & Kitchen", 39.95, 6);

SELECT * FROM products;
