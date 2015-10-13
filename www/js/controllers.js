/* global WS, angular, PRODUCTS, FAVORITES, Session */

angular.module('app.controllers', [])

        .controller('LoaderCtrl', function ($scope, $http, $ionicModal, Sales, Favorites, DataHandler, $rootScope, Session, $ionicPlatform, User, Brands, Chains, Categories) {
            $scope.products = Sales.all();
            $scope.user = User.get();
            $scope.error = false;
            $scope.options = false;
            $scope.networkState = Session.getConnStatus();
//            $scope.products = Sales.all();
            $ionicModal.fromTemplateUrl('templates/loader.html', {scope: $scope, hardwareBackButtonClose: false}).then(function (modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
            $ionicModal.fromTemplateUrl('templates/singin-form.html', {scope: $scope}).then(function (modal) {
                $rootScope.singInModal = modal;
            });

            $scope.syncLater = function () {
                Sales.updateFromLocal();
                $scope.$on('finishSales', function () {
                    Favorites.getFromLocal();
                    $scope.modal.hide();
                });
            };
            $scope.sync = function () {
                //esto funciona?
                DataHandler.loadDataFromLocal();

                $scope.error = false;
                $http.get(WS.getAll(WS.ALL_BRANDS)).success(function (response) {
                    Brands.clone(response.data);
                }).error(function (error) {
                    Brands.updateFromLocal();
                });
                $http.get(WS.getAll(WS.ALL_CHAINS)).success(function (response) {
                    Chains.clone(response.data);
                }).error(function (error) {
                    Chains.updateFromLocal();
                });
                $http.get(WS.getAll(WS.ALL_CATEGORIES)).success(function (response) {
                    Categories.clone(response.data);
                }).error(function (error) {
                    Categories.updateFromLocal();
                });
                $http.get(WS.getAll(WS.ALL_SALES)).success(function (response) {
                    Sales.clone(response.data, function (succes) {
                        if (succes)
                            $scope.products = Sales.all();
                    });
                    Favorites.getFromLocal();
                    $http.get(WS.getTopFavorites()).success(function (response) {
                        $scope.favorites = Sales.favoritesByIds(response.data);
                        Session.syncked();
                        $scope.modal.hide();
                        $scope.modal.remove();
                        if (Object.keys($scope.user).length <= 0) {
                            if (!$rootScope.singInModal.isShown())
                                $rootScope.singInModal.show();
                        }
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
                    $scope.searchProducts = sales;
                } else {
                    $scope.searchProducts = [];
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
            $scope.toggleOptions = function () {
                $scope.options = !$scope.options;
            };
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

        .controller('FavoritesCtrl', function ($rootScope, $scope, $ionicPopup, $customPopups, $ionicModal, $http, Favorites, User) {
            var user = User.get();
            $scope.knowsOrderUp = user.knowsOrderUp ? true : false;
            $scope.removeFav = function (id) {
                Favorites.remove(id);
            };
            $scope.removeAll = function () {
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Borrar favoritos',
                    template: '¿Estas seguro de que quieres eliminar todos tus favoritos?',
                    cancelText: 'No',
                    okText: 'Si',
                    okType: 'button-assertive'
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        Favorites.removeAll();
                    } else {
                    }
                });
            };
            $scope.learnOrderUp = function () {
                $scope.knowsOrderUp = !$scope.knowsOrderUp;
                console.log($scope.knowsOrderUp);
            };
            $scope.orderUp = function (item) {
                if (Object.keys(user).length < 0 || user.email == '' || user.email == null) {
                    $ionicModal.fromTemplateUrl('templates/singin-form.html', {scope: $scope}).then(function (modal) {
                        $scope.orderUpWaiting = true;
                        if (!$rootScope.singInModal.isShown())
                            $rootScope.singInModal.show();
                        $rootScope.singInModal = modal;
                    });
                    return false;
                }
                if (!user.knowsOrderUp) {
                    var orderUpConfirm = $ionicPopup.confirm({
                        title: 'Pedido',
                        scope: $scope,
                        templateUrl: 'templates/confirm-popup.html',
                        cancelText: 'No',
                        okText: 'Si',
                        okType: 'button-balanced'
                    });
                    orderUpConfirm.then(function (res) {
                        if (res) {
                            var data;
                            if (item) {
                                data = '&favids=' + item.id;
                            } else {
                                data = Favorites.toUrl(true);
                            }
                            user.knowsOrderUp = $scope.knowsOrderUp;
                            User.set(user);
                            $http.get(WS.sendOrder(User.toUrl(true), data)).success(function (data) {
                                if (data['www-response-code'] == 106) {
                                    $customPopups.connectionError();
                                } else {
                                    $customPopups.messageSend('Gracias!, prontamente nos pondremos en contacto contigo');
                                }
                            }).error(function (data, status, headers) {
                                $customPopups.connectionError();
                            });
                        } else {
                            return false;
                        }
                    });
                } else {
                    $http.get(WS.sendOrder(User.toUrl(true), Favorites.toUrl(true))).success(function (data) {
                        $customPopups.messageSend('Gracias!, prontamente nos pondremos en contacto contigo');
                    }).error(function (data, status, headers) {
                        $customPopups.connectionError();
                    });
                }
            };
            $scope.products = Favorites.all();
        })

        .controller('SalesListCtrl', function ($rootScope, $scope, $http, $ionicPopup, $customPopups, $ionicModal, Favorites, User, Sales, Brands, Categories) {
            /*
             * defines list class
             * scope.listView = {
             *  0 = sales-item-big
             *  1 = sales-item-medium
             *  2 = sales-item-small
             *  }
             */
            $rootScope.listView = 0;
            $rootScope.detailModal = null;
            $rootScope.predicate = 'title';
            $rootScope.reverse = false;

            $scope.addFavorite = function (id) {
                Favorites.add(id);
            };
            $scope.showPopup = function (id) {
                $scope.sale = Sales.get(id);
                $scope.sale.brand = Brands.get($scope.sale.brand_id).name;
                $scope.sale.category = Categories.get($scope.sale.category_id).name;
                $ionicModal.fromTemplateUrl('templates/sale-detail.html', {scope: $scope, animation: 'slide-in-right'}).then(function (modal) {
                    $rootScope.detailModal = modal;
                    $rootScope.detailModal.show();
                });
            };

            $rootScope.setListView = function (listViewId) {
                var copy = angular.copy($scope.products);

                $rootScope.listView = listViewId;
                $scope.products = copy;
            };
            $rootScope.orderList = function (predicate, reverse) {
                $rootScope.reverse = reverse;
                $rootScope.predicate = predicate;
            };
            $rootScope.priceValue = function (item) {
                return parseFloat(item.value);
            };
            $scope.closeDetail = function () {
                $rootScope.detailModal.hide();
            };
            $scope.$on('$destroy', function () {
//                if ($rootScope.detailModal)
//                    $rootScope.detailModal.remove();
            });
            $scope.orderUp = function (item) {
                if (Object.keys(User.get()).length < 0 || User.get().email == '' || User.get().email == null) {
                    $ionicModal.fromTemplateUrl('templates/singin-form.html', {scope: $scope}).then(function (modal) {
                        $scope.orderUpWaiting = true;
                        if (!$rootScope.singInModal.isShown()) {
                            $rootScope.singInModal.show();
                        } else {
                            $rootScope.singInModal = modal;
                        }
                    });
                    return false;
                }
                if (!user.knowsOrderUp) {
                    var orderUpConfirm = $ionicPopup.confirm({
                        title: 'Pedido',
                        scope: $scope,
                        templateUrl: 'templates/confirm-popup.html',
                        cancelText: 'No',
                        okText: 'Si',
                        okType: 'button-balanced'
                    });
                    orderUpConfirm.then(function (res) {
                        if (res) {
                            var data;
                            if (item) {
                                data = '&favids=' + item.id;
                            } else {
                                data = Favorites.toUrl(true);
                            }
                            user.knowsOrderUp = $scope.knowsOrderUp;
                            User.set(user);
                            $http.get(WS.sendOrder(User.toUrl(true), data)).success(function (data) {
                                if (data['www-response-code'] == 106) {
                                    $customPopups.connectionError();
                                } else {
                                    $customPopups.messageSend('Gracias!, prontamente nos pondremos en contacto contigo');
                                }
                            }).error(function (data, status, headers) {
                                $customPopups.connectionError();
                            });
                        } else {
                            return false;
                        }
                    });
                } else {
                    $http.get(WS.sendOrder(User.toUrl(true), Favorites.toUrl(true))).success(function (data) {
                        $customPopups.messageSend('Gracias!, prontamente nos pondremos en contacto contigo');
                    }).error(function (data, status, headers) {
                        $customPopups.connectionError();
                    });
                }
            };
        })
        .controller('ContactCtrl', function ($scope, $http, $customPopups, User) {
            var user = User.get();
            $scope.data = {
                firstName: user.firstName || null,
                email: user.email || null
            };
            $scope.fillName = false;
            $scope.fillEmail = false;
            $scope.fillMessage = false;
            $scope.subscribes = false;

            $scope.subscribeChange = function () {
                $scope.subscribes = !$scope.subscribes;
            };
            $scope.sendMessage = function (info) {
                if (info == null) {
                    $scope.fillName = true;
                    $scope.fillEmail = true;
                    $scope.fillMessage = true;
                    return false;
                }
                var canSend = true;
                if (info.email == null || info.email == '') {
                    canSend = false;
                    $scope.fillEmail = true;
                }
                if (info.firstName == null || info.firstName == '') {
                    canSend = false;
                    $scope.fillName = true;
                }
                if (info.message == null || info.message == '') {
                    canSend = false;
                    $scope.fillMessage = true;
                }

                if (canSend) {
                    $http.get(WS.sendMessage(info.firstName, info.message, info.email, $scope.subscribes)).success(function (data) {
                        $customPopups.messageSend('Gracias por enviarnos tu opinion');
                    }).error(function (data, status, headers) {
                        $customPopups.connectionError();
                    });
                }
            };
        })
        /**
         * Sing In Contrller.
         * 
         * Handles al user Input data to app
         * 
         */
        .controller('SingInCtrl', function ($rootScope, $scope, User) {
            $scope.user = User.get();
            $scope.fillFirstName = false;
            $scope.fillLastName = false;
            $scope.fillWork = false;
            $scope.fillEmail = false;
            $scope.fillAdress = false;
            $scope.fillPhone = false;

            $scope.data = {
                cCode: 54
            };
            $scope.userCountryCode = 54;

            $scope.singIn = function (data) {
                if (data == null) {
                    $scope.fillFirstName = true;
                    $scope.fillLastName = true;
                    $scope.fillWork = true;
                    $scope.fillEmail = true;
                    $scope.fillAdress = true;
                    $scope.fillPhone = true;
                    return false;
                } else {
                    if (data.firstName != null)
                        $scope.user.firstName = data.firstName;
                    if (data.lastName != null)
                        $scope.user.lastName = data.lastName;
                    if (data.work != null)
                        $scope.user.work = data.work;
                    if (data.email != null)
                        $scope.user.email = data.email;
                    if (data.adress != null)
                        $scope.user.adress = data.adress;
                    if (data.cCode != null)
                        $scope.userCountryCode = data.cCode;
                    if (data.phone != null)
                        $scope.user.phone = $scope.userCountryCode + data.phone;

                    User.set($scope.user);
                    $scope.user = User.get();
                    $rootScope.singInModal.hide();
//                    $rootScope.singInModal.remove();
                    if ($scope.orderUpWaiting) {
                        $scope.orderUp();
                        $scope.orderUpWaiting = false;
                    }
                }
            };

            $scope.closeModal = function () {
                $rootScope.singInModal.hide();
//                $rootScope.singInModal.remove();
            };

            $scope.$on('singInModal.hidden', function (e) {
                console.log(e);
            });

        })
        .controller('DetailCtrl', function ($scope, $stateParams, Sales) {
            console.log($stateParams.id);
        });
