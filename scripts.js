// scripts.js
let miniCartToggle = false;
let selected = false;

let global_data = {}
let minicartItems = []
let temp_size = ""

// resets the element back to it's default
document.getElementById("size-selection-boxes").innerHTML = "";
document.getElementById("miniCartDisplay").innerHTML = "";

const miniCart = document.getElementById('miniCart');
const cartItems = document.getElementById('cartItems');
const cartBtn = document.getElementById('cartBtn');
get_clothes_info();

function showMiniCart(){
    document.getElementById("miniCartDisplay").style.display = "Block";
}

function hideMiniCart(){
    document.getElementById("miniCartDisplay").style.display = "None";
}

const cartClicked = () => {
    if (!miniCartToggle){
        document.getElementById("cart").style.backgroundColor = "white";
        document.getElementById("cart").style.border = "#222222";
        document.getElementById("cart").style.borderStyle = "solid";
        document.getElementById("cart").style.borderBottom = "None";
        document.getElementById("cart").style.borderWidth = "1px";
        miniCartToggle = true; // allows the cart to be hidden when clicked next
        showMiniCart();
    } else {
        document.getElementById("cart").style.backgroundColor = null;
        document.getElementById("cart").style.removeProperty("border");
        miniCartToggle = false; // allows the cart to be opened when clicked next
        hideMiniCart();
    }
}


function get_clothes_info(){
    const fetchPromise = fetch(`https://3sb655pz3a.execute-api.ap-southeast-2.amazonaws.com/live/product`);
    const streamPromise = fetchPromise.then( (response) => response.json() );
    streamPromise.then( (data) => displayInfo(data));
}

const display_selection_boxes = (size_options) => {
    for (i in size_options){
        document.getElementById("size-selection-boxes").innerHTML += 
        `<span class="selectionBox" onclick="selectBox('${size_options[i]["id"]}', '${size_options[i]["label"]}')" id="box-${size_options[i]["id"]}">${size_options[i]["label"]}</span>`;
    }
}

const displayInfo = (data) => {
    document.getElementById("image").src = data["imageURL"];
    document.getElementById("title").innerText = data["title"];
    document.getElementById("price").innerText = `$${data["price"]}.00`;
    document.getElementById("desc").innerText = data["description"];
    global_data = data;
    display_selection_boxes(data["sizeOptions"]);
}

const selectBox = (id, size) => {
    let document_element = document.getElementById(`box-${id}`);
    if (selected){
        if (document_element.style.borderColor != ""){
            document_element.style.borderColor = "";
            document_element.style.color = "";
            selected = false; // sets selected to false, stops multiple size selections
            temp_size = ""
        } else{
            alert("Only 1 size can be selected at a time");
        }
        
    } else{
        // checks if the box has already been selected
        if (document_element.style.borderColor == ""){
            document_element.style.borderColor = "#222222";
            document_element.style.color = "#222222";
            temp_size = size;
            selected = true; // sets selected to true, stops multiple size selections
        }
        else{
            document_element.style.borderColor = "";
            document_element.style.color = "";
            temp_size = ""
            selected = false; // sets selected to false, stops multiple size selections
        }
    }
}

function updateMiniCart(){
    for(i in minicartItems){
        let data = minicartItems[i]["details"];
        document.getElementById("miniCartDisplay").innerHTML += 
            `<div class="col span_1_of_2">` +
                `<div>` +
                    `<img src=${data["image"]} width="75%">` +
                `</div>` +
            `</div>` +
            `<div class="col span_1_of_2">` +
                `<div>` +
                    `<p>${data["title"]}</p>` +
                    `<p>${data["amount"]}x $${data["price"]}.00</p>` +
                    `<p>Size: ${data["size"]}</p>` +
                `</div>` +
            `</div>`;
    }
}

function addToCart(){
    let item_exists = false;
    if (temp_size == ""){
        alert("You must select a size!")
    } else{
        minicartItems.forEach( (e) => 
            {
                if (e["item"] ==  `${global_data["id"]}, ${temp_size}`){
                    e["details"]["amount"]++;
                    item_exists = true;
                }
            }
        );
        if (!item_exists) {
            let temp_array = {
                "item": `${global_data["id"]}, ${temp_size}`, "details":
                {
                    "id": global_data["id"],
                    "title": global_data["title"],
                    "image": global_data["imageURL"],
                    "price": global_data["price"],
                    "amount": 1,
                    "size": temp_size
                }
            }
            minicartItems.push(temp_array);
        }
        // empties minicart before updating it
        document.getElementById("miniCartDisplay").innerHTML = "";
        updateMiniCart();
    }
}