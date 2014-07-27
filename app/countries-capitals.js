angular.module('CountriesCapitals', ['ngRoute'])

  .constant('CNC_API_CONFIG', {
    API_BASE: 'http://api.geonames.org',
    METHOD: 'JSONP',
    CALLBACK: 'JSON_CALLBACK',
    COUNTRY_ENDPOINT: '/countryInfoJSON',
    NEIGHBORS_ENDPOINT: '/neighboursJSON', // note UK spelling for endpoint
    CAPITAL_ENDPOINT: '/searchJSON',
    USERNAME: 'petejh'
  })

  .factory('cnc_GetGeonames', function($http, CNC_API_CONFIG) {
    return function(endpoint, queryParams) {
      var geonamesAttributes = [];
      var apiParams = {
        username: CNC_API_CONFIG.USERNAME,
        callback: CNC_API_CONFIG.CALLBACK
      };
      $http({
        method: CNC_API_CONFIG.METHOD,
        url: CNC_API_CONFIG.API_BASE + endpoint,
        params: angular.extend( apiParams, queryParams),
        cache: true
      }).success(function(response) {
        angular.copy(response.geonames, geonamesAttributes);
      });
      return geonamesAttributes;
    };
  })

  .factory('cnc_GetCountryDetails', function($http, CNC_API_CONFIG, cnc_GetGeonames) {
    return function(countryCode) {
      var queryParams = { country: countryCode };
      return cnc_GetGeonames(CNC_API_CONFIG.COUNTRY_ENDPOINT, queryParams);
    };
  })

  .factory('cnc_GetNeighbors', function($http, CNC_API_CONFIG, cnc_GetGeonames) {
    return function(countryCode) {
      var queryParams = { country: countryCode };
      return cnc_GetGeonames(CNC_API_CONFIG.NEIGHBORS_ENDPOINT, queryParams);
    };
  })

  .factory('cnc_GetCapitalDetails', function($http, CNC_API_CONFIG, cnc_GetGeonames) {
    return function(countryCode) {
      var queryParams = {
        featureCode: 'PPLC',
        country: countryCode
      };
      return cnc_GetGeonames(CNC_API_CONFIG.CAPITAL_ENDPOINT, queryParams);
    };
  })

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
          // TODO validate :countryCode against a list of known country codes
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

  .controller('CountriesCtrl', function($scope, cnc_GetCountryDetails) {
    $scope.countries = cnc_GetCountryDetails();
  })

  .controller('CapitalCtrl', function($scope, countryCode, cnc_GetCountryDetails, cnc_GetCapitalDetails, cnc_GetNeighbors) {
    $scope.countryCode = countryCode;
    $scope.countryDetails = cnc_GetCountryDetails(countryCode);
    $scope.capitalDetails = cnc_GetCapitalDetails(countryCode);
    $scope.neighbors = cnc_GetNeighbors(countryCode);
  });

