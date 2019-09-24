quoApp.controller('DeleteQuoCtrl', ['$scope', function($s) {

	// Ok, this is pretty ugly. But I want to make this controller to control
	// everything about the deleting process, so I make this available on
	// the parent scope, so the QuoListCtrl can access it.
	$s.$parent.confirmDeleteQuo = function(index) {
		$s.quo = $s.quotes[index];
		$s.deleteIndex = index;
		$s.$parent.showDeleteForm = true;
	};

	$s.cancelDelete = function(index) {
		delete $s.quo;
		delete $s.deleteIndex;
		$s.$parent.showDeleteForm = false;
	}

	$s.deleteQuo = function() {
		$s.quotes.splice($s.deleteIndex, 1);
		delete $s.quo;
		delete $s.deleteIndex;
		$s.$parent.showDeleteForm = false;
		$s.saveChanges();
	};
}]);
