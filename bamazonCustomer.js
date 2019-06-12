var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
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
            name: "itemID",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            type: "input",
            message: "How many would you like to buy? ",
            name: "quantity",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
    ])
        .then(function (answer) {
            itemID = parseInt(answer.itemID);
            answerQuantity = parseInt(answer.quantity);
            connection.query("SELECT stock_quantity, item_id, price FROM products WHERE?", { item_id: itemID },
                function (err, res) {
                    if (err) throw err;
                    newQuantity = res[0].stock_quantity - answerQuantity;
                    preCost = res[0].price * answerQuantity;
                    cost = preCost.toFixed(2);
                    if (answerQuantity < res[0].stock_quantity) {
                        fulfill();
                        
                    } else {
                        console.log("\nSorry, insufficient quantity in stock!");
                        displayItems();
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
            console.log("\nTotal purchase cost: $" + (cost));
            console.log("\n");
            runAgain();
        });
}

function runAgain() {
    inquirer.prompt({
        name: "selection",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Purchase Again",
            "Exit"
        ]
    })
        .then(function (answer) {
            switch (answer.selection) {
                case "Purchase Again":
                    displayItems();
                    break;

                case "Exit":
                    connection.end();
            }
        });
}


