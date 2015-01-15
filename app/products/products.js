/**
 * Created by luis_blanco on 1/13/2015.
 */
angular.module("exampleApp", ["increment", "ngResource", "ui.bootstrap", "angularUtils.directives.dirPagination"])
    //.constant("baseUrl", "http://localhost:5500/products/")
    .constant("baseUrl", "http://localhost:51923/api/products/")
    .config(function(paginationTemplateProvider){
        paginationTemplateProvider.setPath('app/views/dirPagination.tpl.html');
    })
    .controller("defaultCtrl", function ($scope, $http, $resource, baseUrl) {

        $scope.displayMode = "list";
        $scope.currentProduct = null;

        $scope.totalCount = 0;
        $scope.pageSize = 10;
        $scope.totalPages = 0;
        $scope.currentPage = 1;

        //$scope.productsResource = $resource(baseUrl + ":id", {id: "@id"}, {'query': {method: 'GET', isArray: false}});

        function getResultsPage(currentPage){
            var queryParams = '{ pageNumber: ' + currentPage + ', pageSize: ' + $scope.pageSize + '}';
            console.log(queryParams);
            var productsResource = $resource(baseUrl + ":id", {id: "@id"}, {'query': {method: 'GET', isArray: false, 'params' : {'pageNumber': currentPage, 'pageSize': $scope.pageSize} }});
            $scope.products =productsResource.query();
            $scope.products.$promise.then(function (data){
                console.dir('products: '+ data.products);
                console.log('totalCount: ' + data.totalCount);
                console.log('totalPages:' + data.totalPages);
                $scope.totalCount = data.totalCount;
                $scope.totalPages = data.totalPages;
                $scope.currentPage = $scope.currentPage;
                $scope.products = data.products;
            });
        };

        getResultsPage(1);

        $scope.pageChanged = function(currentPage) {
            getResultsPage(currentPage);
        };

        $scope.pagination = {
            current: 1
        };

        //$scope.pageChanged = function(newPage) {
        //    getResultsPage(newPage);
        //};

        // This works!
        //$scope.listProducts = function(){
        //    $scope.products = $scope.productsResource.query({ pageNumber: 1, pageSize: 11});
        //    $scope.products.$promise.then(function (data){
        //        console.log(data.products);
        //        console.log(data.totalCount);
        //        console.log(data.totalPages);
        //        $scope.totalCount = data.totalCount;
        //        $scope.totalPages = data.totalPages;
        //        $scope.currentPage = $scope.currentPage;
        //        $scope.products = data.products;
        //    });
        //};

        //$scope.listProducts = function(){
        //    $scope.productsResource.query({ pageNumber: 1, pageSize: 11}, function(data){
        //        console.log(data);
        //        $scope.products = data.products;
        //    });
        //};

        //$scope.listProducts = function () {
        //    $scope.productsResource.query({ pageNumber: 2, pageSize: 7 }, function (data){
        //        console.log(data);
        //        $scope.products = data.products;
        //    });
        //};

        //$scope.listProducts = function () {
        //    $scope.products = [
        //        {id: 0, name: "Dummy1", category: "Test", description: "blah", price: 1.25},
        //        {id: 0, name: "Dummy2", category: "Test", description: "blah", price: 2.05},
        //        {id: 0, name: "Dummy3", category: "Test", description: "blah", price: 3.45},
        //        {id: 0, name: "Dummy4", category: "Test", description: "blah", price: 7.25},
        //        {id: 0, name: "Dummy5", category: "Test", description: "blah", price: 5.50},
        //        {id: 0, name: "Dummy6", category: "Test", description: "blah", price: 10.75}
        //    ];
        //};

        //$scope.deleteProduct = function (product) {
        //    $scope.products.splice($scope.products.indexOf(product), 1);
        //};

        $scope.deleteProduct = function (product) {
            product.$delete().then(function () {
                $scope.products.splice($scope.products.indexOf(product), 1);
            });
            $scope.displayMode = "list";
        };

        $scope.createProduct = function (product) {
            new $scope.productsResource(product).$save().then(function (newProduct) {
                $scope.products.push(newProduct);
                $scope.displayMode = "list";
            })
        };

        //$scope.createProduct = function (product) {
        //    $scope.products.push(product);
        //    $scope.displayMode = "list";
        //};

        $scope.updateProduct = function (product) {
            product.$save();
            $scope.displayMode = "list";
        };

        //$scope.updateProduct = function (product) {
        //    for (var i = 0; i < $scope.products.length; i++) {
        //        if ($scope.products[i].id == product.id) {
        //            $scope.products[i] = product;
        //            break;
        //        }
        //    }
        //    $scope.displayMode = "list";
        //};

        $scope.editOrCreateProduct = function (product) {
            $scope.currentProduct = product ? product : {};
            $scope.displayMode = "edit";
        };

        //$scope.editOrCreateProduct = function (product) {
        //    $scope.currentProduct = product ? angular.copy(product) : {};
        //    $scope.displayMode = "edit";
        //};

        $scope.saveEdit = function (product) {
            if (angular.isDefined(product.id)) {
                $scope.updateProduct(product);
            }
            else {
                $scope.createProduct(product);
            }
        };

        $scope.cancelEdit = function () {
            if ($scope.currentProduct && $scope.currentProduct.$get) {
                $scope.currentProduct.$get();
            }
            $scope.currentProduct = {};
            $scope.displayMode = "list";
        };

        //$scope.cancelEdit = function () {
        //    $scope.currentProduct = {};
        //    $scope.displayMode = "list";
        //};

        // This works!
        //$scope.listProducts();

    });