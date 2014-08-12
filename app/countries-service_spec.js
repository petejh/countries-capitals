describe("getCountryDetails service", function() {
  beforeEach(module('CountriesCapitals'));

  var countriesResponse = [{
    name: 'Germany',
    countryCode: 'DE'
  },{
    name:'Russia',
    countryCode: 'RU'
  },{
    name: 'United States',
    countryCode: 'US'
  }];

//  beforeEach(module('CountriesCapitals', function($provide) {
//    $provide.value('cnc_getGeonames', function(value) {
//      return value;
//    });
//  ));

  it('calls the countries endpoint of the Geonames API', inject(function($httpBackend, cnc_getCountryDetails) {
    $httpBackend.expect('JSONP', 'http://api.geonames.org/countryInfoJSON?callback=JSON_CALLBACK').respond(200);
    cnc_getCountryDetails();
    $httpBackend.flush();
  }));

  it('returns a list of countries with their details', inject(function($httpBackend, cnc_getCountryDetails) {
    $httpBackend.expectJSONP(/geonames/).respond(countriesResponse);
    var countries = cnc_getCountryDetails();
    $httpBackend.flush();
    expect(countries.length).toBe(3);
  }));
});

