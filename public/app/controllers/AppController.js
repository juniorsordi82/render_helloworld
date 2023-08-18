app.controller("AppController", function ($scope, $rootScope, $routeParams, $window, $resource, $modal, $translate, $http) {
    $scope.version = "2023 r35";
    $scope.form = {};

    $scope.loggedUser = {
        id_empresa: 1,
        idUser: 2,
        name: 'Dilson Sordi Junior',
        mail: 'juniorsordi@gmail.com',
        accessLevel: 'Administrador',
        photo: 'uploads/photos/64d64b2b3369ff506206a0ae1f206ab3171d1afe.png?1561438316'
    };

    $scope.initApp = function() {

    }

    $scope.teste1 = function() {
        var user = localStorage.getItem("user");
        $http.post("api/auth/testMongo", user).then(function(resp) {

        });
    }

    $scope.initNovoUsuario = function() {
        if ($rootScope.selectedUser) {
            $scope.form = $rootScope.selectedUser;
        } else {

        }
    }

    $scope.salvarUsuario = function(form) {
        if ($rootScope.selectedUser) {
            $http.put("api/v1/empresa/usuario", form).then(function (resp) {
                if (resp.data.modifiedCount > 0) {
                    $rootScope.selectedUser = {};
                    location.href = "#!/empresa/usuarios";
                }
            });
        } else {
            form.id_empresa = $scope.loggedUser.id_empresa;
            form.foto = null;
            $http.post("api/v1/empresa/usuario", form).then(function (resp) {
                alert(resp.data.Msg);
            });
        }
        
    }

    $scope.listarUsuarios = function() {
        $http.get("api/v1/empresa/usuario").then(function (resp) {
            $scope.usersList = resp.data;
        });
    }

    $scope.viewUsuario = function(item) {
        $rootScope.selectedUser = item;
        console.log($rootScope.selectedUser);
        location.href = "#!/empresa/usuario/editar";
    }


});
///##############################################################################################################################
app.controller("FinanceiroCtrl", function ($scope, $rootScope, $http) {
    $scope.form = {
        saldo_inicial: 0,
        limite: 0
    };

    $scope.tiposContasBancarias = [
        { id: 1, nome: 'Conta Corrente' },
        { id: 2, nome: 'Conta Poupança' },
        { id: 3, nome: 'Cartão Crédito' },
        { id: 4, nome: 'Conta Salário' },
    ];

    $scope.init = function() {
        $http.get("/api/v1/financeiro/contabancaria").then(function (resp) {
            $scope.accountsList = resp.data;
        })
    }

    $scope.salvarContaBancaria = function(form) {
        console.log(form);
        $http.post("/api/v1/financeiro/contabancaria", form).then(function(resp) {
            alert(resp.data.Msg);
        })
    }

    $scope.init();
});
///##############################################################################################################################
///##############################################################################################################################
///##############################################################################################################################