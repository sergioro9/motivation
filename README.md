Motivation
========

Your age.


![](screenshot.png)

## Todo

  [ ] read refs 1, 5

  [x] do `browser_action` in manifest.json the same way as in Redirector
  addon

  [ ] add option so that user can add his own quotes

  [ ] How to create default text symbols like this (from redirector.html): ☈ ?

  [ ] Remove the 'style=' attributes in quo.html, which are not used in
  redirector.html

## Notes

  * insightful comment in ref 3: Don't complicate your life trying to
    read a json file in JS, that's kinda stupid since if you have the
    files locally you can just wrap them into a define call and if it is
    on your server you can just load it as text and parse the JSON data,
    but you get the idea.

  * background script are only sourced once (when you (re)load the
    addon). Thus, if you make changes to background scripts you need to
    reload the addon. Non-background scripts are updated with as usual
    (on page refresh)

  * to use third party js you need to use the 'storage' permission.
    Otherwise the libraries in your js/ directory won't work (e.g.
    angular)

## References

 1. [Learn handlebars in one video](http://www.newthinktank.com/2015/10/learn-handlebars-one-video/)
 2. [Read local json from file in firefox extension](https://stackoverflow.com/questions/22268481/read-local-json-file-in-firefox-extension)
 3. [RequireJS plugin to load JSON json](https://gist.github.com/millermedeiros/1255010)
 4. [Getting a random integer between two values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values)
 5. [Developers Hub | Mozilla](https://addons.mozilla.org/en-us/developers/)
