# MySQL Database using Node

Basic useful feature list:

 * Created a shop inventory database using MySQL.
 * User can choose a customer to place an order from the product list
 * The 'Manager View' in the 'bamazon_manager.js' file provides Sales data grouped by Customer and Department.

Structure of the Database (Entitites/Tables):
* PRODUCTS (Item ID, Department ID, Product Name, Cost, List Price, Stock Quantity)
* CUSTOMERS (Customer ID, First Name, Last Name)
* ORDERS (Order ID, Customer ID, Item ID, Quantity)
* DEPARTMENTS (Department ID, Department Name, Overhead Costs)


### Here's some GUI screenshots from the Client View :+1:

The first thing you do is to choose a customer, and you will place orders on behalf of those customers. Choose using their ID's.

![userpick](https://i.gyazo.com/1b210c9881c9f848e89bcf7d320a7d6f.png)

Then you will choose a product to buy by inputting the ID of the product.

[![https://gyazo.com/68863306980a567593f64f90cffcb904](https://i.gyazo.com/68863306980a567593f64f90cffcb904.png)](https://gyazo.com/68863306980a567593f64f90cffcb904)

In the example above, the user puts an amount bigger than the amount of stock. If the user inputs the correct quantity, it will look like this:

[![https://gyazo.com/ced542115aac9a42f0d115cfdc184501](https://i.gyazo.com/ced542115aac9a42f0d115cfdc184501.png)](https://gyazo.com/ced542115aac9a42f0d115cfdc184501)

...showing the total cost. The order will be recorded in the "Orders" Table for future computations.

### Moving on to the Manager's View:

This is the Main Menu:

[![https://gyazo.com/371cf6e27b9f7a9ebf028e3ad01a880e](https://i.gyazo.com/371cf6e27b9f7a9ebf028e3ad01a880e.png)](https://gyazo.com/371cf6e27b9f7a9ebf028e3ad01a880e)

Filtering products with quantities lower than 5:
```
SELECT d.department_name as 'DEPARTMENT', 
	  p.item_id as 'ID', 
	  p.product_name as 'NAME', 
	  concat('$', p.list_price) as 'PRICE',
	  p.stock_quantity as 'QTY'
FROM departments d, products p
WHERE d.department_id = p.department_id AND p.stock_quantity <= 5;
```
[![https://gyazo.com/c26efc0226a98a8052d8d414a2479838](https://i.gyazo.com/c26efc0226a98a8052d8d414a2479838.png)](https://gyazo.com/c26efc0226a98a8052d8d414a2479838)

Adding stuff to the inventory (updating the amount of stock):
```
UPDATE products SET stock_quantity = stock_quantity + ${a.qty} WHERE products.item_id = ${a.id};
```

[![https://gyazo.com/364fe4e9d8d8efad63ddbfbbbd8cf791](https://i.gyazo.com/364fe4e9d8d8efad63ddbfbbbd8cf791.png)](https://gyazo.com/364fe4e9d8d8efad63ddbfbbbd8cf791)

Adding new products:
```
INSERT INTO products VALUES (NULL, ${a.dept_id}, "${a.name}", ${a.cost}, ${a.price}, ${a.qty});
```

[![https://gyazo.com/c7eb165b8bfaceced7923cd4f0d28875](https://i.gyazo.com/c7eb165b8bfaceced7923cd4f0d28875.png)](https://gyazo.com/c7eb165b8bfaceced7923cd4f0d28875)

Aggregating Sales by Department (the Overhead Costs are random):
```
SELECT  d.department_name as DEPARTMENT, 
		SUM(p.list_price * o.quantity) as 'TOTAL SALES', 
		d.overhead_costs as 'OVERHEAD COSTS', 
		(SUM(p.list_price * o.quantity) - d.overhead_costs) as 'PROFIT'
 FROM orders o, products p, departments d 
 WHERE p.department_id = d.department_id AND o.item_id = p.item_id
 GROUP BY d.department_name;
```

[![https://gyazo.com/05daf58aa564d8ba3b016228719053d4](https://i.gyazo.com/05daf58aa564d8ba3b016228719053d4.png)](https://gyazo.com/05daf58aa564d8ba3b016228719053d4)

Aggregating Sales by Customer:
```
SELECT  c.customer_id as 'ID',
		concat(c.first_name, ' ', c.last_name) as "CUSTOMER NAME", 
		SUM(p.list_price * o.quantity) as 'TOTAL SALES'
 FROM orders o, products p, customers c
 WHERE o.item_id = p.item_id AND o.customer_id = c.customer_id
 GROUP BY c.customer_id;
```
[![https://gyazo.com/2957d00b55dd597ec8e7286e533d4f3a](https://i.gyazo.com/2957d00b55dd597ec8e7286e533d4f3a.png)](https://gyazo.com/2957d00b55dd597ec8e7286e533d4f3a)

