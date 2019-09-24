
function Quo(o) {
	this._init(o);
}

//temp, allow addon sdk to require this.
if (typeof exports !== 'undefined') {
	exports.Quo = Quo;
}

//Static
Quo.WILDCARD = 'W';
Quo.REGEX = 'R';

Quo.requestTypes = {
	main_frame: "Main window (address bar)",
	sub_frame: "IFrames",
	stylesheet : "Stylesheets",
	script : "Scripts",
	image : "Images",
	imageset: "Responsive Images in Firefox",
	object : "Objects (e.g. Flash videos, Java applets)",
	xmlhttprequest : "XMLHttpRequests (Ajax)",
	other : "Other"
};


Quo.prototype = {
	
	//attributes
	description : '',
	exampleUrl : '',
	exampleResult : '',
	error : null,
	includePattern : '',
	excludePattern : '',
	patternDesc:'',
	quoUrl : '',
	patternType : '',
	processMatches : 'noProcessing',
	disabled : false,
	
	compile : function() {

		var incPattern = this._preparePattern(this.includePattern);
		var excPattern = this._preparePattern(this.excludePattern);

		if (incPattern) {
			this._rxInclude = new RegExp(incPattern, 'gi');
		}
		if (excPattern) {
			this._rxExclude = new RegExp(excPattern, 'gi');
		}
	},

	equals : function(quo) {
		return this.description == quo.description
			&& this.exampleUrl == quo.exampleUrl
			&& this.includePattern == quo.includePattern
			&& this.excludePattern == quo.excludePattern
			&& this.patternDesc == quo.patternDesc
			&& this.quoUrl == quo.quoUrl
			&& this.patternType == quo.patternType
			&& this.processMatches == quo.processMatches
			&& this.appliesTo.toString() == quo.appliesTo.toString();
	},
	
	toObject : function() {
		return {
			description : this.description,
			exampleUrl : this.exampleUrl,
			exampleResult : this.exampleResult,
			error : this.error,
			includePattern : this.includePattern,
			excludePattern : this.excludePattern,
			patternDesc : this.patternDesc,
			quoUrl : this.quoUrl,
			patternType : this.patternType,
			processMatches : this.processMatches,
			disabled : this.disabled,
			appliesTo : this.appliesTo.slice(0)
		};
	},

	getMatch: function(url, forceIgnoreDisabled) {
		if (!this._rxInclude) {
			this.compile();
		}
		var result = { 
			isMatch : false, 
			isExcludeMatch : false, 
			isDisabledMatch : false, 
			quoTo : '',
			toString : function() { return JSON.stringify(this); }
		};
		var quoTo = null;

		quoTo = this._includeMatch(url);
		if (quoTo !== null) {
			if (this.disabled && !forceIgnoreDisabled) {
				result.isDisabledMatch = true;
			} else if (this._excludeMatch(url)) {
				result.isExcludeMatch = true;
			} else {
				result.isMatch = true;
				result.quoTo = quoTo;
			}
		}
		return result;	 
	},
	
	//Updates the .exampleResult field or the .error
	//field depending on if the example url and patterns match 
	//and make a good quo
	updateExampleResult : function() {

		//Default values
		this.error = null;
		this.exampleResult = '';


		if (!this.exampleUrl) {
			this.error = 'No example URL defined.';
			return;
		}

		if (this.patternType == Quo.REGEX && this.includePattern) {
			try {
				new RegExp(this.includePattern, 'gi');
			} catch(e) {
				this.error = 'Invalid regular expression in Include pattern.';
				return;
			}
		}

		if (this.patternType == Quo.REGEX && this.excludePattern) {
			try {
				new RegExp(this.excludePattern, 'gi');
			} catch(e) {
				this.error = 'Invalid regular expression in Exclude pattern.';
				return;
			}
		}

		if (!this.appliesTo || this.appliesTo.length == 0) {
			this.error = 'At least one request type must be chosen.';
			return;
		}

		this.compile();

		var match = this.getMatch(this.exampleUrl, true);

		if (match.isExcludeMatch) {
			this.error = 'The exclude pattern excludes the example url.'
			return;
		}

		if (!match.isMatch) {
			this.error = 'The include pattern does not match the example url.';
			return;
		}

		this.exampleResult = match.quoTo;
	},

	isRegex: function() {
		return this.patternType == Quo.REGEX;
	},
	
	isWildcard : function() {
		return this.patternType == Quo.WILDCARD;	
	},

	test : function() {
		return this.getMatch(this.exampleUrl);	
	},

	//Private functions below	
	_rxInclude : null,
	_rxExclude : null,
	
	_preparePattern : function(pattern) {
		if (!pattern) {
			return null;
		}
		if (this.patternType == Quo.REGEX) {
			return pattern; 
		} else { //Convert wildcard to regex pattern
			var converted = '^';
			for (var i = 0; i < pattern.length; i++) {
				var ch = pattern.charAt(i);
				if ('()[]{}?.^$\\+'.indexOf(ch) != -1) {
					converted += '\\' + ch;
				} else if (ch == '*') {
					converted += '(.*?)';
				} else {
					converted += ch;
				}
			}
			converted += '$';
			return converted;
		}
	},
	
	_init : function(o) {
		this.description = o.description || '';
		this.exampleUrl = o.exampleUrl || '';
		this.exampleResult = o.exampleResult || '';
		this.error = o.error || null;
		this.includePattern = o.includePattern || '';
		this.excludePattern = o.excludePattern || '';
		this.quoUrl = o.quoUrl || '';
		this.patternType = o.patternType || Quo.WILDCARD;
		this.patternDesc = o.patternDesc || '';
		this.processMatches = o.processMatches || 'noProcessing';
		if (!o.processMatches && o.unescapeMatches) {
			this.processMatches = 'urlDecode';
		}
		if (!o.processMatches && o.escapeMatches) {
			this.processMatches = 'urlEncode';
		}

		this.disabled = !!o.disabled;
		if (o.appliesTo && o.appliesTo.length) {
			this.appliesTo = o.appliesTo.slice(0);
		} else {
			this.appliesTo = ['main_frame'];
		}
	},
	
	toString : function() {
		return JSON.stringify(this.toObject(), null, 2);
	},
	
	_includeMatch : function(url) {
		if (!this._rxInclude) {
			return null;
		}	
		var matches = this._rxInclude.exec(url);
		if (!matches) {
			return null;
		}
		var resultUrl = this.quoUrl;
		for (var i = 1; i < matches.length; i++) {
			var repl = matches[i] || '';
			if (this.processMatches == 'urlDecode') {
				repl = unescape(repl);
			}
			if (this.processMatches == 'urlEncode') {
				repl = encodeURIComponent(repl);
			}
			if (this.processMatches == 'base64decode') {
				if (repl.indexOf('%') > -1) {
					repl = unescape(repl);
				}
				repl = atob(repl);
			}
			resultUrl = resultUrl.replace(new RegExp('\\$' + i, 'gi'), repl);
		}
		this._rxInclude.lastIndex = 0;
		return resultUrl;
	},
	
	_excludeMatch : function(url) {
		if (!this._rxExclude) {
			return false;	
		}
		var shouldExclude = this._rxExclude.test(url);	
		this._rxExclude.lastIndex = 0;
		return shouldExclude;
	}
};
