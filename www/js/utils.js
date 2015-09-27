angular.module('app.utils', [])

        .factory('$localStorage', ['$window', function ($window) {
                return {
                    set: function (key, value) {
                        $window.localStorage[key] = value;
                    },
                    get: function (key, defaultValue) {
                        return $window.localStorage[key] || defaultValue;
                    },
                    setObject: function (key, value) {
                        $window.localStorage[key] = JSON.stringify(value);
                    },
                    getObject: function (key) {
                        return JSON.parse($window.localStorage[key] || '{}');
                    }
                };
            }])
        .factory('$customPopups', ['$ionicPopup', function ($ionicPopup) {
                return {
                    messageSend: function (msg) {
                        return $ionicPopup.show({
                            title: 'Mensaje Enviado!',
                            subTitle: msg,
                            buttons: [
                                {text: 'Aceptar', type: 'button-stable'}
                            ]
                        });
                    },
                    connectionError: function () {
                        return $ionicPopup.show({
                            title: 'Error',
                            subTitle: 'Lo sentimos pero hubo un error en la conección',
                            buttons: [
                                {text: 'Aceptar', type: 'button-stable'}
                            ]
                        });
                    }
                };
            }]);