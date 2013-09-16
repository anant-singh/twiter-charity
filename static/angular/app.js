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
var app = angular.module('ctApp', ['ui.bootstrap'])
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
                if (user !== '0') {
                    $rootScope.loggedIn = true;
                    $rootScope.userName = user.displayName;
                    $timeout(deferred.resolve, 0);
                }

                // Not Authenticated
                else {
                    $rootScope.message = 'You need to log in.';
                    $rootScope.loggedIn = false;
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
                templateUrl: 'views/default.html',
                controller: 'DefaultCtrl'
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
            .when('/stage', {
                templateUrl: 'views/stage.html',
                controller: 'StageCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/register', {
                templateUrl: 'views/register.html',
                controller: 'RegisterCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
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

/**
 * **********************************************************************
 * *************************** Controllers ******************************
 * **********************************************************************
 */
/**********************************************************************
* Default controller
**********************************************************************/
app.controller('DefaultCtrl', function($scope, $http) {
    $scope.timeline = {};
    $scope.user = {};
    $http.get('/tweet/info').success(function(user) {
        $scope.user = user;
    })
    $http.get('/tweet/timeline')
        .success(function(data) {
            $scope.timeline.tweets = data;
        });
});



/**********************************************************************
 * Tweet controller
 **********************************************************************/
app.controller('TweetCtrl', function($scope, $http) {
    $scope.dataStream = {};
    $scope.timeline = {};
    $scope.alerts = [];
    $scope.user = {};

    $http.get('/tweet/info').success(function(user) {
        $scope.user = user;
    })

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.encode = function(url) {
        return encodeURI(url);
    }

    $scope.submit = function() {
        if ($scope.dataStream.tweet.length > 140) {
            $scope.alerts.push({type: 'danger', msg: 'Tweet Length should not exceed 140 characters'});
        } else if (typeof $scope.dataStream.dateToTweet === 'undefined') {
            $scope.alerts.push({type: 'danger', msg: 'Oops! Please select a nice date to tweet'});
        } else if (moment($scope.dataStream.timeToTweet).isBefore(moment())) {
            $scope.alerts.push({type: 'danger', msg: 'Oops! Please select a nice time to tweet'});
        } else $http.
            post('/tweet/data', $scope.dataStream)
            .success(function (status) {
                $scope.alerts.push(status);
            });
    }

    /**
     * ********************************************************
     * Tweet Timeline Start
     * ********************************************************
     */

    $http.
        get('/tweet/timeline')
        .success(function(data) {
            $scope.timeline.tweets = data;
            $scope.term = '@' + $scope.user.username;
        });

    /**
     * ********************************************************
     * Tweet Timeline End
     * ********************************************************
     */


    /**
     * DataPicker Function
     */
    $scope.today = function() {
        $scope.dataStream.dateToTweet = new Date();
    };
    $scope.today();

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
        $scope.showWeeks = ! $scope.showWeeks;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function() {
        $timeout(function() {
            $scope.opened = true;
        });
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    /**
     * TimePicker Controller
     */
    $scope.dataStream.timeToTweet = new Date();

    $scope.hstep = 1;
    $scope.mstep = 5;

    $scope.ismeridian = true;
    $scope.toggleMode = function() {
        $scope.ismeridian = ! $scope.ismeridian;
    };

    $scope.update = function() {
        var d = new Date();
        d.setHours( 14 );
        d.setMinutes( 0 );
        $scope.dataStream.timeToTweet = d;
    };

    $scope.changed = function () {
        console.log('Time changed to: ' + $scope.dataStream.timeToTweet);
    };
});

/**********************************************************************
 * Stage controller
 **********************************************************************/
app.controller('StageCtrl', function($scope, $rootScope, $http, $location) {
    $http.get('/tweet/info').success(function(user) {
        $scope.user = user;
    })
    $http.get('/check/reg')
        .success(function(res) {
            $location.url('/tweet');
        })
        .error(function() {
            $location.url('/register');
        })
});

/**********************************************************************
 * Register controller
 **********************************************************************/
app.controller('RegisterCtrl', function($scope, $rootScope, $http, $location) {
    $scope.account = {};
    $scope.alerts = [];

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.submit = function() {
        $http.
            post('/account/data', $scope.account)
            .success(function(status) {
                $location.url('/tweet');
            })
    }
});