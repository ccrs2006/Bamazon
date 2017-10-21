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

connection.connect(function(err){
    if(err) throw err;
    // console.log("connected as id: " + connection.threadId);
    console.log("____Welcome Bamazon manage.____");
    setTimeout(allOptions, 1000);
});

function queryAllProducts(){
    connection.query("SELECT * FROM products", function(err, res) {
        if(err) throw err;
        console.log("\n*************** BAMAZON inverntory ********************\n".bgCyan);
        console.log("==========================================================================================".america);
        for(var i = 0; i < res.length; i++) {
            console.log(
                " | ItemId: " + res[i].id + 
                "  | Product: " + res[i].product + 
                "  | Deptartment: " + res[i].department + 
                "  | Price: $" + res[i].price +
                "  | Quantity: " + res[i].stock);
        }
        console.log("==========================================================================================".america);       
    });
};

function allOptions(){
inquirer.prompt([
    {
        type: "list",
        name: "selection",
        message: "\nWhat would you like to do?\n",
        choices:["1- View products.", "2- View low inventory.", "3- Add to current inventory.", "4- Add new product.", "5- Exit."]
    }
]).then(function(user){
    switch(user.selection){
        case "1- View products.":
        queryAllProducts();
        setTimeout(allOptions, 1000);
        break;

        case "2- View low inventory.":
        connection.query("SELECT * FROM products WHERE stock < 10", function(err, res) {
            if(err) throw err;
            console.log("This items are running low. If you don't see none posting that means you have enough of everything.".bgYellow);
            for(var i = 0; i < res.length; i++) {
                console.log(
                    " | ItemId: " + res[i].id + 
                    "  | Product: " + res[i].product + 
                    "  | Deptartment: " + res[i].department + 
                    "  | Price: $" + res[i].price +
                    "  | Quantity: " + res[i].stock);
            }
            setTimeout(allOptions, 1000);
        });
        break;

        case "3- Add to current inventory.":
        inquirer.prompt([
            {
                type: "input",
                name: "itemId",
                message: "Select the id of the product you would like to add."  
            },
            {
                type: "input",
                name: "amount",
                message: "How many items would you like to add?"
            }
        ]).then(function(request){
            connection.query("SELECT * FROM products WHERE id=" + request.itemId, function(err, selectedItem) {
                if(err) throw err;
                console.log(request.amount  + " " + selectedItem[0].product + "s" + " have been sucessfully added to the inventory");

                connection.query("UPDATE products SET stock=? WHERE id=?", [selectedItem[0].stock + Number(request.amount), request.itemId],
                function(err, res){
                    if(err) throw err;
                    queryAllProducts();
                    setTimeout(allOptions, 1000);
                });
            });
        });
        break;

        case "4- Add new product.":
            inquirer.prompt([
                {
                    type: "input",
                    name: "productName",
                    message: "Name the product you would like to add."
                },
                {
                    type: "input",
                    name: "departmentName",
                    message: "What item does this item belong to?"
                },
                {
                    type: "input",
                    name: "price",
                    message: "What price for this item?"
                },
                {
                    type: "input",
                    name: "stock",
                    message: "How many would you like to add?"
                }
            ]).then(function(newItem){
                connection.query("INSERT INTO products (product, department, price, stock) VALUES(?,?,?,?)", [newItem.product, newItem.department, newItem.price, newItem.stock],
                function(err, res){
                    if(err) throw err;
                    console.log(newItem.product + " have been added to the inventory.");
                    queryAllProducts();
                    setTimeout(allOptions, 1000);
                });
            });
            break;

            case "5- Exit.":
            exit();
            break;

    }
});
};

//This will exit the bamazon app----------------------------------------------------
function exit() {
    console.log("\nThanks for working at Bamazon!");
     console.log(".")
     console.log("..")
     console.log("...")
     console.log("....")
     console.log(".....Exiting Bamazon manager now....")
     connection.end();
 }