
//This controller, and associated directives and config, are responsible for import and exporting quotes
//from .json files.

quoApp.config([
    '$compileProvider',
    function($compileProvider) {   
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|data):/);
    }]
).directive('fileselected', function() { //Directive for file upload:
    return {
        restrict: 'A',
        link: function(scope, element, attr, ctrl) {
            element.bind('change', function(e) {
            	var f = element[0].files[0];
            	element[0].value = '';
            	scope.$eval(attr.fileselected, {'$file':f});
            });
        }
    }
}).controller('ImportExportCtrl', ['$scope', function($s) {

	// Shows a message explaining how many quotes were imported.
	function showImportedMessage(imported, existing) {
		if (imported == 0 && existing == 0) {
			$s.showMessage('No quotes existed in the file.');
		}
		if (imported > 0 && existing == 0) {
			$s.showMessage('Successfully imported ' + imported + ' quo' + (imported > 1 ? 's.' : '.'), true);
		}
		if (imported == 0 && existing > 0) {
			$s.showMessage('All quotes in the file already existed and were ignored.');
		}
		if (imported > 0 && existing > 0) {
			var m = 'Successfully imported ' + imported + ' quo' + (imported > 1 ? 's' : '') + '. ';
			if (existing == 1) {
				m += '1 quo already existed and was ignored.';
			} else {
				m += existing + ' quotes already existed and were ignored.'; 
			}
			$s.showMessage(m, true);
		}
	}

 	$s.importQuotes = function(file) {
 		if (!file) {
 			return;
 		}
 		var reader = new FileReader();
 		
 		reader.onload = function(e) {
 			var data;
 			try {
	 			data = JSON.parse(reader.result);
 			} catch(e) {
 				$s.showMessage('Failed to parse JSON data, invalid JSON: ' + (e.message||'').substr(0,100));
	 			return $s.$parent.$apply();
 			}

 			if (!data.quotes) {
 				$s.showMessage('Invalid JSON, missing "quotes" property');
 				return $s.$parent.$apply();
 			}

 			var imported = 0, existing = 0;
 			for (var i = 0; i < data.quotes.length; i++) {
 				var r = new Quo(data.quotes[i]);
 				r.updateExampleResult();
 				if ($s.quotes.some(function(i) { return new Quo(i).equals(r);})) {
 					existing++;
 				} else {
	 				$s.quotes.push(r.toObject());
	 				imported++;
 				}
 			}
 			
 			showImportedMessage(imported, existing);

 			$s.saveChanges();
 			$s.$parent.$apply();
  		};
  		try {
	 		reader.readAsText(file, 'utf-8');
  		} catch(e) {
  			$s.showMessage('Failed to read import file');
  		}
 	}

 	// Updates the export link with a data url containing all the quotes.
 	// We want to have the href updated instead of just generated on click to
 	// allow people to right click and choose Save As...
 	$s.updateExportLink =  function() {
		var quotes = $s.quotes.map(function(r) {
 			return new Quo(r).toObject();
 		});
 		
 		var exportObj = { 
 			createdBy : 'Quo v' + chrome.runtime.getManifest().version, 
 			createdAt : new Date(), 
 			quotes : quotes 
 		};
 		
 		var json = JSON.stringify(exportObj, null, 4);
 		
 		//Using encodeURIComponent here instead of base64 because base64 always messed up our encoding for some reason...
 		$s.quoDownload = 'data:text/plain;charset=utf-8,' + encodeURIComponent(json); 
 	}

 	$s.updateExportLink(); //Run once so the a will have a href to begin with
}]);
