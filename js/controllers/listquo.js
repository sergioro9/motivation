// This controller is responsible for the list of quotes and the actions
// that can be taken from there.
quoApp.filter('requestTypeDisplay', function() { //Filter for displaying nice names for request types
	return function(input) {
		return input.map(function(key) { return Quo.requestTypes[key]; }).join(', ');
	}
}).controller('ListQuotesCtrl', ['$scope', function($s) {
	
	function swap(arr, i, n) {
		var item = arr[i];
		arr[i] = arr[n];
		arr[n] = item;
	}

	// Move the quo at index up in the list, giving it higher priority
	$s.moveUp = function(index) {
		if (index == 0) {
			return;
		}
		swap($s.quotes, index, index-1);
		$s.saveChanges();
	};

	// Move the quo at index down in the list, giving it lower priority
	$s.moveDown = function(index) {
		if (index == $s.quotes.length-1) {
			return;
		}
		swap($s.quotes, index, index+1);
		$s.saveChanges();
	};

	$s.toggleDisabled = function(quo) {
		quo.disabled = !quo.disabled;
		$s.saveChanges();
	};

	$s.example = function(quo) {
		return new Quo(quo).getMatch(quo.exampleUrl).quoTo;
	};

	//Edit button is defined in EditQuoCtrl
	//Delete button is defined in DeleteQuoCtrl
}]);
