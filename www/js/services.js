/* global PRODUCTS, angular, CHAINS */

angular.module('starter.services', [])

        .factory('Favorites', function ($http) {
            var favorites = [];

            return {
                all: function () {
                    return favorites;
                },
                /**
                 * 
                 * add favorite to my list and storeit in sever
                 * 
                 * @param {int} id sale_id
                 * @returns {Boolean}
                 */
                add: function (id) {
                    var newFav = PRODUCTS.findKeyBy('id', id);
                    if (newFav !== null) {
                        if (favorites.findBy('id', parseInt(id)) === null || favorites.length === 0) {
                            favorites.push(PRODUCTS[newFav]);
                            PRODUCTS[newFav].favorite = true;
                            $http.get(WS.addFavorite(id)).success(function (data) {
                                console.log('favorite added');
                            }).error(function (data, code) {
                                console.log('couldnt save favorite');
                            });
                            return true;
                        }
                    }
                    return false;
                },
                remove: function (id) {
                    var favAt = favorites.findKeyBy('id', parseInt(id));
                    favorites.splice(favAt, 1);
                    PRODUCTS[PRODUCTS.findKeyBy('id', parseInt(id))].favorite = false;
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
                    var p = PRODUCTS.findBy('id', parseInt(productId));
                    if (p)
                        return p;
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
                            if (key === 'title' || key === 'value' || key === 'type' || key === 'chain') {
                                var item = PRODUCTS[i][key];
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
                    for (var i = 0; i < array.length; i++) {
                        var item = PRODUCTS.findBy('id', parseInt(array[i].sale_id));
                        if (item)
                            item.totalFavs = array[i].total;
                        favorites.push(item);
                    }
                    return favorites;
                },
                getCount: function (type, id) {
                    var val = 0;
                    for (var i = 0; i < PRODUCTS.length; i++) {
                        if (PRODUCTS[i][type + '_id'] == id)
                            val++;
                    }
                    return val;
                }
            };
        })
        .factory('Categories', function (Sales) {
            var categories = [];
            return {
                all: function () {
                    return categories;
                },
                add: function (item) {
                    if (item.name) {
                        if (item.pCount) {
                            categories.push(item);
                        } else {
                            item.pCount = Sales.getCount('category', item.id);
                            categories.push(item);
                        }
                    }
                },
                get: function (id) {
                    var c = categories.findBy('id', parseInt(id));
                    if (c) {
                        return c;
                    } else {
                        return null;
                    }
                },
                clone: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (!(data[i].pCount)) {
                            data[i].pCount = Sales.getCount('category', data[i].id);
                        }
                    }
                    categories = data;
                    return categories;
                }
            };
        })
        .factory('Chains', function (Sales) {
            var chains = [];
            return {
                all: function () {
                    return chains;
                },
                add: function (item) {
                    if (item.name) {
                        if (item.pCount) {
                            chains.push(item);
                        } else {
                            item.pCount = Sales.getCount('chain', item.id);
                            chains.push(item);
                        }
                    }
                },
                get: function (id) {
                    var c = chains.findBy('id', parseInt(id));
                    if (c) {
                        return c;
                    } else {
                        return null;
                    }
                },
                clone: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (!(data[i].pCount)) {
                            data[i].pCount = Sales.getCount('chain', data[i].id);
                        }
                    }
                    chains = data;
                    return chains;
                }
            };
        })
        .factory('Brands', function (Sales) {
            var brands = [];
            return {
                all: function () {
                    return brands;
                },
                add: function (item) {
                    if (item.name) {
                        if (item.pCount) {
                            brands.push(item);
                        } else {
                            item.pCount = Sales.getCount('brand', item.id);
                            brands.push(item);
                        }
                    }
                },
                get: function (id) {
                    var b = brands.findBy('id', parseInt(id));
                    if (b) {
                        return b;
                    } else {
                        return null;
                    }
                },
                clone: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (!(data[i].pCount)) {
                            data[i].pCount = Sales.getCount('brand', data[i].id);
                        }
                    }
                    brands = data;
                    return brands;
                }
            };
        });
