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
	multipleStatements: true
	//database: 'bamazon'
})

//CONNECT
connection.connect(err => {
	if (err) throw err;
		createDB().then(() => {
		//useDB().then(() => {
			show_customers().then(() => {
				inquirer.prompt([
					{
						message: 'Choose User by ID:',
						name: 'id'
					}
				]).then(a => {
					show_products().then(() => {
						inquirer.prompt([
							{
								message: 'Choose Item by ID:',
								name: 'id'
							},
							{
								message: 'How many?',
								name: 'qty'
							}
						]).then(b => {
							let uid = parseInt(b.id);
							let qty = parseInt(b.qty);
							updateProduct(uid, qty, a.id);
						})
					})
				})
			});
		});
})

//CREATE DATABASE
function createDB(){
	return new Promise((resolve, reject) => {
		connection.query(init, (err, res) => {if (err) throw err; resolve()})
	})
}

//USE DATABASE
function useDB(){
	return new Promise((resolve, reject)=>{
		connection.query('USE bamazon;', (err, res)=>{if(err) throw err});
	})
}

//UPDATE PRODUCT
function updateProduct(id, qty, cid){
	let q = `SELECT product_name, stock_quantity FROM Products WHERE item_id = ${id};`
	connection.query(q, (err, res) => {
		if(err) throw err;
		if (res[0].stock_quantity >= qty)
		{
			let q2 = `UPDATE Products SET stock_quantity = stock_quantity - ${qty} WHERE products.item_id = ${id};`
			connection.query(q2, (err2, res2) => {
				if (err2) throw err2;
				//GET ITEM INF
				let q3 = `SELECT d.department_name as 'DEPARTMENT', 
				  			 p.item_id as 'ID', 
				   			 p.product_name as 'NAME', 
				   			 concat('$', p.list_price) as 'PRICE',
				  		 	 p.stock_quantity as 'QTY'
						 FROM departments d, products p
						 WHERE d.department_id = p.department_id AND p.item_id = ${id};`
			 	connection.query(q3, (err3, res3) => {
			 		//console.log(res3);
			 		//console.log()
					let price = parseFloat(res3[0]['PRICE'].substr(1));
					console.log("TOTAL COST: " + price + " * " + qty + " = $"+ price*qty)
			 		//RECORD ORDER
					let q4 = `INSERT INTO orders VALUES (NULL, ${cid}, ${id}, ${qty});`
					connection.query(q4, (err4, res4) => {if (err4) throw err4;});
					connection.end();
			 	})
			})
		}
		else
		{
			console.log("WE DON'T HAVE ENOUGH OF "+res[0].product_name+"! PLEASE TRY AGAIN")
			connection.end();
		}

	})
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
			let config = {columns: {0: {alignment: 'left', width: 15, wrapWord: true},
						  1: {alignment: 'left', width: 3, wrapWord: true},
						  2: {alignment: 'left', width: 25, wrapWord: true},
						  3: {alignment: 'left', width: 10, wrapWord: true},
						  4: {alignment: 'left', width: 5, wrapWord: true}}};
			output = table.table(data, config);
			console.log(output);
			resolve();
		})
	})
		
}

//SHOW CUSTOMERS
function show_customers(){
	let q = `SELECT customer_id as 'ID', concat(first_name,' ', last_name) as 'Customer' FROM Customers;`;
	return new Promise((resolve, reject)=>{
		connection.query(q, (err, res) => {
			if (err) throw err;
			let data = createArr(res);
			let config = {columns: {0: {alignment: 'left', width: 3, wrapWord: true},
						  1: {alignment: 'left', width: 15, wrapWord: true}}};
			output = table.table(data, config);
			console.log(output);
			resolve();
		})
	})
		
}

//CREATE DATA ARRAY FOR TABLE
function createArr(res){
	let a = [];
	let k = _.keys(res[0]);
	a.push(k)
	res.forEach(v => {a.push(_.values(v))});
	return a;
}

