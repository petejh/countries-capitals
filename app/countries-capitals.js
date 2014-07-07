angular.module('CountriesCapitals', ['ngRoute'])

  .config(function($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'home.html'
    }).when('/countries', {
      templateUrl: 'countries.html'
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

  .controller('CapitalCtrl', function($scope, country) {
    $scope.country = country;
  });

