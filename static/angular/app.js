'use strict';
/**
 * Created with Eighlark Innovations.
 * User: root
 * Date: 2/9/13
 * Time: 8:48 PM
 * Email: akshay.x666@gmail.com
 */

/**********************************************************************
 * Angular Application
 **********************************************************************/
var app = angular.module('ctApp', ['ngResource'])
    .config(function($routeProvider, $locationProvider, $httpProvider, $interpolateProvider) {
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
        //================================================
        // Check if the user is connected
        //================================================
        var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0')
                    $timeout(deferred.resolve, 0);

                // Not Authenticated
                else {
                    $rootScope.message = 'You need to log in.';
                    $timeout(function(){deferred.reject();}, 0);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };
        //================================================

        //================================================
        // Add an interceptor for AJAX errors
        //================================================
        $httpProvider.responseInterceptors.push(function($q, $location) {
            return function(promise) {
                return promise.then(
                    // Success: just return the response
                    function(response) {
                        return response;
                    },
                    // Error: check the error status to get only the 401
                    function(response) {
                        if (response.status === 401)
                            $location.url('/login');
                        return $q.reject(response);
                    }
                );
            }
        });
        //================================================

        //================================================
        // Define all the routes
        //================================================
        $routeProvider
            .when('/', {
                templateUrl: 'views/default.html'
            })
            .when('/tweet', {
                templateUrl: 'views/tweet.html',
                controller: 'TweetCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/login', {
                templateUrl: 'views/login.html'
//                controller: 'LoginCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
        //================================================

    }) // end of config()
    .run(function($rootScope, $http) {
        $rootScope.message = '';

        // Logout function is available in any pages
        $rootScope.logout = function() {
            $rootScope.message = 'Logged out.';
            $http.post('/logout');
        };
    });


///**********************************************************************
//* Login controller
//**********************************************************************/
//app.controller('LoginCtrl', function($scope, $rootScope, $http, $location) {
//    // This object will be filled by the form
//    $scope.user = {};
//
//    // Register the login() function
//    $scope.login = function() {
//        $http.post('/login', {
//            username: $scope.user.username,
//            password: $scope.user.password
//        })
//            .success(function(user) {
//                // No error: authentication OK
//                $rootScope.message = 'Authentication successful!';
//                $location.url('/tweet');
//            })
//            .error(function() {
//                // Error: authentication failed
//                $rootScope.message = 'Authentication failed.';
//                $location.url('/login');
//            });
//    };
//});



/**********************************************************************
 * Tweet controller
 **********************************************************************/
app.controller('TweetCtrl', function($scope, $http) {
    $http.get('/tweet/info').success(function(user) {
        $scope.user = user;
    })
});