//API access pattern
const apiPattern = "https://cs615-proj.herokuapp.com/";

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
//Customer Sign-in
async function customerSignIn() {
  const apiPath = "customer/login";
  let postData = {
    email: document.getElementById("userEmailId").value,
    password: document.getElementById("userEmailPass").value,
  };

  const response = await fetch(apiPattern + apiPath, {
    method: "POST",
    body: JSON.stringify(postData),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).catch((err) => console.log(err));

  if (response.status == 200) {
    const responseData = await response.json();
    localStorage.setItem("customerName", responseData.user.name);
    localStorage.setItem("location", responseData.user.location);
    window.location = "welcomePage.html";
  } else {
    document.getElementById("signInErr").style.display = "block";
  }
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

async function fetchBusinessWithLocation() {
  document.getElementById("mainHeading").innerHTML =
    "Welcome to " + localStorage.getItem("location").capitalize();
  const apiUrl = "restaurant/getNearBy";
  let postData = {
    location: localStorage.getItem("location"),
  };

  const response = await fetch(apiPattern + apiUrl, {
    method: "POST",
    body: JSON.stringify(postData),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).catch((err) => console.log(err));

  /* <div class="card-header"></div> */
  if (response.status == 200) {
    //success
    const responseData = await response.json();
    responseData.forEach((element) => {
      $("#displayShopID").append(`<div id=${
        element._id
      } class="card menu-container">
            <div class="card-header">
            <h1>${element.businessName}</h1></div>
          <div class="card-body">
          <div class="vertical-center">
            <h3 class="card-text">${element.businessAddress}</h3>
            <h4 class="card-text">Contact: ${element.businessPhone}</h4>
            <h5 class="card-text"><a href="https://${
              element.businessURL
            }/" target="_blank">${element.businessURL}</a></h5>
            </div>
            <div class="card-footer text-center">
                <a href="#" class="btn btn-primary" onclick="saveBusinessInLocal('${
                  element.businessEmail
                }', '${element.businessName.replace(
        /'/g,
        "\\'"
      )}');">VIEW MENU</a>
            </div>
          </div>
        </div>`);
      /* <div class="card" style="width: 18rem;">
              <div class="card-body">
                <h5 class="card-title">Card title</h5>
                <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                <p class="menu-p card-text">${element.businessAddress}</p>
                <p class="menu-p card-text">Contact: ${element.businessPhone}</p>
                <p class="menu-p card-text"><a href=${element.businessURL} target="_blank">${element.businessURL}</a></p>
                <a href="#" class="btn btn-primary">Go somewhere</a>
              </div>
            </div> */

      /*  $('#displayShopID').append(`<div id=${element._id}>
          <div class="menu-container text-left">
              <h1 class="text-right menu-title">${element.businessName}</h1>
              <p class="menu-p ">${element.businessAddress}</p>
              <p class="menu-p">Contact: ${element.businessPhone}</p>
              <p class="menu-p"><a href="https://${element.businessURL}/" target="_blank">${element.businessURL}</a></p>
              <button style="margin-left: 100px;" type="button" class="btn btn-info btn-lg " 
              onclick="saveBusinessInLocal('${element.businessEmail}', '${element.businessName.replace(/'/g, "\\'")}');">VIEW MENU</button>
              
          </div>
      </div>`); */
    });
    document.getElementById("custNameId").innerHTML =
      "Hi, " + localStorage.getItem("customerName");
  }
}

//customer sign-up
async function customerSignUp() {
  event.preventDefault();
  const apiPath = "customer/register";
  //sending all the data to the server
  let postData = {
    name: document.getElementById("signupUsername").value,
    mobileNumber: document.getElementById("customerMobile").value,
    email: document.getElementById("customerMail").value,
    address: document.getElementById("customerAddress").value,
    location: document.getElementById("customerLoc").value,
    password: document.getElementById("customerPass").value,
  };

  let response = await fetch(apiPattern + apiPath, {
    method: "POST",
    body: JSON.stringify(postData),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).catch((err) => console.log(err));

  if (response.status == 200) {
    //if the response is succeeded
    document.getElementById("signUpInfo").style.display = "block";
    document.getElementById("signInErr").style.display = "none";
    document.querySelector("#login").classList.remove("form--hidden");
    document.querySelector("#createAccount").classList.add("form--hidden");
  }
}

function logOut() {
  window.addEventListener("load", function () {
    const options = {
      style: {
        main: {
          background: "#218c74",
          color: "#fff",
        },
      },
    };
    iqwerty.toast.toast("Logged Out Successfully!", options);
  });
}

async function fetchBusinessMenus() {
  document.getElementById("restaurant").innerHTML = decodeURI(
    localStorage.getItem("tempBusinessName")
  );
  const apiPath = "https://cs615-project.herokuapp.com/menuItems/generateMenu ";
  let postData = {
    businessEmail: localStorage.getItem("tempBusinessEmail"),
  };

  const response = await fetch(apiPath, {
    method: "POST",
    body: JSON.stringify(postData),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).catch((err) => console.log(err));

  if (response.ok) {
    //success
    const responseData = await response.json();
    localStorage.setItem("menuObject", JSON.stringify(responseData.menu));
    responseData.menu.forEach((element) => {
      $("#displayMenuId").append(`<div id=${element._id} class="menu-hold">
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
    document.getElementById("custNameId").innerHTML =
      "Hi, " + localStorage.getItem("customerName");
  }
}

var weekday = new Array(7);
weekday[0] = "Sunday";
weekday[1] = "Monday";
weekday[2] = "Tuesday";
weekday[3] = "Wednesday";
weekday[4] = "Thursday";
weekday[5] = "Friday";
weekday[6] = "Saturday";

let orderOject = {
  businessEmail: localStorage.getItem("tempBusinessEmail"),
  dayName: weekday[new Date().getDay()],
  id: 0,
  isReserved: false,
};

async function checkCompleteAndUpdate() {
  if (
    orderOject.id > 0 &&
    document.getElementById("orderAddress").value.length >= 7
  ) {
    orderOject.isReserved = true;
    document.getElementById("warningMessage").classList.remove("warning");
    document.getElementById("warningMessage").innerHTML = "";
    const apiPath =
      "https://cs615-project.herokuapp.com/delivery/setDeliveryReservedStatus";
    const response = await fetch(apiPath, {
      method: "PUT",
      body: JSON.stringify(orderOject),
      headers: { "Content-type": "application/json; charset=UTF-8" },
    }).catch((err) => console.log(err));
    if (response.ok) {
      $(function () {
        $("#cartModal").modal("toggle");
      });
      const options = {
        style: {
          main: {
            background: "green",
            color: "#fff",
          },
        },
      };
      iqwerty.toast.toast("Ordered Successfully!!!", options);
    }
  } else {
    document.getElementById("warningMessage").classList.add("warning");
    if (
      orderOject.id <= 0 &&
      document.getElementById("orderAddress").value.length < 7
    ) {
      document.getElementById("warningMessage").innerHTML =
        "Time Slot and Address is missing!!!";
    } else if (orderOject.id <= 0) {
      document.getElementById("warningMessage").innerHTML =
        "Select Order Time Slot!!!";
    } else if (document.getElementById("orderAddress").value.length < 7) {
      document.getElementById("warningMessage").innerHTML =
        "Address should be less atleast 7 characters!!!";
    }
  }
}

function updateDeliveryTime(element) {
  if (element.checked) {
    orderOject.id = element.id;
    element.classList.remove("enableOrDisable");
    var otherElements = document.querySelectorAll(".enableOrDisable");
    for (var i = 0, len = otherElements.length; i < len; i++) {
      otherElements[i].disabled = true;
    }
  } else {
    orderOject.id = 0;
    element.classList.add("enableOrDisable");
    var otherElements = document.querySelectorAll(".enableOrDisable");
    for (var i = 0, len = otherElements.length; i < len; i++) {
      otherElements[i].disabled = false;
    }
  }
}

async function fetchBusinessDelivery() {
  const apiUrl =
    "https://cs615-proj.herokuapp.com/restaurant/getCurrentDayDeliveryTime";
  let _data = {
    businessEmail: localStorage.getItem("tempBusinessEmail"),
    dayName: weekday[new Date().getDay()],
  };
  const response = await fetch(apiUrl, {
    method: "POST",
    body: JSON.stringify(_data),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).catch((err) => console.log(err));

  if (response.status == 200) {
    //success
    const responseData = await response.json();
    responseData.datTime.forEach((element) => {
      $("#chooseDeliv").append(`<div class="row">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="col-xs-11 col-sm-11 col-md-11 col-lg-11" style="float:left; display:inline"><h4>
            ${element.startTime}-${element.endTime}</h4></div>
            <div class="col-xs-1 col-sm-1 col-md-1 col-lg-1" style="float:right; display:inline"><div class="form-check form-switch form-switch-md">
            <input type="checkbox" class="form-check-input ${
              element.isReserved ? "" : "enableOrDisable"
            }" id="${element.id}" ${element.isReserved ? "checked" : ""} ${
        element.isReserved ? "disabled" : ""
      } onclick="updateDeliveryTime(this);">
        </div></div>
            </div>
            <hr>`);
    });
    /* responseData.forEach(element => {
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
        }); */
  }
}

function saveBusinessInLocal(businessMail, businessName) {
  localStorage.setItem("tempBusinessEmail", businessMail);
  localStorage.setItem("tempBusinessName", businessName);
  window.location = "menus.html";
}

var cartItems = [];
var total = 0;

function addCartItems(itemName, itemPrice) {
  const options = {
    style: {
      main: {
        background: "green",
        color: "#fff",
      },
    },
  };
  iqwerty.toast.toast("Item Added to cart!", options);
  var itemQuantity = 1;
  var item = {
    itemName: itemName,
    itemPrice: itemPrice,
    quantity: itemQuantity,
  };
  cartItems.push(item);
  localStorage.setItem("itemsList", JSON.stringify(cartItems));
  var displayItems = JSON.parse(localStorage.getItem("itemsList"));
  var i;

  for (i = 0; i < cartItems.length; i++) {
    total = total + parseFloat(cartItems[i].itemPrice);
  }
  displayItems.forEach((element) => {
    $("#addItems tr:last").after(
      `<tr><td>${element.itemName}</td><td>€ ${element.itemPrice}</td><td>${element.quantity}</td></tr>`
    );
  });
  document.getElementById("totalPrice").innerHTML = `Total: € ${total.toFixed(
    2
  )}`;
  cartItems = [];
}

function sortByProperty(property) {
  return function (a, b) {
    if (a[property] > b[property]) return 1;
    else if (a[property] < b[property]) return -1;

    return 0;
  };
}

function sortJSON_objects() {
  document.getElementById("displayMenuId").innerHTML = "";
  var displayItems = JSON.parse(localStorage.getItem("menuObject"));
  var sortedArray = displayItems.sort(sortByProperty("itemPrice")); //sort according to item price
  sortedArray.forEach((element) => {
    $("#displayMenuId").append(`<div id=${element._id} class="menu-hold">
    <div class="menu-container-food">
        <div style="background-image:url(${element.itemImage})" class="menu-img">
            &nbsp;
        </div>
        <h1 class="menu-title ">${element.itemName}</h1>
        <p class="menu-p">${element.itemDescription}</p>
        <p class="price menu-p">€ ${element.itemPrice}</p>
        <button style="margin-left: 100px; " type="button" class="btn btn-warning btn-lg lightGreen"
        onclick="addCartItems('${element.itemName}', '${element.itemPrice}');" );">Add to Cart</button>
    </div>
</div>`);
  });
  toastr.success("Sorted items based on price");
}

function setFormMessage(formElement, type, message) {
  const messageElement = formElement.querySelector(".form__message");

  messageElement.textContent = message;
  messageElement.classList.remove(
    "form__message--success",
    "form__message--error"
  );
  messageElement.classList.add(`form__message--${type}`);
}

function setInputError(inputElement, message) {
  inputElement.classList.add("form__input--error");
  inputElement.parentElement.querySelector(
    ".form__input-error-message"
  ).textContent = message;
}

function clearInputError(inputElement) {
  inputElement.classList.remove("form__input--error");
  inputElement.parentElement.querySelector(
    ".form__input-error-message"
  ).textContent = "";
}

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login");
  const createAccountForm = document.querySelector("#createAccount");
  var linkCreateAccount = document.getElementById("linkCreateAccount");
  if (linkCreateAccount) {
    document
      .querySelector("#linkCreateAccount")
      .addEventListener("click", (e) => {
        e.preventDefault();
        loginForm.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
      });
  }
  var linkLogin = document.getElementById("linkLogin");
  if (linkLogin) {
    document.querySelector("#linkLogin").addEventListener("click", (e) => {
      e.preventDefault();
      loginForm.classList.remove("form--hidden");
      createAccountForm.classList.add("form--hidden");
    });
  }
  if (loginForm != undefined) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Perform your AJAX/Fetch login
      //setFormMessage(loginForm, "error", "Invalid username/password combination");
    });
  }

  document.querySelectorAll(".form__input").forEach((inputElement) => {
    inputElement.addEventListener("blur", (e) => {
      if (
        e.target.id === "signupUsername" &&
        e.target.value.length > 0 &&
        e.target.value.length < 10
      ) {
        setInputError(
          inputElement,
          "Username must be at least 10 characters in length"
        );
      }
    });

    inputElement.addEventListener("input", (e) => {
      clearInputError(inputElement);
    });
  });
});
