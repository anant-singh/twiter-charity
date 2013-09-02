/**
 * Created with Eighlark Innovations.
 * User: root
 * Date: 2/9/13
 * Time: 8:53 PM
 * Email: akshay.x666@gmail.com
 */
angular.module("tchApp").controller('HomeCtrl', function($scope, $http) {
    $scope.tchAccount = {};
    $scope.submit = function() {
        $http.post('/home', $scope.tchAccount).
            success(function(data) {
                if (data.accountCreated) {
                    $scope.tchAccount = {};
                }
            });
    }
});