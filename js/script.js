//API access pattern
const apiPattern="https://cs615-proj.herokuapp.com/";

//Customer Sign-in
async function customerSignIn() {
    const apiPath = 'customer/login';
    let postData = {
        email: document.getElementById("userEmailId").value,
        password: document.getElementById("userEmailPass").value,
    }
   
    const response = await fetch(apiPattern + apiPath, {
            method: "POST",
            body: JSON.stringify(postData),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        .catch(err => console.log(err));

    if (response.status == 200) { 
        const responseData = await response.json();
        localStorage.setItem("customerName", responseData.user.name);
        localStorage.setItem("location", responseData.user.location);
        window.location = 'dashboard.html';
    } else {
        document.getElementById("signInErr").style.display = "block";
    }
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


async function fetchBusinessWithLocation() {
  const apiUrl = 'restaurant/getNearBy';
  let postData = {
    location: localStorage.getItem("location"),
  }

  const response = await fetch(apiPattern + apiUrl, {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  })
  .catch(err => console.log(err));

  if(response.status==200){ //success
    const responseData = await response.json();
    responseData.forEach(element => {
          $('#displayShopID').append(`<div id=${element._id} class="menu-hold">
          <div class="menu-container text-left">
              <h1 class="text-right menu-title">${element.businessName}</h1>
              <p class="menu-p ">${element.businessAddress}</p>
              <p class="menu-p">Contact: ${element.businessPhone}</p>
              <p class="menu-p"><a href=${element.businessURL} target="_blank">${element.businessURL}</a></p>
              <button style="margin-left: 100px;" type="button" class="btn btn-info btn-lg " 
              onclick="saveBusinessInLocal('${element.businessEmail}');">VIEW MENU</button>
          </div>
      </div>`);
  });
  document.getElementById("custNameId").innerHTML = "Welcome, " +localStorage.getItem("customerName");

}
}

//customer sign-up
async function customerSignUp() {
  event.preventDefault();
  const apiPath = 'customer/register';
  //sending all the data to the server
  let postData = {
    name: document.getElementById("signupUsername").value,
    mobileNumber: document.getElementById("customerMobile").value, 
    email: document.getElementById("customerMail").value, 
    address: document.getElementById("customerAddress").value, 
    location: document.getElementById("customerLoc").value, 
    password: document.getElementById("customerPass").value, 
  }
  
  let response = await fetch(apiPattern + apiPath, {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  })
  .catch(err => console.log(err));
  
  if(response.status==200){ //if the response is succeeded
    document.getElementById("signUpInfo").style.display="block";
    document.getElementById("signInErr").style.display = "none";
    document.querySelector("#login").classList.remove("form--hidden");
    document.querySelector("#createAccount").classList.add("form--hidden");
  }
}

function logOut(){
  window.addEventListener("load", function(){
    const options = {
      style: {
        main: {
          background: "#218c74",
          color: "#fff",
      },
  },
};
    iqwerty.toast.toast('Logged Out Successfully!',options);
});

}

async function fetchBusinessMenus() {
  const apiPath = 'https://cs615-project.herokuapp.com/menuItems/generateMenu ';
  let postData = {
    businessEmail: localStorage.getItem("tempBusinessEmail"),
  }

  const response = await fetch(apiPath, {
    method: "POST",
    body: JSON.stringify(postData),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  })
  .catch(err => console.log(err));

  if(response.ok){ //success
    const responseData = await response.json();
    localStorage.setItem("menuObject",JSON.stringify(responseData.menu))
    responseData.menu.forEach(element => {
          
          $('#displayMenuId').append(`<div id=${element._id} class="menu-hold">
          <div class="menu-container-food">
              <div style="background-image:url(${element.itemImage})" class="menu-img">
                  &nbsp;
              </div>
              <h1 class="menu-title ">${element.itemName}</h1>
              <p class="menu-p">${element.itemDescription}</p>
              <p class="price menu-p">€ ${element.itemPrice}</p>
              <button style="margin-left: 100px; " type="button" class="btn btn-warning btn-lg "
              onclick="addCartItems('${element.itemName}', '${element.itemPrice}');" );">Add to Cart</button>
          </div>
      </div>`);
  });
  document.getElementById("custNameId").innerHTML = "Welcome, " +localStorage.getItem("customerName");
}
}

function saveBusinessInLocal(businessMail){
  window.location="menus.html";
  localStorage.setItem("tempBusinessEmail", businessMail);
  

}

var cartItems = [];
var total=0;

function addCartItems(itemName,itemPrice) {
  const options = {
    style: {
      main: {
        background: "green",
        color: "#fff",
    },
},
};
  iqwerty.toast.toast('Item Added to cart!',options);
  var itemQuantity = 1;
  var item = {itemName: itemName, itemPrice: itemPrice, quantity: itemQuantity};  
  cartItems.push(item);
  localStorage.setItem("itemsList", JSON.stringify(cartItems));
  var displayItems = JSON.parse(localStorage.getItem('itemsList'));
  var i;
  
  for (i = 0; i < cartItems.length; i++) {
  total= total+parseFloat(cartItems[i].itemPrice);
  }
  displayItems.forEach(element => {
    $('#addItems tr:last').after(`<tr><td>${element.itemName}</td><td>€ ${element.itemPrice}</td><td>${element.quantity}</td></tr>`);
});
document.getElementById("totalPrice").innerHTML=`Total: € ${total.toFixed(2)}`;
cartItems=[];

}

function sortByProperty(property){  
  return function(a,b){  
     if(a[property] > b[property])  
        return 1;  
     else if(a[property] < b[property])  
        return -1;  
 
     return 0;  
  }  
}

function sortJSON_objects() {
  document.getElementById("displayMenuId").innerHTML="";
  var displayItems = JSON.parse(localStorage.getItem('menuObject'));
  var sortedArray = displayItems.sort(sortByProperty("itemPrice")); //sort according to item price 
  sortedArray.forEach(element => {
    $('#displayMenuId').append(`<div id=${element._id} class="menu-hold">
    <div class="menu-container-food">
        <div style="background-image:url(${element.itemImage})" class="menu-img">
            &nbsp;
        </div>
        <h1 class="menu-title">${element.itemName}</h1>
        <p class="menu-p">${element.itemDescription}</p>
        <p class="price menu-p">€ ${element.itemPrice}</p>
        <button style="margin-left: 100px; " type="button" class="btn btn-warning btn-lg lightGreen"
        onclick="addCartItems('${element.itemName}', '${element.itemPrice}');" );">Add to Cart</button>
    </div>
</div>`);
});
toastr.success('Sorted items based on price')
}

function setFormMessage(formElement, type, message) {
  const messageElement = formElement.querySelector(".form__message");

  messageElement.textContent = message;
  messageElement.classList.remove("form__message--success", "form__message--error");
  messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
  inputElement.classList.add("form__input--error");
  inputElement.parentElement.querySelector(".form__input-error-message").textContent = message;
}

function clearInputError(inputElement) {
  inputElement.classList.remove("form__input--error");
  inputElement.parentElement.querySelector(".form__input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login");
  const createAccountForm = document.querySelector("#createAccount");
  var linkCreateAccount = document.getElementById("linkCreateAccount");
  if (linkCreateAccount) {
      document.querySelector("#linkCreateAccount").addEventListener("click", e => {
          e.preventDefault();
          loginForm.classList.add("form--hidden");
          createAccountForm.classList.remove("form--hidden");
      });
  }
  var linkLogin = document.getElementById("linkLogin");
  if (linkLogin) {
      document.querySelector("#linkLogin").addEventListener("click", e => {
          e.preventDefault();
          loginForm.classList.remove("form--hidden");
          createAccountForm.classList.add("form--hidden");
      });
  }
  if (loginForm != undefined) {
      loginForm.addEventListener("submit", e => {
          e.preventDefault();
          // Perform your AJAX/Fetch login
          //setFormMessage(loginForm, "error", "Invalid username/password combination");
      });
  }

  document.querySelectorAll(".form__input").forEach(inputElement => {
      inputElement.addEventListener("blur", e => {
          if (e.target.id === "signupUsername" && e.target.value.length > 0 && e.target.value.length < 10) {
              setInputError(inputElement, "Username must be at least 10 characters in length");
          }
      });

      inputElement.addEventListener("input", e => {
          clearInputError(inputElement);
      });
  });
});
