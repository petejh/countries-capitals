describe("routes", function() {
  beforeEach(module('CountriesCapitals'));

  describe("/ route", function() {
    it("loads the home page", inject(function($route, $httpBackend) {
      $httpBackend.expectGET('home.html').respond(200);
      $httpBackend.flush();
    }));
  });

  describe("/countries route", function() {
    var route, httpBackend, rootScope, location;

    beforeEach(inject(function($route, $httpBackend, $rootScope, $location) {
      route = $route;
      httpBackend = $httpBackend;
      rootScope = $rootScope;
      location = $location;
    }));

    it("loads the countries page", function() {
      httpBackend.expectGET('countries.html').respond(200);
      rootScope.$apply(function() {
        location.path('/countries');
      });
      httpBackend.flush();
      expect(route.current.templateUrl).toBe('countries.html');
    });

    it("loads the countries controller", function() {
      httpBackend.expectGET('countries.html').respond(200);
      rootScope.$apply(function() {
        location.path('/countries');
      });
      httpBackend.flush();
      expect(route.current.controller).toBe('CountriesCtrl');
    });
  });

  describe("/countries/:countryCode/capital route", function() {
    var route, httpBackend, rootScope, location;
    var code = "US";

    beforeEach(inject(function($route, $httpBackend, $rootScope, $location) {
      route = $route;
      httpBackend = $httpBackend;
      rootScope = $rootScope;
      location = $location;
    }));

    it("loads the capital page", function() {
      httpBackend.expectGET('capital.html').respond(200);
      rootScope.$apply(function() {
        location.path('/countries/' + code + '/capital');
      });
      httpBackend.flush();
      expect(route.current.templateUrl).toBe('capital.html');
    });

    it("loads the capital controller", function() {
      httpBackend.expectGET('capital.html').respond(200);
      rootScope.$apply(function() {
        location.path('/countries/' + code + '/capital');
      });
      httpBackend.flush();
      expect(route.current.controller).toBe('CapitalCtrl');
    });

    it("resolves the country code", function() {
      httpBackend.expectGET('capital.html').respond(200);
      rootScope.$apply(function() {
        location.path('/countries/' + code + '/capital');
      });
      httpBackend.flush();
      expect(route.current.params.countryCode).toBe(code);
    });
  });

  describe("/error route", function() {
    var route, httpBackend, rootScope, location;

    beforeEach(inject(function($route, $httpBackend, $rootScope, $location) {
      route = $route;
      httpBackend = $httpBackend;
      rootScope = $rootScope;
      location = $location;
    }));

    it("displays an error message", function() {
      httpBackend.expectGET(/error/i).respond(200);
      rootScope.$apply(function() {
        location.path('/error');
      });
      httpBackend.flush();
      expect(route.current.templateUrl).toContain('Error');
    });

    it("loads the error page on a failed route", function() {
      expect(location.path()).not.toBe('/error');
      rootScope.$emit('$routeChangeError');
      expect(location.path()).toBe('/error');
    });
  });

  describe("undefined routes", function() {
    var route, httpBackend, rootScope, location;

    beforeEach(inject(function($route, $httpBackend, $rootScope, $location) {
      route = $route;
      httpBackend = $httpBackend;
      rootScope = $rootScope;
      location = $location;
    }));

    it("redirects to the error page", function() {
      httpBackend.expectGET(/error/i).respond(200);
      rootScope.$apply(function() {
        location.path('/invalidpath');
      });
      httpBackend.flush();
    });
  });
});

