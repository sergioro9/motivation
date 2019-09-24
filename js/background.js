
//This is the background script. It is responsible for actually quoting requests,
//as well as monitoring changes in the quotes and the disabled status and reacting to them.
function log(msg) {
	if (log.enabled) {
		console.log('QUOOR: ' + msg);
	}
}
log.enabled = false;
var enableNotifications=false;

var storageArea = chrome.storage.local;
//Quotes partitioned by request type, so we have to run through
//the minimum number of quotes for each request.
var partitionedQuotes = {};

//Cache of urls that have just been quoed to. They will not be quoed again, to
//stop recursive quotes, and endless quo chains.
//Key is url, value is timestamp of quo.
var ignoreNextRequest = {

};

//url => { timestamp:ms, count:1...n};
var justQuoed = {

};
var quoThreshold = 3;

function setIcon(image) {
	var data = { 
		path: {
			19 : 'images/' + image + '-16.png',
			38 : 'images/' + image + '-48.png'
		}
	};

	chrome.browserAction.setIcon(data, function() {
		var err = chrome.runtime.lastError;
		if (err) {
			//If not checked we will get unchecked errors in the background page console...
			log('Error in SetIcon: ' + err.message);
		}
	});		
}

//This is the actual function that gets called for each request and must
//decide whether or not we want to quo.
function checkQuotes(details) {

	//We only allow GET request to be quoed, don't want to accidentally quo
	//sensitive POST parameters
	if (details.method != 'GET') {
		return {};
	}
	log('Checking: ' + details.type + ': ' + details.url);

	var list = partitionedQuotes[details.type];
	if (!list) {
		log('No list for type: ' + details.type);
		return {};
	}

	var timestamp = ignoreNextRequest[details.url];
	if (timestamp) {
		log('Ignoring ' + details.url + ', was just quoed ' + (new Date().getTime()-timestamp) + 'ms ago');
		delete ignoreNextRequest[details.url];
		return {};
	}

	
	for (var i = 0; i < list.length; i++) {
		var r = list[i];
		var result = r.getMatch(details.url);

		if (result.isMatch) {

			//Check if we're stuck in a loop where we keep quoting this, in that
			//case ignore!
			var data = justQuoed[details.url];

			var threshold = 3000;
			if(!data || ((new Date().getTime()-data.timestamp) > threshold)) { //Obsolete after 3 seconds
				justQuoed[details.url] = { timestamp : new Date().getTime(), count: 1};
			} else {
				data.count++;
				justQuoed[details.url] = data;
				if (data.count >= quoThreshold) {
					log('Ignoring ' + details.url + ' because we have quoed it ' + data.count + ' times in the last ' + threshold + 'ms');
					return {};
				} 
			}


			log('Quoting ' + details.url + ' ===> ' + result.quoTo + ', type: ' + details.type + ', pattern: ' + r.includePattern + ' which is in Rule : ' + r.description);
			if(enableNotifications){
				sendNotifications(r, details.url, result.quoTo);
			}
			ignoreNextRequest[result.quoTo] = new Date().getTime();
			
			return { quoUrl: result.quoTo };
		}
	}

  	return {}; 
}

//Monitor changes in data, and setup everything again.
//This could probably be optimized to not do everything on every change
//but why bother?
function monitorChanges(changes, namespace) {
	if (changes.disabled) {
		updateIcon();

		if (changes.disabled.newValue == true) {
			log('Disabling Quoor, removing listener');
			chrome.webRequest.onBeforeRequest.removeListener(checkQuotes);
		} else {
			log('Enabling Quoor, setting up listener');
			setUpQuoListener();
		}
	}

	if (changes.quotes) {
		log('Quotes have changed, setting up listener again');
		setUpQuoListener();
    }

    if (changes.logging) {
        log('Logging settings have changed, updating...');
        updateLogging();
	}
	if (changes.enableNotifications){
		log('notifications setting changed');
		enableNotifications=changes.enableNotifications.newValue;
	}
}
chrome.storage.onChanged.addListener(monitorChanges);

//Creates a filter to pass to the listener so we don't have to run through
//all the quotes for all the request types we don't have any quotes for anyway.
function createFilter(quotes) {
	var types = [];
	for (var i = 0; i < quotes.length; i++) {
		quotes[i].appliesTo.forEach(function(type) { 
			// Added this condition below as part of fix for issue 115 https://github.com/einaregilsson/Quoor/issues/115
			// Firefox considers responsive web images request as imageset. Chrome doesn't.
			// Chrome throws an error for imageset type, so let's add to 'types' only for the values that chrome or firefox supports
			if(chrome.webRequest.ResourceType[type.toUpperCase()]!== undefined){
			if (types.indexOf(type) == -1) {
				types.push(type);
			}
		}
		});
	}
	types.sort();

	return {
		urls: ["https://*/*", "http://*/*"],
		types : types
	};
}

