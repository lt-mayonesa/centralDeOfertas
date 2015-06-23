/* global WS, angular, PRODUCTS, FAVORITES, Session */

angular.module('starter.controllers', [])

        .controller('LoaderCtrl', function ($scope, $http, $ionicModal, Sales, Favorites, $rootScope, Session, $ionicPlatform) {
            $scope.error = false;
            $scope.networkState = Session.getConnStatus();
//            $scope.products = Sales.all();
            $ionicModal.fromTemplateUrl('templates/loader.html', {scope: $scope}).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
            $scope.syncLater = function () {
                Sales.updateFromLocal();
                $scope.$on('finishSales', function () {
                    Favorites.getFromLocal();
                    $scope.modal.hide();
                });
            };
            $scope.sync = function () {
                $scope.error = false;
                $http.get(WS.getAll(WS.ALL_SALES)).success(function (response) {
                    Sales.clone(response.data);
                    Favorites.getFromLocal();
                    $http.get(WS.getTopFavorites()).success(function (response) {
                        $scope.favorites = Sales.favoritesByIds(response.data);
                        Session.syncked();
                        $scope.modal.hide();
                    }).error(function (data, status) {
                        $scope.error = true;
                        $scope.errorMsg = 'Error cargando el ranking.';
                    });
                }).error(function (data, status) {
                    $scope.error = true;
                    if (Session.getConnStatus()) {
                        $scope.errorMsg = 'Error de conexion desconocido.';
                    } else {
                        $scope.errorMsg = 'No estas conectado a una red. Las ofertas pueden estar desactualizadas.';
                    }
                });
            };

            $ionicPlatform.ready(function () {
                $scope.sync();
            });

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

            $rootScope.$on('$cordovaNetwork:online', function (event, networkState) {
                Session.setConnStatus(false);
                if (!Session.syncronized()) {
                    $scope.error = false;
                    $scope.modal.show();
                    $scope.sync();
                }
            });
        })

        .controller('CategoriesCtrl', function ($scope, $http, $timeout, Categories) {
            $scope.loading = true;
            $http.get(WS.getAll(WS.ALL_CATEGORIES)).success(function (response) {
                Categories.clone(response.data);
            }).error(function () {
                Categories.updateFromLocal();
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
            }).error(function () {
                Chains.updateFromLocal();
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
        .controller('CategoryListCtrl', function ($scope, $stateParams, Sales, Categories) {
            $scope.loading = true;
            $scope.$on('$ionicView.afterEnter', function (e) {
                var category = Categories.get($stateParams.id);
                $scope.category = category;
                var products = Sales.allBy('category', $stateParams.id);
                $scope.products = products;
                $scope.loading = false;
            });


        })
        .controller('ChainListCtrl', function ($scope, $stateParams, Sales, Chains) {
            $scope.loading = true;
            $scope.$on('$ionicView.afterEnter', function (e) {
                var category = Chains.get($stateParams.id);
                $scope.category = category;
                var products = Sales.allBy('chain', $stateParams.id);
                $scope.products = products;
                $scope.loading = false;
            });
        })
        .controller('BrandListCtrl', function ($scope, $timeout, $stateParams, Sales, Brands) {
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
            $scope.subscribes = false;

            $scope.subscribeChange = function () {
                $scope.subscribes = !$scope.subscribes;
            };
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
                    $http.get(WS.sendMessage(data.name, data.message, data.mail, $scope.subscribes)).success(function (data) {
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
