/* global PRODUCTS, angular, BRANDS */

angular.module('starter.services', [])

        .factory('Favorites', function () {
            var favorites = [];

            return {
                all: function () {
                    return favorites;
                },
                add: function (id) {
                    var newFav = PRODUCTS.findKeyBy('id', id);
                    if (newFav !== null) {
                        if (favorites.findBy('id', id) === null || favorites.length === 0) {
                            favorites.push(PRODUCTS[newFav]);
                            PRODUCTS[newFav].favorite = true;
                            return true;
                        }
                    }
                    return false;
                },
                remove: function (id) {
                    var favAt = favorites.findKeyBy('id', id);
                    favorites.splice(favAt, 1);
                    PRODUCTS[PRODUCTS.findKeyBy('id', id)].favorite = false;
                }
            };

        })
        .factory('Sales', function () {
            var products = [];
            return {
                all: function () {
                    return PRODUCTS;
                },
                get: function (productId) {
                    for (var key in PRODUCTS) {
                        if (PRODUCTS[key].id == parseInt(productId)) {
                            return PRODUCTS[key];
                        }
                    }
                },
                allBy: function (type, id) {
                    var total = [];
                    for (var key in PRODUCTS) {
                        if (PRODUCTS[key][type + '_id'] == id) {
                            total.push(PRODUCTS[key]);
                        }
                    }
                    return total;
                },
                clone: function (data) {
                    products = data;
                },
                search: function (data) {
                    var sales = [];
                    for (var i = 0; i < PRODUCTS.length; i++) {
                        for (var key in PRODUCTS[i]) {
                            if (key === 'title' || key === 'value' || key === 'type' || key === 'brand_id') {
                                var item;
                                if (key === 'brand_id') {
                                    item = BRANDS[BRANDS.findKeyBy('id', PRODUCTS[i][key])].name;
                                } else {
                                    item = PRODUCTS[i][key];
                                }
                                var regEx = new RegExp(data, 'i');
                                if (item.search(regEx) !== -1) {
                                    sales.push(PRODUCTS[i]);
                                    break;
                                }
                            }
                        }
                    }
                    return sales;
                }
            };
        });
