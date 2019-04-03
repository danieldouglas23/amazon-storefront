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
    mainMenu();
});

function mainMenu() {
    console.log("\n");
    inquirer.prompt({
        name: "selection",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Display Products For Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "Exit"
        ]
    })
        .then(function (answer) {
            switch (answer.selection) {
                case "Display Products For Sale":
                    displayItems();
                    break;

                case "View Low Inventory":
                    viewLow();
                    break;

                case "Add to Inventory":
                    addInventory();
                    break;

                case "Add New Product":
                    addProduct();
                    break;

                case "Exit":
                    connection.end();
            }
        });
}

function displayItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\nBamazon Marketplace");
        console.log("-------------------------------------\n")
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name +
                " || Price: " + res[i].price.toFixed(2) + " || Quantity: " + res[i].stock_quantity);
        }
        console.log("\n");
        mainMenu();
    });
}

function viewLow() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\nLow Inventory Items");
        console.log("-------------------------------------\n")
        for (var i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name +
                    " || Quantity: " + res[i].stock_quantity);
            }
        }
        console.log("\n");
        mainMenu();
    });
}

function addInventory() {
    console.log("\n");
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("Bamazon Marketplace");
        console.log("-------------------------------------\n")
        for (var i = 0; i < res.length; i++) {
            console.log("Item ID: " + res[i].item_id + " || Product Name: " + res[i].product_name +
                " || Price: " + res[i].price + " || Quantity: " + res[i].stock_quantity);
        }
    });

    setTimeout(function () {
        console.log("\n");
        inquirer.prompt([
            {
                type: "input",
                message: "Please select the ID to add to that item's inventory: ",
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
                message: "How many would you like to add? ",
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
                var itemID = parseInt(answer.itemID);
                var answerQuantity = parseInt(answer.quantity);
                var newQuantity;
                connection.query("SELECT stock_quantity, item_id FROM products WHERE?", { item_id: itemID },
                    function (err, res) {
                        if (err) throw err;
                        newQuantity = parseInt(res[0].stock_quantity) + answerQuantity;
                        connection.query("UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: newQuantity
                                },
                                {
                                    item_id: itemID
                                }
                            ], function (err, res) {
                                if (err) throw err;
                                console.log("\n");
                                console.log(`Increased quantity by ${answerQuantity} - new inventory is ${newQuantity}.\n`);
                                mainMenu();
                            });
                    });

            });
    }, 200);
}

function addProduct() {
    console.log("\n");
    inquirer.prompt([
        {
            type: "input",
            message: "What is your new product? ",
            name: "newproduct"
        },
        {
            type: "input",
            message: "What is its department classification? ",
            name: "department"
        },
        {
            type: "input",
            message: "Unit price: ",
            name: "price",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        },
        {
            type: "input",
            message: "How many would you like to add? ",
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
            connection.query("INSERT INTO products SET?",
                {
                    product_name: answer.newproduct,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantity
                }, function (err, res) {
                    if (err) throw err;
                    mainMenu();
                });
        });

}
