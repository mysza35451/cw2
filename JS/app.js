let webStore = new Vue({
  el: "#app",
  data: {
    render: false,
    //index page data
    pageTitle: "Lessons to buy",
    classes: arrayOfClasses,
    showItems: true,
    populatedLocalStorage: false,
    addToCartButton: true,
    showBasketButton: true,

    //basket page data
    basketClassesArray: [],
    displayFields: true,
    displayBasketClasses: false,
    userName: "",
    userNum: null,
    validationMsgName: "",
    validationMsgNum: "",
    nameCorrect: false,
    numCorrect: false,
    displayCheckOut: false,
    confirmationTitle: "Order Completed! Here is your confirmation",
    confirmationSub: "Your order reference is:",
    confirmationRef: "xxxxxxxxxxxxx",
  },
  mounted: function () {
    //allows to execute methods on pageload
    this.loadLessons();

    this.checkLocalStorage();
  },
  watch: {
    userName(value) {
      // binding this to the data value in the email input
      this.userName = value;
      this.checkUserName(value);
    },
    userNum(value) {
      // binding this to the data value in the email input
      this.userNum = value;
      this.checkUserNum(value);
    },
  },
  methods: {
    loadLessons: function(){
const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};
fetch("/collection/Lessons", options).then((response) => response.json())
.then((data) => {
  this.classes = data;
  console.log(data)
  this.render = true;
});

    },
    initializeSort: function (event) {
      let order = document.getElementById("order").value;
      let attribute = document.getElementById("attribute").value;

      //sort descending for price
      if (order == "ascending" && attribute == "price") {
        arrayOfClasses.sort(function (a, b) {
          return parseInt(a.price) - parseInt(b.price);
        });
      }
      //sort ascending for price
      else if (order == "descending" && attribute == "price") {
        arrayOfClasses.sort(function (a, b) {
          return parseInt(a.price) - parseInt(b.price);
        });
        arrayOfClasses.reverse();
      } else if (order == "descending" && attribute == "availability") {
        arrayOfClasses.sort(function (a, b) {
          return parseInt(a.spaces) - parseInt(b.spaces);
        });
        arrayOfClasses.reverse();
      } else if (order == "ascending" && attribute == "availability") {
        arrayOfClasses.sort(function (a, b) {
          return parseInt(a.spaces) - parseInt(b.spaces);
        });
      }
      //sort ascending for subject
      else if (order == "ascending" && attribute == "subject") {
        arrayOfClasses.sort(function (a, b) {
          var stringA = a.subject.toLowerCase(),
            stringB = b.subject.toLowerCase();
          if (stringA < stringB) return -1;
          if (stringA > stringB) return 1;
          return 0; //default return value (no sorting)
        });
      } else if (order == "descending" && attribute == "subject") {
        arrayOfClasses.sort(function (a, b) {
          var stringA = a.subject.toLowerCase(),
            stringB = b.subject.toLowerCase();
          if (stringA > stringB) return -1;
          if (stringA < stringB) return 1;
          return 0; //default return value (no sorting)
        });
      } else if (order == "descending" && attribute == "location") {
        arrayOfClasses.sort(function (a, b) {
          var stringA = a.location.toLowerCase(),
            stringB = b.location.toLowerCase();
          if (stringA > stringB) return -1;
          if (stringA < stringB) return 1;
          return 0; //default return value (no sorting)
        });
      } else if (order == "ascending" && attribute == "location") {
        arrayOfClasses.sort(function (a, b) {
          var stringA = a.location.toLowerCase(),
            stringB = b.location.toLowerCase();
          if (stringA < stringB) return -1;
          if (stringA > stringB) return 1;
          return 0; //default return value (no sorting)
        });
      }
    },
    addToBasket: function (id,subject,location,price,spaces, img, index) {
     console.log(id)
     this.classes[index].spaces--
      if(this.classes[index].spaces<1){
        document.getElementById(index).disabled = true;
      }
 let orderData = [{lessonsID: id,subject:subject, location: location, price:price, spaces: spaces, img: img}];



if (localStorage.getItem("order") == undefined) {
  
  localStorage.order = JSON.stringify(orderData);
} else {
  let oldOrders = JSON.parse(localStorage.order);
  orderData = {lessonsID: id,subject:subject, location: location, price:price, spaces: spaces, img:img};
  oldOrders.push(orderData);
  localStorage.order = JSON.stringify(oldOrders);
}
     this.populatedLocalStorage = true;
      this.showBasketButton = true;
    },
    checkLocalStorage: function () {
      //to run on load
      if (localStorage.getItem("order")) {
        this.populatedLocalStorage = true;
      }
    },
    
    loadBasketPage: function () {
      this.showItems = false;
      this.pageTitle = "Basket";
      this.showBasketButton = false;

      let arrayOfBasketSession = [];
      let basketClassesArrayTemp = [{}];
      arrayOfBasketSession = JSON.parse(localStorage.order);
      this.basketClassesArray = arrayOfBasketSession;
console.log(arrayOfBasketSession)
      this.displayBasketClasses = true;
      this.displayFields = true;
    },
    loadMainPage: function () {
      this.showItems = true;
      this.pageTitle = "Lessons to buy";
      this.displayBasketClasses = false;
      if (localStorage.getItem("order")) {
        this.showBasketButton = true;
      }
      this.basketClassesArray = [];
    },
    removeClass: function (id) {
      let indexArray = [];
      indexArray = JSON.parse(localStorage.order);

      for (let i = 0; i < indexArray.length; i++) {
        if (indexArray[i] == id) {
          indexArray.splice(i, 1);
          localStorage.clear();
          this.basketClassesArray = [];

          if (indexArray.length !== 0) {
            localStorage.basketIndexArray = JSON.stringify(indexArray);
            this.loadBasketPage();
          } else {
            this.displayFields = false;
          }
          break;
        }
      }
    },
    checkUserName: function (value) {
      if (/^[A-Za-z]+$/.test(value)) {
        this.validationMsgName = "";
        this.nameCorrect = true;
      } else {
        this.validationMsgName = "Wrong input - only letters are allowed!";
        this.nameCorrect = false;
      }
    },
    checkUserNum: function (value) {
      console.log(Number.isInteger(value));
      if (/^\d+$/.test(value)) {
        this.validationMsgNum = "";
        this.numCorrect = true;
      } else {
        this.validationMsgNum = "Wrong input - only numbers are allowed!";
        this.numCorrect = false;
      }
    },

    loadCheckOut: function () {
      let orderData = JSON.parse(localStorage.order);
      let mongoOrder = []
      let mongoOrderTemp = [];
      let user = document.getElementById("fname").value;
      let phoneNum = document.getElementById("pnumber").value;
      for (let i = 0; i < orderData.length; i++) {
      
        mongoOrderTemp = {
          userName: user,
          phone: phoneNum,
          lessonID: orderData[i].lessonsID,
          spaces: orderData[i].spaces
        };
        mongoOrder.push(mongoOrderTemp);


        const optionsPUT = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({spaces: mongoOrder[i].spaces--})
        
        };
        console.log(orderData)
        fetch(`/collection/Lessons/${mongoOrder[i].lessonID}`, optionsPUT).then((response) => response.json())
        .then((responseJSON) => {
          console.log("Success:", responseJSON);
        });
      }

      const optionsPOST = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(mongoOrder)

};
console.log(orderData)
fetch("/collection/Orders", optionsPOST).then((response) => response.json())
.then((responseJSON) => {
  console.log("Success:", responseJSON);
  this.displayCheckOut = true;
});


  //put fetch


  


    },
    
  },
});
