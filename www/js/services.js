/* global PRODUCTS, angular, CHAINS */

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
                            if (key === 'title' || key === 'value' || key === 'type' || key === 'chain_id') {
                                var item;
                                if (key === 'chain_id') {
                                    item = CHAINS[CHAINS.findKeyBy('id', PRODUCTS[i][key])].name;
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
                },
                favoritesByIds: function (array) {
                    var favorites = [];
                    for (var i = 0; i < array.length; i ++) {
                        var item = PRODUCTS.findBy('id', array[i].sale_id);
                        if (item)
                            item.totalFavs = array[i].total;
                            favorites.push(item);
                    }
                    return favorites;
                }
            };
        });
