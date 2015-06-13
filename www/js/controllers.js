/* global WS, angular, PRODUCTS, FAVORITES */

angular.module('starter.controllers', [])

        .controller('LoaderCtrl', function ($scope, $http, $ionicModal, Sales, Favorites) {
            function wsError() {
                $scope.error = true;
            }
            $scope.error = false;
//            $scope.products = Sales.all();
            $ionicModal.fromTemplateUrl('templates/loader.html').then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
            $http.get(WS.getAll(WS.ALL_SALES)).success(function (response) {
                PRODUCTS = response.data;
                //Sales.clone(response.data);
//                $scope.products = Sales.all();
                $http.get(WS.getTopFavorites()).success(function (response) {
                    $scope.favorites = Sales.favoritesByIds(response.data);
                    $scope.modal.hide();
                }).error(wsError());
            }).error(wsError());

            $scope.searchSales = function (value) {
                if (value.length >= 3) {
                    var sales = Sales.search(value);
                    $scope.products = sales;
                } else {
                    $scope.products = [];
                }
            };

            $scope.myFavoritesCount = function () {
                return Favorites.all().length;
            };
        })
        .controller('ProductsCtrl', function ($scope, $http, Sales) {
//            console.log('prodsds');
//            
//            $http.get(WS.getAll(WS.ALL_SALES)).success(function (response) {
//                PRODUCTS = response.data;
//                $scope.products = PRODUCTS;
//            });
        })

        .controller('CategoriesCtrl', function ($scope, $http) {
            $scope.$on('$ionicView.loaded', function (e) {
            });
            $scope.salesCount = function (type, id) {
                var val = 0;
                for (var i = 0; i < PRODUCTS.length; i++) {
                    if (PRODUCTS[i][type + '_id'] == id)
                        val++;
                }
                return val;
            };
            $scope.loading = true;
            $scope.$on('$ionicView.afterEnter', function (e) {
                $scope.categories = CATEGORIES;
                $http.get(WS.getAll(WS.ALL_CATEGORIES)).success(function (response) {
                    CATEGORIES = response.data;
                    $scope.categories = CATEGORIES;
                });
                $scope.loading = false;
            });
        })
        .controller('ChainsCtrl', function ($scope, $http) {
            $scope.$on('$ionicView.loaded', function (e) {
            });
            $scope.salesCount = function (type, id) {
                var val = 0;
                for (var i = 0; i < PRODUCTS.length; i++) {
                    if (PRODUCTS[i][type + '_id'] == id)
                        val++;
                }
                return val;
            };
            $scope.loading = true;
            $scope.$on('$ionicView.afterEnter', function (e) {
                //$scope.chains = CHAINS;
                $http.get(WS.getAll(WS.ALL_CHAINS)).success(function (response) {
                    CHAINS = response.data;
                    $scope.chains = CHAINS;
                });
                $scope.loading = false;
            });
        })
        .controller('BrandsCtrl', function ($scope, $http) {
            $scope.$on('$ionicView.loaded', function (e) {
            });
            $scope.salesCount = function (type, id) {
                var val = 0;
                for (var i = 0; i < PRODUCTS.length; i++) {
                    if (PRODUCTS[i][type + '_id'] == id)
                        val++;
                }
                return val;
            };
            $scope.loading = true;
            $scope.$on('$ionicView.afterEnter', function (e) {
                $scope.brands = BRANDS;
                $http.get(WS.getAll(WS.ALL_BRANDS)).success(function (response) {
                    BRANDS = response.data;
                    $scope.brands = BRANDS;
                });
                $scope.loading = false;
            });
        })
        .controller('CategoryListCtrl', function ($scope, $http, $stateParams, Sales) {
            $scope.loading = true;
            $scope.$on('$ionicView.afterEnter', function (e) {
                var category = CATEGORIES.findBy('id', $stateParams.id);
                $scope.category = category;
//            $http.get(WS.getSalesByType($stateParams.type, $stateParams.id))
//                    .success(function (response) {
//                        $scope.products = response.data;
//                    });
                var products = Sales.allBy('category', $stateParams.id);
                $scope.products = products;
                $scope.loading = false;
            });


        })
        .controller('ChainListCtrl', function ($scope, $http, $stateParams, Sales) {
            $scope.loading = true;
            $scope.$on('$ionicView.afterEnter', function (e) {
                var category = CHAINS.findBy('id', $stateParams.id);
                $scope.category = category;
                var products = Sales.allBy('chain', $stateParams.id);
                $scope.products = products;
                $scope.loading = false;
            });
        })
        .controller('BrandListCtrl', function ($scope, $http, $stateParams, Sales) {
            $scope.loading = true;
            $scope.$on('$ionicView.afterEnter', function (e) {
                var category = BRANDS.findBy('id', $stateParams.id);
                $scope.category = category;
                var products = Sales.allBy('brand', $stateParams.id);
                $scope.products = products;
                $scope.loading = false;
            });
        })

        .controller('FavoritesCtrl', function ($scope, Favorites) {
            $scope.removeFav = function (id) {
                Favorites.remove(id);
            };
            $scope.getChain = function (id) {
                var chain = CHAINS.findBy('id', id);
                return chain.name;
            };
            $scope.products = Favorites.all();
        })

        .controller('SalesListCtrl', function ($scope, $ionicPopup, Favorites) {
            $scope.addFavorite = function (id) {
                Favorites.add(id);
            };
            $scope.showPopup = function (id) {
                $scope.sale = PRODUCTS.findBy('id', id);
                var detailPopup = $ionicPopup.show({
                    title: $scope.sale.title,
                    templateUrl: 'templates/sale-detail.html',
                    scope: $scope,
                    buttons: [
                        {text: 'Aceptar', type: 'button-stable'}
                    ]
                });
            };
            $scope.getChain = function (id) {
                var chain = CHAINS.findBy('id', id);
                if (chain)
                    return chain.name;
            };
        })
        .controller('ContactCtrl', function ($scope, $http, $ionicPopup) {
            $scope.sendMessage = function (data) {
                var email;
                if (data.mail === null || data.mail === '') {
                    email = '';
                } else {
                    email = data.mail;
                }
                canSend = true;
                if (data.name === null || data.name === '') {
                    canSend = false;
                }
                if (data.message === null || data.message === '') {
                    canSend = false;
                }

                if (canSend) {
                    $http.get(WS.sendMessage(data.name, data.message, email)).success(function (data) {
                        var succesPopup = $ionicPopup.show({
                            title: 'Mensaje Enviado!',
                            subTitle: 'Gracias por enviarnos tu opinion',
                            buttons: [
                                {text: 'Aceptar', type: 'button-stable'}
                            ]
                        });
                    }).error(function (data, status, headers) {
                        var errorPopup = $ionicPopup.show({
                            title: 'Error',
                            subTitle: 'Lo sentimos pero hubo un error en la conección',
                            button: [
                                {text: 'Aceptar', type: 'button-stable'}
                            ]
                        });
                    });
                }
            };
        });
