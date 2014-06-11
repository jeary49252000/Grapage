chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	switch(message.type) {
		case "catch":
			var NewScript = document.createElement("script");
        	NewScript.type = "text/javascript";
        	NewScript.src = "contentEditable.js";
			document.getElementsByTagName('body')[0].appendChild(NewScript);
			var htmlContent = document.documentElement.innerHTML;
			
			chrome.extension.sendMessage({
	        	type: "return", content: htmlContent
	    	});	
		break;
	}
});