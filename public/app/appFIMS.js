'use strict';
var app = angular.module('Sistema', ['ngRoute'
    , 'ngAnimate'
    , 'ngSanitize'
    , 'ngResource'
]);
///#####################################################################################################
app.config(function ($controllerProvider) {
    app.controller = $controllerProvider.register;
});
///#####################################################################################################
app.run(function ($rootScope, $route, $http, $routeParams) {

});
///#####################################################################################################
///#####################################################################################################
var date = new Date().getTime().toString();
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider

        .when('/', { templateUrl: 'app/views/dashboard.html?t=' + date, controller: 'AppController' })

        .otherwise({ templateUrl: 'app/views/Sistema/Erro_404.html' });
    // use the HTML5 History API
    //$locationProvider.html5Mode(true);
});
///#####################################################################################################
app.directive("selectNgFiles", function () {
    return {
        require: "ngModel",
        link: function postLink(scope, elem, attrs, ngModel) {
            elem.on("change", function (e) {
                var files = elem[0].files;
                ngModel.$setViewValue(files);
            })
        }
    }
});
///#####################################################################################################
app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
///#####################################################################################################
app.directive('file', function () {
    return {
        scope: {
            file: '='
        },
        link: function (scope, el, attrs) {
            el.bind('change', function (event) {
                var file = event.target.files[0];
                scope.file = file ? file : undefined;
                scope.$apply();
            });
        }
    };
});
///#####################################################################################################
app.controller("AppController", function ($scope, $rootScope, $routeParams, $window, $resource, $http) {
    $scope.version = "1.0.0";
    $scope.formAdata = {};
    $scope.form = {
        airWaybill: 8888888888,
        custCode: "181459840",
        serviceId: "DV79CR2QTZ5EXAH",
        labelType: 41
    };
    $scope.filesArray = [];

    $scope.labelsTypes = [
        { id: 41, label: 'Mail View Item Under 4 Pounds'},
        { id: 42, label: 'Mail View Item 4 Pounds +'},
        //{ id: 43, label: 'Standard FIMS Under 4.4 Pounds'},
        //{ id: 44, label: 'Premium FIMS Under 4.4 Pounds'},
        //{ id: 45, label: 'FIMS Over 4.4 Pounds'},
        { id: 51, label: 'Mail View Premium with Milestone Tracking'},
    ]

    $scope.submit_form = function () {
        var fd = new FormData();
        var file = $scope.myFile;
        fd.append('file', file);
        fd.append('info', JSON.stringify($scope.form));

        $http.post("api/fims/uploadfile", fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function (resp) {
            $scope.CSV = resp.data.CSV;
            $scope.jsonData = resp.data.data;
        });
    }

    $scope.createLabelAPI = function(item) {
        $http.post("api/fims/createLabelAPI", item).then(function (resp) {
            console.log(resp.data);
            item.pdf = resp.data.data.pdf;
        });
    }

});
