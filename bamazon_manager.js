const mysql = require('mysql');
const inquirer = require('inquirer');
const fs = require('fs');
const table = require('table');
const _ = require('underscore');

//CREATE DATABASE AND TABLES FROM INIT.SQL FILE
var init = fs.readFileSync('init.sql').toString();

//ESTABLISH MYSQL CONNECTION
var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '',
	multipleStatements: true,
	database: 'bamazon'
})

//CONNECT
connection.connect(err => {
	if (err) throw err;
		inquirer.prompt([
			{
				type: 'list',
				message: 'Choose User by ID:',
				choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Sales by Department', 'Customer Sales'],
				name: 'choice'
			}
		]).then(a => {
			switch(a.choice)
			{
				case 'View Products for Sale':
					show_products();
				break;
				case 'View Low Inventory':
					low_inventory_list();
				break;
				case 'Add to Inventory':
					add_to_inventory();
				break;
				case 'Add New Product':
					add_new_product();
				break;
				case 'Sales by Department':
					sales();
				break;
				case 'Customer Sales':
					customer_sales();
				break;
			}
			//connection.end();
		})
})

//CREATE DATA ARRAY FOR TABLE
function createArr(res){
	let a = [];
	let k = _.keys(res[0]);
	a.push(k)
	res.forEach(v => {a.push(_.values(v))});
	return a;
}


//SHOW PRODUCT LIST
function show_products(){
	let q = `SELECT d.department_name as 'DEPARTMENT', 
	  			 p.item_id as 'ID', 
	   			 p.product_name as 'NAME', 
	   			 concat('$', p.list_price) as 'PRICE',
	  		 	 p.stock_quantity as 'QTY'
			 FROM departments d, products p
			 WHERE d.department_id = p.department_id;`;
	
	return new Promise((resolve, reject)=>{
		connection.query(q, (err, res) => {
			if (err) throw err;
			let data = createArr(res);
			if (res.length == 0) console.log("No items to show");
			else{
				let config = {columns: {0: {alignment: 'left', width: 15, wrapWord: true},
							  1: {alignment: 'left', width: 3, wrapWord: true},
							  2: {alignment: 'left', width: 25, wrapWord: true},
							  3: {alignment: 'left', width: 10, wrapWord: true},
							  4: {alignment: 'left', width: 5, wrapWord: true}}};
				output = table.table(data, config);
				console.log(output);
				resolve();
			}
		})
	})	
}

//VIEW LOW INVENTORY
function low_inventory_list(){
	let q = `SELECT d.department_name as 'DEPARTMENT', 
	  			 p.item_id as 'ID', 
	   			 p.product_name as 'NAME', 
	   			 concat('$', p.list_price) as 'PRICE',
	  		 	 p.stock_quantity as 'QTY'
			 FROM departments d, products p
			 WHERE d.department_id = p.department_id AND p.stock_quantity <= 5;`;
	
	return new Promise((resolve, reject)=>{
		connection.query(q, (err, res) => {
			if (err) throw err;
			//console.log(res.length);
			if (res.length == 0) console.log("No low inventory");
			else{
				let data = createArr(res);
				let config = {columns: {0: {alignment: 'left', width: 15, wrapWord: true},
						  1: {alignment: 'left', width: 3, wrapWord: true},
						  2: {alignment: 'left', width: 25, wrapWord: true},
						  3: {alignment: 'left', width: 10, wrapWord: true},
						  4: {alignment: 'left', width: 5, wrapWord: true}}};
				output = table.table(data, config);
				console.log(output);
				resolve();
			}
		})
	})
}

