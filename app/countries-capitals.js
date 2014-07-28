angular.module('CountriesCapitals', ['ngRoute'])

  .constant('CNC_API_CONFIG', {
    API_BASE: 'http://api.geonames.org',
    METHOD: 'JSONP',
    CALLBACK: 'JSON_CALLBACK',
    COUNTRY_ENDPOINT: '/countryInfoJSON',
    NEIGHBORS_ENDPOINT: '/neighboursJSON', // note UK spelling for endpoint
    CAPITAL_ENDPOINT: '/searchJSON',
    TIMEZONE_ENDPOINT: '/timezoneJSON',
    USERNAME: 'petejh'
  })

  .factory('cnc_GetGeonames', function($q, $http, CNC_API_CONFIG) {
    return function(endpoint, queryParams) {
      var defer = $q.defer();
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
        defer.resolve(response);
      });
      return defer.promise;
    };
  })

  .factory('cnc_GetCountryDetails', function($http, CNC_API_CONFIG, cnc_GetGeonames) {
    return function(countryCode) {
      var queryParams = { country: countryCode };
      return cnc_GetGeonames(CNC_API_CONFIG.COUNTRY_ENDPOINT, queryParams)
        .then(function(countryDetails) {
          if (countryCode) {
            return countryDetails.geonames[0];
          } else {
            return countryDetails.geonames;
          }
        });
    };
  })

  .factory('cnc_GetNeighbors', function($http, CNC_API_CONFIG, cnc_GetGeonames) {
    return function(countryCode) {
      var queryParams = { country: countryCode };
      return cnc_GetGeonames(CNC_API_CONFIG.NEIGHBORS_ENDPOINT, queryParams)
        .then(function(neighbors) {
          return neighbors.geonames;
        });
    };
  })

  .factory('cnc_GetCapitalDetails', function($http, CNC_API_CONFIG, cnc_GetGeonames) {
    return function(countryCode) {
      var queryParams = {
        featureCode: 'PPLC',
        country: countryCode
      };
      return cnc_GetGeonames(CNC_API_CONFIG.CAPITAL_ENDPOINT, queryParams)
        .then(function(capitalDetails) {
          return capitalDetails.geonames[0];
        });
    };
  })

  .factory('cnc_GetTimezoneInfo', function($http, CNC_API_CONFIG, cnc_GetGeonames) {
    return function(latitude, longitude) {
      var queryParams = {
        lat: latitude,
        lng: longitude
      };
      return cnc_GetGeonames(CNC_API_CONFIG.TIMEZONE_ENDPOINT, queryParams)
        .then(function(timezoneInfo) {
          return timezoneInfo;
        });
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
    cnc_GetCountryDetails().then(function(result) {
      $scope.countries = result;
    });
  })

  .controller('CapitalCtrl', function($scope, countryCode, cnc_GetCountryDetails, cnc_GetCapitalDetails, cnc_GetNeighbors, cnc_GetTimezoneInfo) {
    $scope.countryCode = countryCode;

    cnc_GetCountryDetails(countryCode).then(function(countryDetails) {
      $scope.countryDetails = countryDetails;
    });

    cnc_GetCapitalDetails(countryCode).then(function(capitalDetails) {
      $scope.capitalDetails = capitalDetails;

      cnc_GetTimezoneInfo(capitalDetails.lat, capitalDetails.lng)
        .then(function(timezoneInfo) {
          $scope.timezoneInfo = timezoneInfo;
        });
    });

    cnc_GetNeighbors(countryCode).then(function(neighbors) {
      $scope.neighbors = neighbors;
    });
  });

