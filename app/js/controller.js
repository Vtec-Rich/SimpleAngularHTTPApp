var app = angular.module('WeatherApp', []);

app.controller('WeatherController', function( $scope, $http ) {

	$scope.cities = [
	    {
		    city: 'London, UK',
		    request: 'London,uk'
		}, {
		    city: 'Amsterdam, Netherlands',
		    request: 'Amsterdam,nl'
		}, {
		    city: 'Paris, France',
		    request: 'Paris,fr'
		}, {
		    city: 'Milan, Italy',
		    request: 'Milan,it'
		}, {
		    city: 'Frankfurt, Germany',
		    request: 'Frankfurt,gr'
		}
	];

	angular.forEach($scope.cities, function(value, key) {
		var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?q="+ $scope.cities[key].request +"&units=metric&appid=3d8b309701a13f65b660fa2c64cdc517";
		$http({
			method: 'GET',
			url: weatherUrl
		}).then(function successCallback(response) {
			$scope.cities[key].averageTemp = response.data.main.temp;
			$scope.cities[key].windStrength = response.data.wind.speed;
		}, function errorCallback(response) {
			$scope.error = "An error has occurred"
		});
				
	});

	$scope.showDetails = function(city, hours) {
		$('.forecast').fadeIn('fast');
		
		var detailUrl = "http://api.openweathermap.org/data/2.5/forecast?q="+ city +"&units=metric&appid=3d8b309701a13f65b660fa2c64cdc517";
		$http({
			method: 'GET',
			url: detailUrl
		}).then(function successCallback(response) {
			// quick logic to work out hours ahead message to be shown in ui
			var hoursAhead = 3;
			if (!hours) {
				hours = "0";
			} else if (hours == 39) {
				hours = response.data.list.length - 1;
				hoursAhead = hours * 3; //approx 5 days but is simply the array length times 3 to get hours
			} else {
				hoursAhead = (hours + 1) * 3; //add one 'chunk' for zero based index
			}

			$scope.cityName = response.data.city.name;
			$scope.hours = hoursAhead;
			$scope.forecast = response.data.list[hours].weather["0"].description;
			$scope.temp = response.data.list[hours].main.temp;
			$scope.humidity = response.data.list[hours].main.humidity;
			$scope.wind = response.data.list[hours].wind.speed;
			$scope.clouds = response.data.list[hours].clouds.all;
		}, function errorCallback(response) {
			$scope.error = "An error has occurred"
		});
	}
	
});