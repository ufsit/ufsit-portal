
//This program makes the items, their values, and totals fully dynamic on the Ecart.
//Adding more items to the html in the same format should require no changes to this file; 
//only the html file. 

(function() {
  //This is now just a reference to "myModule" in app.js
  var app = angular.module("myModule");

  app.controller("mainController", function($http, $log, $location, $routeParams){

    var self = this; //makes variables accessible without being global
    self.array = []; //array to hold items

    //adds item to cart when there are 1 or more already
    self.itemUp = function(item) {
      ++item.quantity;
      item.price += item.pricePer;
    };
    //removes item from cart
    self.itemDown = function(item) {
      item.quantity = 0;
      item.price = 0;
    };
    //handles changes via dropdown menu
    self.userChange = function(item) {
      item.price = item.quantity*item.pricePer;
    };

    //checks if the item already exists in the array	
    self.findItemByName = function(name) {
    	for (var item of self.array) {
        	if (item.name === name) {
          		return item;
        	}
         }
 	 return null;
    };

    //decides whether to create the item object or add to an item already in the cart
    self.onSelectItem = function(name, pricePer) {
      var theItem = self.findItemByName(name);
      if (!theItem || !self.array.length) self.pushIt(name, pricePer);
      else self.itemUp(theItem);
    };
    //creates the item and adds it to cart
    self.pushIt = function(name, pricePer) {
      var obj = {
        name: name,
        price: pricePer,
        quantity: 1,
        pricePer: pricePer
      };
      self.array.push(obj);
    };

      self.ecartData = function() {
          username = $routeParams.username;
              var data = JSON.stringify(
                  {
                      row1: self.array[0],
                      row2: self.array[1]
                  }
              );
          var table_data = JSON.stringify({
              username: $routeParams.username,
              row1: self.array[0],
              row2: self.array[1]
      });



              $http({
                  url: '/data/' + username,
                  data: data,
                  method: "PUT",
                  headers: {"Content-type": "application/json"}
              }).then(function successCallback(response) {
                  $log.info('Successfull Put');
              }, function errorCallback(response) {
                  $log.info('Unsuccessfull Put');
              });

              $location.path("/home/final_cart/" + table_data);
      };
  });

}());