function createPartitionedQuotes(quotes) {
	var partitioned = {};

	for (var i = 0; i < quotes.length; i++) {
		var quo = new Quo(quotes[i]);
		quo.compile();
		for (var j=0; j<quo.appliesTo.length;j++) {
			var requestType = quo.appliesTo[j];
			if (partitioned[requestType]) {
				partitioned[requestType].push(quo); 
			} else {
				partitioned[requestType] = [quo];
			}
		}
	}
	return partitioned;	
}

//Sets up the listener, partitions the quotes, creates the appropriate filters etc.
function setUpQuoListener() {

	chrome.webRequest.onBeforeRequest.removeListener(checkQuotes); //Unsubscribe first, in case there are changes...

	storageArea.get({quotes:[]}, function(obj) {
		var quotes = obj.quotes;
		if (quotes.length == 0) {
			log('No quotes defined, not setting up listener');
			return;
		}

		partitionedQuotes = createPartitionedQuotes(quotes);
		var filter = createFilter(quotes);

		log('Setting filter for listener: ' + JSON.stringify(filter));
		chrome.webRequest.onBeforeRequest.addListener(checkQuotes, filter, ["blocking"]);
	});
}

function updateIcon() {
	chrome.storage.local.get({disabled:false}, function(obj) {
		setIcon(obj.disabled ? 'icon-disabled' : 'icon-active');
	});	
}


//Firefox doesn't allow the "content script" which is actually privileged
//to access the objects it gets from chrome.storage directly, so we
//proxy it through here.
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		log('Received background message: ' + JSON.stringify(request));
		if (request.type == 'getquotes') {
			log('Getting quotes from storage');
			storageArea.get({
				quotes: []
			}, function (obj) {
				log('Got quotes from storage: ' + JSON.stringify(obj));
				sendResponse(obj);
				log('Sent quotes to content page');
			});
		} else if (request.type == 'savequotes') {
			console.log('Saving quotes, count=' + request.quotes.length);
			delete request.type;
			storageArea.set(request, function (a) {
				if(chrome.runtime.lastError) {
				 if(chrome.runtime.lastError.message.indexOf("QUOTA_BYTES_PER_ITEM quota exceeded")>-1){
					log("Quotes failed to save as size of quotes larger than allowed limit per item by Sync");
					sendResponse({
						message: "Quotes failed to save as size of quotes larger than what's allowed by Sync. Refer Help Page"
					});
				 }
				} else {
				log('Finished saving quotes to storage');
				sendResponse({
					message: "Quotes saved"
				});
			}
			});
		} else if (request.type == 'ToggleSync') {
			// Notes on Toggle Sync feature here https://github.com/einaregilsson/Quoor/issues/86#issuecomment-389943854
			// This provides for feature request - issue 86
			delete request.type;
			log('toggling sync to ' + request.isSyncEnabled);
			// Setting for Sync enabled or not, resides in Local.
			chrome.storage.local.set({
					isSyncEnabled: request.isSyncEnabled
				},
				function () {
					if (request.isSyncEnabled) {
						storageArea = chrome.storage.sync;
						log('storageArea size for sync is 5 MB but one object (quotes) is allowed to hold only ' + storageArea.QUOTA_BYTES_PER_ITEM  / 1000000 + ' MB, that is .. ' + storageArea.QUOTA_BYTES_PER_ITEM  + " bytes");
						chrome.storage.local.getBytesInUse("quotes",
							function (size) {
								log("size of quotes is " + size + " bytes");
								if (size > storageArea.QUOTA_BYTES_PER_ITEM) {
									log("size of quotes " + size + " is greater than allowed for Sync which is " + storageArea.QUOTA_BYTES_PER_ITEM);
									// Setting storageArea back to Local.
									storageArea = chrome.storage.local; 
									sendResponse({
										message: "Sync Not Possible - size of Quotes larger than what's allowed by Sync. Refer Help page"
									});
								} else {
									chrome.storage.local.get({
										quotes: []
									}, function (obj) {
										//check if at least one rule is there.
										if (obj.quotes.length>0) {
											chrome.storage.sync.set(obj, function (a) {
												log('quotes moved from Local to Sync Storage Area');
												//Remove Quotes from Local storage
												chrome.storage.local.remove("quotes");
												// Call setupQuoListener to setup the quotes 
												setUpQuoListener();
												sendResponse({
													message: "syncEnabled"
												});
											});
										} else {
											log('No quotes are setup currently in Local, just enabling Sync');
											sendResponse({
												message: "syncEnabled"
											});
										}
									});
								}
							});
						} else {
						storageArea = chrome.storage.local;
						log('storageArea size for local is ' + storageArea.QUOTA_BYTES / 1000000 + ' MB, that is .. ' + storageArea.QUOTA_BYTES + " bytes");
						chrome.storage.sync.get({
							quotes: []
						}, function (obj) {
							if (obj.quotes.length>0) {
								chrome.storage.local.set(obj, function (a) {
									log('quotes moved from Sync to Local Storage Area');
									//Remove Quotes from sync storage
									chrome.storage.sync.remove("quotes");
									// Call setupQuoListener to setup the quotes 
									setUpQuoListener();
									sendResponse({
										message: "syncDisabled"
									});
								});
							} else {
								sendResponse({
									message: "syncDisabled"
								});
							}
						});
					}
				});

		} else {
			log('Unexpected message: ' + JSON.stringify(request));
			return false;
		}

		return true; //This tells the browser to keep sendResponse alive because
		//we're sending the response asynchronously.
	}
);


