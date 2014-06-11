// omnibox
chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
	suggest([
	  {content: "catch", description: "Catch the page"}
	]);
});
chrome.omnibox.onInputEntered.addListener(function(text) {
	if(text == "catch") catchPage();
});

// listening for an event / one-time requests
// coming from the popup
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.type) {
        case "catch":
            catchPage();
        break;
        case "return":
        	handleReturnPage(request.content);
        break;
    }
    return true;
});


// send a message to the content script
var catchPage = function() {
	chrome.tabs.getSelected(null, function(tab){
	    chrome.tabs.sendMessage(tab.id, {type: "catch"});
	});
}

var id = 100;
var handleReturnPage = function(htmlContent) {
	var viewTabUrl = chrome.extension.getURL('toolbar.html?' + id++);
	chrome.tabs.create({url: viewTabUrl}, function(tab) {
	      var targetId = tab.id;
	      var addContentToIFrame = function(tabId, changedProps) {
	        // We are waiting for the tab we opened to finish loading.
	        // Check that the the tab's id matches the tab we opened,
	        // and that the tab is done loading.
	        if (tabId != targetId || changedProps.status != "complete")
	          return;

	        // Passing the above test means this is the event we were waiting for.
	        // There is nothing we need to do for future onUpdated events, so we
	        // use removeListner to stop geting called when onUpdated events fire.
	        chrome.tabs.onUpdated.removeListener(addContentToIFrame);

	        // Look through all views to find the window which will display
	        // the screenshot.  The url of the tab which will display the
	        // screenshot includes a query parameter with a unique id, which
	        // ensures that exactly one view will have the matching URL.
	        var views = chrome.extension.getViews();
	        for (var i = 0; i < views.length; i++) {
	          var view = views[i];
	          if (view.location.href == viewTabUrl) {
	            view.setToIframe(htmlContent);
	            break;
	          }
	        }
	      };
	      chrome.tabs.onUpdated.addListener(addContentToIFrame);
		});
}