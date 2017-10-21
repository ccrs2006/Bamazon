let mysql = require("mysql");
let inquirer = require("inquirer");
let prompt = require("prompt");
let colors = require("colors");

let connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
});

connection.connect((err) => {
    if(err) throw err;
    // console.log("connected as id " + connection.threadId);
    queryAllProducts();
});

function queryAllProducts() {
    connection.query("SELECT * FROM products", (err, res) => {
        if(err) throw err;
        console.log("\n****************Welcome to your favorite store BAMAZON********************\n".bgCyan);
        console.log("==============================================".america);
        for(let i = 0; i < res.length; i++) {
        console.log(
            " | ItemId: " + res[i].id + 
            "  | Product: " + res[i].product + 
            "  | Deptartment: " + res[i].department + 
            "  | Price: $" + res[i].price +
            "  | Quantity: " + res[i].stock);
        }
        console.log("==============================================".america);
        setTimeout(mainScreen, 1500);
    });
}

function mainScreen(order) {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Please specify the item id for the product you would like to purchase: "
            // validate: (value) => !isNaN(value)
        },
        {
            type: "input",
            name: "quantity",
            message: "How many of these Items would you like to purchase? "
            // validate: (value) => !isNaN(value)
        }
    ]).then((order) => {
        let quantity = order.quantity;
        let itemId = order.id;

        connection.query("SELECT * FROM products WHERE id=" + itemId, (err, selectedItem) => {
            if(err) throw err;

            if(selectedItem[0].stock - quantity >= 0) {
                console.log("**********************************************************************");
                console.log("\n  GREAT NEWS Bamazon has your item in stock:".bgBlue + " " + selectedItem[0].product);
                // console.log("\n  Items left in stock: ".bgBlue + (selectedItem[0].stock - quantity));
                console.log("\n  Order quantity:".bgBlue + " " + quantity);
                console.log("\n  Total amount due:".bgBlue + " $" + order.quantity * selectedItem[0].price + " USD.");
                console.log("\n**********************************************************************");

                connection.query("UPDATE products SET stock=? WHERE id=?", [selectedItem[0].stock - quantity, itemId],
                (err, inventory) => {
                    if(err) throw err;
                    inquirer.prompt([
                        {
                            type: "list",
                            name: "whatNext",
                            choices: ["1- Order another item.", "2- Exit Bamazon."],
                            message: "\nWhat would you like to do next?\n"
                        }
                    ]).then((answer) => {
                        if(answer.whatNext === "1- Order another item.") {
                            queryAllProducts();
                        } else if (answer.whatNext === "2- Exit Bamazon.") {
                            exit();
                        } else {
                            console.log("Sorry something went wrong.")
                        }
                    });
                });
            } else {
                console.log("Sorry we are running out of this product, please order less. As of now we have: ".bgRed + selectedItem[0].stock + " ".bgRed + selectedItem[0].product.bgRed + " in stock.".bgRed);
                queryAllProducts();
            }
        })
    })
}

//This will exit the bamazon app----------------------------------------------------
function exit() {
   console.log("\nThank you for shopping at Bamazon!");
    console.log(".")
    console.log("..")
    console.log("...")
    console.log("....")
    console.log(".....Exiting Bamazon now....")
    connection.end();
}