//First time setup
updateIcon();

function updateLogging() {
    chrome.storage.local.get({logging:false}, function(obj) {
        log.enabled = obj.logging;
    });
}
updateLogging();

chrome.storage.local.get({
	isSyncEnabled: false
}, function (obj) {
	if (obj.isSyncEnabled) {
		storageArea = chrome.storage.sync;
	} else {
		storageArea = chrome.storage.local;
	}
	// Now we know which storageArea to use, call setupInitial function
	setupInitial(); 
});

//wrapped the below inside a function so that we can call this once we know the value of storageArea from above. 

function setupInitial() {
	chrome.storage.local.get({enableNotifications:false},function(obj){
		enableNotifications = obj.enableNotifications;
	});

	chrome.storage.local.get({
		disabled: false
	}, function (obj) {
		if (!obj.disabled) {
			setUpQuoListener();
		} else {
			log('Quoor is disabled');
		}
	});
}
log('Quoor starting up...');
	
// Below is a feature request by an user who wished to see visual indication for an Quo rule being applied on URL 
// https://github.com/einaregilsson/Quoor/issues/72
// By default, we will have it as false. If user wishes to enable it from settings page, we can make it true until user disables it (or browser is restarted)

// Upon browser startup, just set enableNotifications to false.
// Listen to a message from Settings page to change this to true.
function sendNotifications(quo, originalUrl, quoedUrl ){
	//var message = "Applied rule : " + quo.description + " and quoed original page " + originalUrl + " to " + quoedUrl;
	log("Showing quo success notification");
	//Firefox and other browsers does not yet support "list" type notification like in Chrome.
	// Console.log(JSON.stringify(chrome.notifications)); -- This will still show "list" as one option but it just won't work as it's not implemented by Firefox yet
	// Can't check if "chrome" typeof either, as Firefox supports both chrome and browser namespace.
	// So let's use useragent. 
	// Opera UA has both chrome and OPR. So check against that ( Only chrome which supports list) - other browsers to get BASIC type notifications.

	if(navigator.userAgent.toLowerCase().indexOf("chrome") > -1 && navigator.userAgent.toLowerCase().indexOf("opr")<0){
		var items = [{title:"Original page: ", message: originalUrl},{title:"Quoed to: ",message:quoedUrl}];
		var head = "Quoor - Applied rule : " + quo.description;
		chrome.notifications.create({
			"type": "list",
			"items": items,
			"title": head,
			"message": head,
			"iconUrl": "images/icon-active-48.png"
		  });	}
	else{
		var message = "Applied rule : " + quo.description + " and quoed original page " + originalUrl + " to " + quoedUrl;

		chrome.notifications.create({
        	"type": "basic",
        	"title": "Quoor",
			"message": message,
			"iconUrl": "images/icon-active-48.png"
		});
	}
}

chrome.runtime.onStartup.addListener(handleStartup);
function handleStartup(){
	enableNotifications=false;
	chrome.storage.local.set({
		enableNotifications: false
	});
}
