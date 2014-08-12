angular.module('CountriesCapitals', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'home.html'
    }).when('/countries', {
      templateUrl: 'countries.html',
      controller: 'CountriesCtrl'
    }).when('/countries/:countryCode/capital', {
      templateUrl: 'capital.html',
      controller: 'CapitalCtrl',
      resolve: {
        countryCode: function($route) {
          return $route.current.params.countryCode;
        }
      }
    }).when('/error', {
      templateUrl: '<p>Error: Page not found</p>'
    }).otherwise({
      redirectTo: '/error'
    });
  })

  .run(function($rootScope, $location) {
    $rootScope.$on('$routeChangeError', function() {
      $location.path('/error');
    });
  })

  .factory('cnc_getCountryDetails', function($http) {
    return function() {
      return $http({
        method: 'JSONP',
        url: 'http://api.geonames.org/countryInfoJSON',
        params: {
          callback: 'JSON_CALLBACK'
        }
      });
    };
  });

