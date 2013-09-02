/**
 * Created with Eighlark Innovations.
 * User: root
 * Date: 2/9/13
 * Time: 8:48 PM
 * Email: akshay.x666@gmail.com
 */
var app = angular.module('tchApp', ['ui-bootstrap']).
    config(function($interpolateProvider){
        $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
    },
    ['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
        $routeProvider.
            when('/home', {
                controller: HomeCtrl
            });
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix("#!");
    }]
);