//SHOW 1 ITEM by ID
function show_item(itemid){
	let q = `SELECT d.department_name as 'DEPARTMENT', 
	  			 p.item_id as 'ID', 
	   			 p.product_name as 'NAME', 
	   			 concat('$', p.list_price) as 'PRICE',
	  		 	 p.stock_quantity as 'QTY'
			 FROM departments d, products p
			 WHERE d.department_id = p.department_id AND p.item_id = ${itemid};`;
	
	return new Promise((resolve, reject)=>{
		connection.query(q, (err, res) => {
			if (err) throw err;
			let data = createArr(res);
			if (res.length == 0) console.log("No item to show");
			else{
				let config = {columns: {0: {alignment: 'left', width: 15, wrapWord: true},
							  1: {alignment: 'left', width: 3, wrapWord: true},
							  2: {alignment: 'left', width: 25, wrapWord: true},
							  3: {alignment: 'left', width: 10, wrapWord: true},
							  4: {alignment: 'left', width: 5, wrapWord: true}}};
				output = table.table(data, config);
				console.log(output);
				resolve();
			}
		})
	})
}

//ADD TO INVENTORY
function add_to_inventory(){
	show_products().then(() => {
		inquirer.prompt([
			{
				message: "Item ID: ",
				name: 'id'
			},
			{
				message: "Quantity to add: ",
				name: 'qty'
			}
		]).then(a => {
			let q = `UPDATE products SET stock_quantity = stock_quantity + ${a.qty} WHERE products.item_id = ${a.id};`
			connection.query(q, (err, res) => {
				if (err) throw err;
				show_item(a.id);
			})
		})
	})	
}

function add_new_product(){
	inquirer.prompt([
		{
			message: 'Name of New Product: ',
			name: 'name'
		},
		{
			message: 'Quantity in Stock: ',
			name: 'qty'
		},
		{
			message: 'Cost: ',
			name: 'cost'
		},
		{
			message: 'List Price: ',
			name: 'price'
		},
		{
			message: 'Department ID (1-5) (1-Electronics, 2-Clothing, 3-Books, 4-Home/Beauty, 5-Sports): ',
			name: 'dept_id'
		}
	]).then(a => {
		let q = `INSERT INTO products VALUES (NULL, ${a.dept_id}, "${a.name}", ${a.cost}, ${a.price}, ${a.qty});`
		connection.query(q, (err, res) => {
			if (err) throw err;
			console.log("Item Added to Inventory!");
		})
	})
}

//SALES BY DEPARTMENT
function sales(){
 let q = `SELECT d.department_name as DEPARTMENT, SUM(p.list_price * o.quantity) as 'TOTAL SALES', d.overhead_costs as 'OVERHEAD COSTS', (SUM(p.list_price * o.quantity) - d.overhead_costs) as 'PROFIT'
 			FROM orders o, products p, departments d 
 			WHERE p.department_id = d.department_id AND o.item_id = p.item_id
 			GROUP BY d.department_name;`
 	connection.query(q, (err, res) => {
			if (err) throw err;
			//console.log(res);
			let data = createArr(res);
			let config = {columns: {0: {alignment: 'left', width: 15, wrapWord: true},
							  1: {alignment: 'left', width: 10, wrapWord: true},
							  2: {alignment: 'left', width: 10, wrapWord: true},
							  3: {alignment: 'left', width: 10, wrapWord: true}
							  }};
			output = table.table(data, config);
			console.log(output);

	})
} 

function customer_sales(){
 let q = `SELECT  c.customer_id as 'ID', concat(c.first_name, ' ', c.last_name) as "CUSTOMER NAME", SUM(p.list_price * o.quantity) as 'TOTAL SALES'
 			FROM orders o, products p, customers c
 			WHERE o.item_id = p.item_id AND o.customer_id = c.customer_id
 			GROUP BY c.customer_id;`
 	connection.query(q, (err, res) => {
			if (err) throw err;
			//console.log(res);
			let data = createArr(res);
			let config = {columns: {0: {alignment: 'left', width: 4, wrapWord: true},
							  1: {alignment: 'left', width: 15, wrapWord: true},
							  2: {alignment: 'left', width: 10, wrapWord: true},
							  3: {alignment: 'left', width: 10, wrapWord: true}
							  }};
			output = table.table(data, config);
			console.log(output);

	})
}