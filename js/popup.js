
angular.module('popupApp', []).controller('PopupCtrl', ['$scope', function($s) {

	var storage = chrome.storage.local; //TODO: Change to sync when Firefox supports it...
	
	storage.get({disabled:false}, function(obj) {
		$s.disabled = obj.disabled;
		$s.$apply();
	});

	$s.toggleDisabled = function() {
		storage.get({disabled:false}, function(obj) {
			storage.set({disabled:!obj.disabled});
		  	$s.disabled = !obj.disabled;
		  	$s.$apply();
		});
    };

	$s.openQuoSettings = function() {

		//switch to open one if we have it to minimize conflicts
		var url = chrome.extension.getURL('quo.html');
		
		//FIREFOXBUG: Firefox chokes on url:url filter if the url is a moz-extension:// url
		//so we don't use that, do it the more manual way instead.
		chrome.tabs.query({currentWindow:true}, function(tabs) {
			for (var i=0; i < tabs.length; i++) {
				if (tabs[i].url == url) {
					chrome.tabs.update(tabs[i].id, {active:true}, function(tab) {
						close();
					});
					return;
				}
			}

			chrome.tabs.create({url:url, active:true});
		});
		return;
	};
}]);
