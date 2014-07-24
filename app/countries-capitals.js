angular.module('CountriesCapitals', ['ngRoute'])

  .constant('CNC_API_BASE', 'http://api.geonames.org')
  .constant('CNC_COUNTRIES', '/countryInfoJSON')
  .constant('CNC_USERNAME', 'petejh')

  .factory('cnc_Countries', function($http, CNC_API_BASE, CNC_COUNTRIES, CNC_USERNAME) {
    return function() {
      var countries = [];
      $http({
        method: 'JSONP',
        url: CNC_API_BASE + CNC_COUNTRIES,
        params: {
          username: CNC_USERNAME,
          callback: 'JSON_CALLBACK'
        },
        cache: true
      }).success(function(response) {
          angular.copy(response.geonames, countries);
        })
      return countries;
    };
  })

  .config(function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'home.html'
    }).when('/countries', {
      templateUrl: 'countries.html',
      controller: 'CountriesCtrl'
    }).when('/countries/:country/capital', {
      templateUrl: 'capital.html',
      controller: 'CapitalCtrl',
      resolve: {
        country: function($route) {
          // TODO validate :country against a list of defined country codes
          return $route.current.params.country;
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

  .controller('CountriesCtrl', function($scope, cnc_Countries) {
    $scope.countries = cnc_Countries();
  })

  .controller('CapitalCtrl', function($scope, country) {
    $scope.country = country;
  });

