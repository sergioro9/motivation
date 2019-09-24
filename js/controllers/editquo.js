quoApp.controller('EditQuoCtrl', ['$scope', function($s) {
	

	$s.requestTypes = Quo.requestTypes;

	// Ok, this is pretty ugly. But I want to make this controller to control
	// everything about the editing process, so I make this available on
	// the parent scope, so the QuoListCtrl can access it.
	$s.$parent.editQuo = function(index) {
		$s.quo = new Quo($s.quotes[index]); 
		$s.editIndex = index;
		$s.quo.updateExampleResult();
		if ($s.quo.processMatches != 'noProcessing' || !($s.quo.appliesTo.length == 1 && $s.quo.appliesTo[0] == "main_frame")) {
			$s.showAdvanced = true; //Auto show advanced if quo uses advanced options
		}
		$s.$parent.showEditForm = true;
	};

	// Same, this is for the Create New button, which is starting
	// the edit form, so I want to control it from here.
	$s.$parent.createNewQuo = function() {
		$s.quo = new Quo({});
		$s.$parent.showEditForm = true;
	};

	/**
	 * Duplicates a quo.
	 * @param {Number} index 
	 */
	$s.$parent.duplicateQuo = function (index) {
		var quo = new Quo($s.quotes[index]);

		$s.quotes.splice(index + 1, 0, quo);

		quo.updateExampleResult();
		$s.saveChanges();
	}

	$s.saveQuo = function() {
		if ($s.quo.error) {
			return; //Button is already disabled, but we still get the click
		}

		//Just make sure it's freshly updated when saved
		$s.quo.updateExampleResult();

		if ($s.editIndex >= 0) {
			$s.quotes[$s.editIndex] = $s.quo;
		} else {
			$s.quotes.unshift($s.quo);
		}
		closeEditForm();
		$s.saveChanges();
	};

	$s.cancelEdit = function() {
		closeEditForm();
	}

	// To bind a list of strings to a list of checkboxes
	$s.appliesTo = function(key) {
		if (!$s.quo) {
			return;
		}
		return $s.quo.appliesTo.indexOf(key) != -1;
	};

	// Add or remove string from array based on whether checkbox is checked
	$s.toggleApplies = function(key) {
		if (!$s.quo) {
			return;
		}
		var arr = $s.quo.appliesTo;

		var index = arr.indexOf(key);
		if (index == -1) {
			arr.push(key);
		} else {
			arr.splice(index, 1);
		}

		var order = 'main_frame,sub_frame,stylesheet,script,image,imageset,object,xmlhttprequest,other';

		arr.sort(function(a,b) {
			return order.indexOf(a) - order.indexOf(b);
		});

		$s.quo.updateExampleResult();
	};
	
	function closeEditForm() {
		$s.editIndex = -1;
		$s.quo = null;
		$s.showAdvanced = false;
		$s.$parent.showEditForm = false;
	}
}]);
