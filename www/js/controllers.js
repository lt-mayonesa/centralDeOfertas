/* global WS, angular, PRODUCTS, FAVORITES */

angular.module('starter.controllers', [])

        .controller('LoaderCtrl', function ($scope, $http, $ionicModal, Sales, Favorites) {
            $scope.error = false;
//            $scope.products = Sales.all();
            $ionicModal.fromTemplateUrl('templates/loader.html', {scope: $scope}).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
            $scope.closeModal = function () {
                $scope.modal.hide();
            };
            $scope.sync = function () {
                $scope.error = false;
                $http.get(WS.getAll(WS.ALL_SALES)).success(function (response) {
                    Sales.clone(response.data);
                    //Sales.clone(response.data);
//                $scope.products = Sales.all();
                    Favorites.getFromLocal();
                    $http.get(WS.getTopFavorites()).success(function (response) {
                        $scope.favorites = Sales.favoritesByIds(response.data);
                        $scope.modal.hide();
                    }).error(function (data, status) {
//                        console.log(data, status);
                        $scope.error = true;
                    });
                }).error(function (data, status) {
//                    console.log(data, status);
                    $scope.error = true;
                });
            };
            
            $scope.sync();

            $scope.searchSales = function (value) {
                if (value.length >= 3) {
                    var sales = Sales.search(value, $scope.products);
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
        })

        .controller('CategoriesCtrl', function ($scope, $http, $timeout, Categories) {
            $scope.loading = true;
            $http.get(WS.getAll(WS.ALL_CATEGORIES)).success(function (response) {
                Categories.clone(response.data);
            });
            $scope.$on('$ionicView.afterEnter', function (e) {
                $timeout(function () {
                    $scope.categories = Categories.all();
                    $scope.loading = false;
                }, 1000);
            });
        })
        .controller('ChainsCtrl', function ($scope, $http, $timeout, Chains) {
            $scope.loading = true;
            $http.get(WS.getAll(WS.ALL_CHAINS)).success(function (response) {
                Chains.clone(response.data);
            });
            $scope.$on('$ionicView.afterEnter', function (e) {
                $timeout(function () {
                    $scope.chains = Chains.all();
                    $scope.loading = false;
                }, 1000);
            });
        })
        .controller('BrandsCtrl', function ($scope, $http, $timeout, Brands) {
            $scope.loading = true;
            $http.get(WS.getAll(WS.ALL_BRANDS)).success(function (response) {
                Brands.clone(response.data);
            }).error(function (error) {
                Brands.updateFromLocal();
            });
            $scope.$on('$ionicView.afterEnter', function (e) {
                $timeout(function () {
                    $scope.brands = Brands.all();
                    $scope.loading = false;
                }, 1000);
            });
        })
        .controller('CategoryListCtrl', function ($scope, $http, $stateParams, Sales, Categories) {
            $scope.loading = true;
            $scope.$on('$ionicView.afterEnter', function (e) {
                var category = Categories.get($stateParams.id);
                $scope.category = category;
                var products = Sales.allBy('category', $stateParams.id);
                $scope.products = products;
                $scope.loading = false;
            });


        })
        .controller('ChainListCtrl', function ($scope, $http, $stateParams, Sales, Chains) {
            $scope.loading = true;
            $scope.$on('$ionicView.afterEnter', function (e) {
                var category = Chains.get($stateParams.id);
                $scope.category = category;
                var products = Sales.allBy('chain', $stateParams.id);
                $scope.products = products;
                $scope.loading = false;
            });
        })
        .controller('BrandListCtrl', function ($scope, $http, $timeout, $stateParams, Sales, Brands) {
            $scope.loading = true;
            $scope.$on('$ionicView.afterEnter', function (e) {
                $timeout(function () {
                    var category = Brands.get($stateParams.id);
                    $scope.category = category;
                    var products = Sales.allBy('brand', $stateParams.id);
                    $scope.products = products;
                    $scope.loading = false;
                }, 700);
            });
        })

        .controller('FavoritesCtrl', function ($scope, Favorites) {
            $scope.removeFav = function (id) {
                Favorites.remove(id);
            };
            $scope.products = Favorites.all();
        })

        .controller('SalesListCtrl', function ($scope, $ionicPopup, Favorites, Sales) {
            $scope.addFavorite = function (id) {
                Favorites.add(id);
            };
            $scope.showPopup = function (id) {
                $scope.sale = Sales.get(id);
                var detailPopup = $ionicPopup.show({
                    title: $scope.sale.title,
                    templateUrl: 'templates/sale-detail.html',
                    scope: $scope,
                    buttons: [
                        {text: 'Aceptar', type: 'button-stable'}
                    ]
                });
            };
        })
        .controller('ContactCtrl', function ($scope, $http, $ionicPopup) {
            $scope.fillName = false;
            $scope.fillEmail = false;
            $scope.fillMessage = false;

            $scope.sendMessage = function (data) {
                if (data == null) {
                    $scope.fillName = true;
                    $scope.fillEmail = true;
                    $scope.fillMessage = true;
                    return false;
                }
                var canSend = true;
                if (data.mail == null || data.mail == '') {
                    canSend = false;
                    $scope.fillEmail = true;
                }
                if (data.name == null || data.name == '') {
                    canSend = false;
                    $scope.fillName = true;
                }
                if (data.message == null || data.message == '') {
                    canSend = false;
                    $scope.fillMessage = true;
                }

                if (canSend) {
                    $http.get(WS.sendMessage(data.name, data.message, data.mail)).success(function (data) {
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
