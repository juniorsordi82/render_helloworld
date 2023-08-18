'use strict';
var app = angular.module('Sistema', ['ngRoute'
    , 'ngAnimate'
    , 'ngSanitize'
    , 'ngResource'
    , 'mgcrea.ngStrap'
    , 'ui.bootstrap'
    , "pascalprecht.translate"
    , 'ui.utils.masks'
]);
///#####################################################################################################
app.config(function ($controllerProvider) {
    app.controller = $controllerProvider.register;
});
///#####################################################################################################
app.run(function ($rootScope, $route, $http, $routeParams) {

});
///#####################################################################################################
app.run(['$location', '$rootScope', function ($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {

        if (current.hasOwnProperty('$$route')) {

            $rootScope.title = current.$$route.title;
        }
    });
}]);
///#####################################################################################################
var date = new Date().getTime().toString();
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider

        .when('/',                      { templateUrl: 'app/views/dashboard.html?t=' + date, controller: 'AppController' })
        .when('/empresa/usuarios',      { templateUrl: 'app/views/empresa/lista_usuarios.html?t=' + date, controller: 'AppController' })
        .when('/empresa/usuario/novo',  { templateUrl: 'app/views/empresa/cad_usuario.html?t=' + date, controller: 'AppController' })
        .when('/empresa/usuario/editar',  { templateUrl: 'app/views/empresa/cad_usuario.html?t=' + date, controller: 'AppController' })

        .when('/financeiro/contabancaria',  { templateUrl: 'app/views/financeiro/lista_contasbancarias.html?t=' + date, controller: 'FinanceiroCtrl', title: 'Contas Bancárias' })
        .when('/financeiro/contabancaria/novo',  { templateUrl: 'app/views/financeiro/cad_contasbancarias.html?t=' + date, controller: 'FinanceiroCtrl', title: 'Conta Bancária' })
        .otherwise({ templateUrl: 'app/views/Sistema/Erro_404.html' });
    // use the HTML5 History API
    //$locationProvider.html5Mode(true);
});