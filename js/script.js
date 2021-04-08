//API access pattern
const apiPattern="https://cs615-proj.herokuapp.com/";

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

async function updateDeliveryDay(box) {
    const apiUrl = 'https://cs615-project.herokuapp.com/delivery/changeDeliveryStatus';
    let _data = {
        businessEmail: localStorage.getItem("businessEmail"),
        dayName: box.id,
        isDelivery: box.checked
    }
    const response = await fetch(apiUrl, {
            method: "PUT",
            body: JSON.stringify(_data),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        .catch(err => console.log(err));
    if (response.ok) {
        let elements = document.getElementsByClassName(box.id);
        for (i = 0; i < elements.length; i++) {
            if (box.checked) {
                elements[i].disabled = false;
            } else {
                elements[i].disabled = true;
            }
        }
    }
}

async function updateReserveStatus(elem, dayName) {
    const apiUrl = 'https://cs615-project.herokuapp.com/delivery/setDeliveryReservedStatus';
    let _data = {
        businessEmail: localStorage.getItem("businessEmail"),
        dayName: dayName,
        id: elem.id,
        isReserved: elem.checked
    }
    const response = await fetch(apiUrl, {
            method: "PUT",
            body: JSON.stringify(_data),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        .catch(err => console.log(err));
    if (response.ok) {
        console.log("Slot reserved!!!");
    }
}

/* <label class="switch" style="float:right">
    <input type="checkbox" ${element.isDelivery?"checked":""}>
    <span class="slider round"></span>
</label> */
async function fetchBusinessDelivery() {
    const apiUrl = 'https://cs615-project.herokuapp.com/business/getBusinessDayAndTime';
    let _data = {
        businessEmail: localStorage.getItem("businessEmail"),
    }

    const response = await fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify(_data),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
        .catch(err => console.log(err));

    if (response.status == 200) { //success
        const responseData = await response.json();
        responseData.forEach(element => {
            $('#accordion').append(`
            <div class="card" id="card${element.dayName}">
            <div class="card-header" id="heading${element.dayName}">
            <div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="col-xs-11 col-sm-11 col-md-11 col-lg-11" style="float:left; display:inline" data-target="#collapse${element.dayName}" aria-expanded="true" data-toggle="collapse" aria-controls="collapse${element.dayName}"><h4>
            ${element.dayName.capitalize()}</h4></div>
            <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1" style="float:right; display:inline"><div class="form-check form-switch form-switch-md">
            <input type="checkbox" class="form-check-input" id="${element.dayName}" ${element.isDelivery?"checked":""} onclick="updateDeliveryDay(this)">
        </div></div>
            </div>
            </div>
            </div>
            <div id="collapse${element.dayName}" class="collapse hide" aria-labelledby="heading${element.dayName}" data-parent="#accordion">
                <div class="card-body" id="cardBody${element.dayName}"></div>
            </div>
            </div>
            `);
            element.datTime.forEach(subElement => {
                $(`#cardBody${element.dayName}`).append(`<div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="col-xs-11 col-sm-11 col-md-11 col-lg-11" style="float:left; display:inline"><h4>
            ${subElement.startTime}-${subElement.endTime}</h4></div>
            <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1" style="float:right; display:inline"><div class="form-check form-switch form-switch-md">
            <input type="checkbox" class="form-check-input ${element.dayName}" id="${subElement.id}" ${element.isDelivery?"enabled":"disabled"} ${subElement.isReserved?"checked":""} onclick="updateReserveStatus(this, '${element.dayName}')">
        </div></div>
            </div>
            <hr>`);
            });
        });
    }
}

async function fetchBusinessWithLocation() {
  var draftButtonId=0;
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
          draftButtonId++;
          $('#displayShopID').append(`<div id=${element._id} class="menu-hold">
          <div class="menu-container">
              <h1 class="menu-title">${element.businessName}</h1>
              <p class="menu-p">${element.businessAddress}</p>
              <p class="menu-p">Contact: ${element.businessPhone}</p>
              <p class="menu-p"><a href=${element.businessURL} target="_blank">${element.businessURL}</a></p>
              <button style="margin-left: 100px; type="button" class="btn btn-info btn-lg " 
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

async function saveDraft(itemId,buttonId) {

  var itemPrice = document.getElementById(buttonId).value;
  var remPriceSymbol = itemPrice.replace(/€/, ''); 
  const apiUrl = 'https://cs615-project.herokuapp.com/menuItems/updateItemPrice';
  let _data = {
    businessEmail: localStorage.getItem("businessEmail"),
    id: itemId,
    itemPrice: remPriceSymbol,
  }

  const response = await fetch(apiUrl, {
    method: "PUT",
    body: JSON.stringify(_data),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  })
  .catch(err => console.log(err));

  if(response.status==200){
    const options = {
      style: {
        main: {
          background: "#e55039",
          color: "#fff",
      },
  },
};
    iqwerty.toast.toast('Item price drafted successfully!',options);
  }
}

async function publishDraft(itemId) {
  const apiUrl = 'https://cs615-project.herokuapp.com/menuItems/setToPublished';
  let _data = {
    businessEmail: localStorage.getItem("businessEmail"),
    id: itemId,
  }

  const response = await fetch(apiUrl, {
    method: "PUT",
    body: JSON.stringify(_data),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  })
  .catch(err => console.log(err));

  if(response.status==200){
    const options = {
      style: {
        main: {
          background: "#218c74",
          color: "#fff",
      },
  },
};
    iqwerty.toast.toast('Item price published successfully!',options);
  }

}

function popUptrigger(){
  document.getElementById("addMenuItemForm").style.display = "block";
 // document.getElementById("addItemPopUpId").style.display="block";
}

function closeForm() {
  document.getElementById("addMenuItemForm").style.display = "none";
}


async function addNewMenuItem() {
event.preventDefault();
  const apiUrl = 'https://cs615-project.herokuapp.com/menuItems/addItem';
  let _data = {
    itemName: document.getElementById("itemNameId").value,
    itemDescription: document.getElementById("itemDescriptionId").value, 
    itemPrice: document.getElementById("itemPriceId").value, 
    itemImage: document.getElementById("itemImageId").value, 
    businessEmail: localStorage.getItem("businessEmail"), 
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(_data),
    headers: {"Content-type": "application/json; charset=UTF-8"}
  })
  .catch(err => console.log(err));

  if(response.status==200){
    const options = {
      style: {
        main: {
          background: "#218c74",
          color: "#fff",
      },
  },
};
    iqwerty.toast.toast('Item added Successfully!',options);
  }
}

async function fetchBusinessMenus() {
  var draftButtonId=0;
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
    responseData.menu.forEach(element => {
          draftButtonId++;
          
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