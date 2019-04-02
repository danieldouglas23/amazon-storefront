var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    displayItems();
});

function displayItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\nBamazon Marketplace");
        console.log("-------------------------------------\n")
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name +
                " || Price: " + res[i].price);
        }
        console.log("\n");
        promptUser();
    });
}

var itemID;
var answerQuantity;
var newQuantity;
var cost;

function promptUser() {
    inquirer.prompt([
        {
            type: "input",
            message: "Please select the ID of the desired item: ",
            name: "itemID"
        },
        {
            type: "input",
            message: "How many would you like to buy? ",
            name: "quantity"
        },
    ])
        .then(function (answer) {
            itemID = parseInt(answer.itemID);
            answerQuantity = parseInt(answer.quantity);
            connection.query("SELECT stock_quantity, item_id, price FROM products WHERE?", { item_id: itemID },
                function (err, res) {
                    if (err) throw err;
                    newQuantity = res[0].stock_quantity - answerQuantity;
                    cost = res[0].price * answerQuantity;
                    if (answerQuantity < res[0].stock_quantity) {
                        fulfill();
                        displayItems();
                    } else {
                        console.log("\nSorry, insufficient quantity in stock!");
                    }
                });
        });
}

function fulfill() {
    connection.query("UPDATE products SET? WHERE?",
        [
            {
                stock_quantity: newQuantity
            },
            {
                item_id: itemID
            }
        ], function (err, res) {
            if (err) throw err;
            console.log("Total cost: $" + (cost));
        });
}