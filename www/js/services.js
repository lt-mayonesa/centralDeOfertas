/* global, angular, CHAINS */

angular.module('starter.services', [])

        .factory('DBA', function ($cordovaSQLite, $q, $ionicPlatform) {
            var self = this;
            self.query = function (query, parameters) {
                parameters = parameters || [];
                var q = $q.defer();

                $ionicPlatform.ready(function () {
			    console.log('database a');
                    $cordovaSQLite.execute(db, query, parameters)
                            .then(function (result) {
                                //console.log('execute');
                                q.resolve(result);
                            }, function (error) {
                                console.warn('I found an error');
                                console.warn(error);
                                q.reject(error);
                            });
                });
                return q.promise;
            };

            // Proces a result set
            self.getAll = function (result) {
                var output = [];

                for (var i = 0; i < result.rows.length; i++) {
                    output.push(result.rows.item(i));
                }
                return output;
            };

            // Proces a single result
            self.getById = function (result) {
                var output = null;
                output = angular.copy(result.rows.item(0));
                return output;
            };

            return self;
        })
        .factory('Favorites', function ($http, DBA, Sales) {
            var favorites = [];

            return {
                getFromLocal: function () {
                    var data = [];
                    var sales = Sales.all();
                    DBA.query("SELECT sale_id FROM favorites")
                            .then(function (result) {
                                data = DBA.getAll(result);
                                if (data) {
                                    for (var i = 0; i < data.length; i++) {
                                        var key = sales.findKeyBy('id', parseInt(data[i].sale_id));
                                        favorites.push(sales[key]);
                                        sales[key].favorite = true;
                                    }
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                },
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
                    var sales = Sales.all();
                    var newFav = sales.findKeyBy('id', parseInt(id));
                    if (newFav !== null) {
                        if (favorites.findBy('id', parseInt(id)) === null || favorites.length === 0) {
                            favorites.push(sales[newFav]);
                            sales[newFav].favorite = true;
                            // store in local db
                            var parameters = [id];
                            DBA.query("INSERT INTO favorites (sale_id) VALUES (?)", parameters);
                            // store in web db
                            $http.get(WS.addFavorite(id)).success(function (data) {
//                                console.log('favorite added');
                            }).error(function (data, code) {
//                                console.log('couldnt save favorite');
                            });
                            //
                            return true;
                        }
                    }
                    return false;
                },
                remove: function (id) {
                    var sales = Sales.all();
                    var favAt = favorites.findKeyBy('id', parseInt(id));
                    favorites.splice(favAt, 1);
                    sales[sales.findKeyBy('id', parseInt(id))].favorite = false;
                    var p = [id];
                    DBA.query("DELETE FROM favorites WHERE sale_id = (?)", p);
                }
            };

        })
        .factory('Sales', function ($rootScope,DBA) {
            var products = [];
            return {
                all: function () {
                    return products;
                },
                get: function (productId) {
                    var p = products.findBy('id', parseInt(productId));
                    if (p)
                        return p;
                },
                allBy: function (type, id) {
                    var total = [];
                    for (var key in products) {
                        if (products[key][type + '_id'] == id) {
                            total.push(products[key]);
                        }
                    }
                    return total;
                },
                clone: function (data) {
                    products = data;
                    DBA.query("DELETE FROM sales").then(function (res) {
                        for (var i = 0; i < data.length; i++) {
                            var p = [
                                data[i].id,
                                data[i].title,
                                data[i].type,
                                data[i].category_id,
                                data[i].brand_id,
                                data[i].chain_id,
                                data[i].manufacturer_id,
                                data[i].filename,
                                data[i].value,
                                data[i].value_final,
                                data[i].date_from,
                                data[i].date_to,
                                data[i].chain
                            ];
                            DBA.query("INSERT INTO sales VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", p);
                            console.log('clone done!');
                        }
                    });
                    return true;
                },
                search: function (data) {
                    var sales = [];
                    for (var i = 0; i < products.length; i++) {
                        for (var key in products[i]) {
                            if (key === 'title' || key === 'value' || key === 'type' || key === 'chain') {
                                var item = products[i][key];
                                var regEx = new RegExp(data, 'i');
                                if (item.search(regEx) !== -1) {
                                    sales.push(products[i]);
                                    break;
                                }
                            }
                        }
                    }
                    return sales;
                },
                superSearch: function (data, current) {
                    var sales = [];
                    var words = data.split(' ');
                    for (var l = 0; l < words.length; l++) {
                        if (words.length === 1) {
                            for (var i = 0; i < products.length; i++) {
                                for (var key in products[i]) {
                                    if (key === 'title' || key === 'value' || key === 'type' || key === 'chain') {
                                        var item = products[i][key];
                                        var regEx = new RegExp(words[l], 'i');
                                        if (item.search(regEx) !== -1) {
                                            if (current.length > 0) {
                                                for (var c in current) {
                                                    if (current[c].id !== products[i].id) {
                                                        sales.push(products[i]);
                                                    }
                                                    break;
                                                }
                                            } else {
                                                sales.push(products[i]);
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        } else {
                            for (var i = 0; i < current.length; i++) {
                                for (var key in current[i]) {
                                    if (key === 'title' || key === 'value' || key === 'type' || key === 'chain') {
                                        var item = current[i][key];
                                        var regEx = new RegExp(words[l], 'i');
                                        if (item.search(regEx) !== -1) {
                                            if (current.length > 0) {
                                                for (var c in current) {
                                                    if (current[c].id !== current[i].id) {
                                                        sales.push(current[i]);
                                                    }
                                                    break;
                                                }
                                            } else {
                                                sales.push(current[i]);
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return sales;
                },
                favoritesByIds: function (array) {
                    var favorites = [];
                    for (var i = 0; i < array.length; i++) {
                        var item = products.findBy('id', parseInt(array[i].sale_id));
                        if (item)
                            item.totalFavs = array[i].total;
                        favorites.push(item);
                    }
                    return favorites;
                },
                getCount: function (type, id) {
                    var val = 0;
                    for (var i = 0; i < products.length; i++) {
                        if (products[i][type + '_id'] == id)
                            val++;
                    }
                    return val;
                },
                updateFromLocal: function () {
                    DBA.query("SELECT * FROM sales").then(function (result) {
                        var data = DBA.getAll(result);
                        products = data;
                        $rootScope.$broadcast('finishSales');
                    });
                }
            };
        })
        .factory('Categories', function (Sales, DBA) {
            var categories = [];
            return {
                updateFromLocal: function () {
                    DBA.query("SELECT * FROM categories").then(function (result) {
                        var data = DBA.getAll(result);
                        for (var i = 0; i < data.length; i++) {
                            if (!(data[i].pCount)) {
                                data[i].pCount = Sales.getCount('category', data[i].id);
                            }
                        }
                        categories = data;
                        return true;
                    });
                },
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
                    DBA.query("DELETE FROM categories").then(function (res) {
                        for (var i = 0; i < data.length; i++) {
                            var p = [data[i].id, data[i].name];
                            DBA.query("INSERT INTO categories VALUES (?,?)", p);
                        }
                    });
                    return true;
                }
            };
        })
        .factory('Chains', function (Sales, DBA) {
            var chains = [];
            return {
                updateFromLocal: function () {
                    DBA.query("SELECT * FROM chains").then(function (result) {
                        var data = DBA.getAll(result);
                        for (var i = 0; i < data.length; i++) {
                            if (!(data[i].pCount)) {
                                data[i].pCount = Sales.getCount('chain', data[i].id);
                            }
                        }
                        chains = data;
                        return true;
                    });
                },
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
                    DBA.query("DELETE FROM chains").then(function (res) {
                        for (var i = 0; i < data.length; i++) {
                            var p = [data[i].id, data[i].name];
                            DBA.query("INSERT INTO chains VALUES (?,?)", p);
                        }
                    });
                    return true;
                }
            };
        })
        .factory('Brands', function (Sales, DBA) {
            var brands = [];
            return {
                updateFromLocal: function () {
                    DBA.query("SELECT * FROM brands").then(function (result) {
                        var data = DBA.getAll(result);
                        for (var i = 0; i < data.length; i++) {
                            if (!(data[i].pCount)) {
                                data[i].pCount = Sales.getCount('brand', data[i].id);
                            }
                        }
                        brands = data;
                        return true;
                    });
                },
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
                    DBA.query("DELETE FROM brands").then(function (res) {
                        for (var i = 0; i < data.length; i++) {
                            var p = [data[i].id, data[i].name];
                            DBA.query("INSERT INTO brands VALUES (?,?)", p);
                        }
                    });
                    return true;
                }
            };
        });
