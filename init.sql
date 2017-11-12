DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;


/* CUSTOMERS */
CREATE TABLE `Customers`(
	customer_id INT NOT NULL AUTO_INCREMENT,
	first_name VARCHAR(20) NOT NULL,
	last_name VARCHAR(20) NOT NULL,
	PRIMARY KEY (customer_id)
);

/* DEPARTMENTS*/
CREATE TABLE `Departments`(
	department_id INT NOT NULL AUTO_INCREMENT,
	department_name VARCHAR(100) NULL,
	overhead_costs DECIMAL(20,2) NULL,
	PRIMARY KEY (department_id)
);

/* PRODUCTS */
CREATE TABLE `Products`(
	item_id INT NOT NULL AUTO_INCREMENT,
	department_id INT NOT NULL,
	product_name VARCHAR(100) NULL,
	cost DECIMAL(20,2) NULL,
	list_price DECIMAL(20,2) NULL,
	stock_quantity INT NOT NULL,
	PRIMARY KEY (item_id),
	FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);


/* ORDERS */
CREATE TABLE `Orders`(
	order_id INT NOT NULL AUTO_INCREMENT,
	customer_id INT NOT NULL,
	item_id INT NOT NULL,
	quantity INT NOT NULL,
	PRIMARY KEY (order_id),
	FOREIGN KEY (item_id) REFERENCES Products(item_id),
	FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);


/* DATA POPULATION */
INSERT INTO Departments VALUES (NULL, 'Electronics', 10000);
INSERT INTO Departments VALUES (NULL, 'Clothing', 3321);
INSERT INTO Departments VALUES (NULL, 'Books', 1992);
INSERT INTO Departments VALUES (NULL, 'Home & Beauty', 3291);
INSERT INTO Departments VALUES (NULL, 'Sports', 222);

INSERT INTO Products VALUES (NULL, 1, 'iPad', 10, 30, 383);
INSERT INTO Products VALUES (NULL, 1, 'Dell Monitor', 140, 400, 1);
INSERT INTO Products VALUES (NULL, 1, 'Zune', 23, 111, 343);
INSERT INTO Products VALUES (NULL, 1, 'Vacuum Cleaner', 99, 200, 122);
INSERT INTO Products VALUES (NULL, 1, 'Powerbank', 44, 310, 45);

INSERT INTO Products VALUES (NULL, 2, 'Black T-Shirt', 2, 6, 329);
INSERT INTO Products VALUES (NULL, 2, 'Green Turtleneck', 23, 99, 5);
INSERT INTO Products VALUES (NULL, 2, 'Ugly Pants', 52, 94, 232);
INSERT INTO Products VALUES (NULL, 2, 'Used Overalls', 36, 50, 3);
INSERT INTO Products VALUES (NULL, 2, 'Boxers', 2, 12, 33);

INSERT INTO Products VALUES (NULL, 3, 'A Mystery Novel', 32, 65, 3);
INSERT INTO Products VALUES (NULL, 3, 'Huckleberry Finn', 2, 34, 1);
INSERT INTO Products VALUES (NULL, 3, '1984', 4, 53, 323);
INSERT INTO Products VALUES (NULL, 3, 'Animal Farm', 12, 34, 232);
INSERT INTO Products VALUES (NULL, 3, 'The Bible', 23, 122, 131);

INSERT INTO Products VALUES (NULL, 4, 'Face Cleaner', 4, 9, 131);
INSERT INTO Products VALUES (NULL, 4, 'Toothpaste', 3, 29, 443);
INSERT INTO Products VALUES (NULL, 4, 'Toothbrush', 14, 70, 24);
INSERT INTO Products VALUES (NULL, 4, 'Shampoo', 11, 22, 412);
INSERT INTO Products VALUES (NULL, 4, 'Shower Gel', 3, 44, 33);

INSERT INTO Products VALUES (NULL, 5, 'Glock Handgun', 53, 999, 3);
INSERT INTO Products VALUES (NULL, 5, 'Assault Rifle', 333, 1200, 333);
INSERT INTO Products VALUES (NULL, 5, 'Bolt-action Shotgun', 788, 2300, 735);
INSERT INTO Products VALUES (NULL, 5, 'Ping-pong Ball', 11, 30, 354);
INSERT INTO Products VALUES (NULL, 5, 'Golf Stick', 31, 78, 312);

INSERT INTO Customers VALUES (NULL, 'Adam', 'Williams');
INSERT INTO Customers VALUES (NULL, 'Borat', 'Kaley');
INSERT INTO Customers VALUES (NULL, 'Corey', 'Maleris');
INSERT INTO Customers VALUES (NULL, 'Derek', 'Grant');
INSERT INTO Customers VALUES (NULL, 'Ella', 'Fitzgerald');

INSERT INTO Orders VALUES (NULL, 1, 4, 31);
INSERT INTO Orders VALUES (NULL, 2, 2, 122);
INSERT INTO Orders VALUES (NULL, 3, 3, 53);
INSERT INTO Orders VALUES (NULL, 4, 9, 43);
INSERT INTO Orders VALUES (NULL, 5, 14, 53);
INSERT INTO Orders VALUES (NULL, 3, 2, 143);
INSERT INTO Orders VALUES (NULL, 1, 5, 133);
INSERT INTO Orders VALUES (NULL, 2, 8, 131);
INSERT INTO Orders VALUES (NULL, 3, 18, 12);
INSERT INTO Orders VALUES (NULL, 4, 21, 39);
INSERT INTO Orders VALUES (NULL, 5, 11, 25);
INSERT INTO Orders VALUES (NULL, 2, 7, 63);
INSERT INTO Orders VALUES (NULL, 1, 15, 5);
INSERT INTO Orders VALUES (NULL, 4, 24, 11);
INSERT INTO Orders VALUES (NULL, 2, 23, 12);