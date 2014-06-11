window.onload = function () {
	var buttons = document.getElementById('testForm').getElementsByTagName('button');
	var inputs = document.getElementById('testForm').getElementsByTagName('input');
	
	for (var i=0;i<buttons.length;i++) {
		if (buttons[i].type != 'button') continue;
		buttons[i].onclick = command;
	}
	
	for (var i=0;i<inputs.length;i++) {
		if (inputs[i].type != 'button') continue;
		inputs[i].onclick = command;
	}
	iframe = document.getElementById('test');
}

var testEl;

function command() {

	if (this.id != "save") {
		var cmd = this.id;
		var bool = false;
		var value = this.getAttribute('cmdValue') || null;
		if (value == 'promptUser')
			value = prompt(this.getAttribute('promptText'));
		var returnValue = iframe.contentWindow.inBetween(cmd,bool,value);
	}
	else if (this.id == "save") {
		//alert(iframe.contentDocument.documentElement.innerHTML);
		var NewScript = iframe.contentDocument.createElement("meta");
        NewScript.setAttribute("http-equiv","Content-Type");
        NewScript.setAttribute("content","text/html");
        NewScript.setAttribute("charset","utf-8");
        var headElement = iframe.contentDocument.getElementsByTagName('head')[0]
		headElement.insertBefore(NewScript, headElement.firstChild);
		saveAs(
			  new Blob(
				  [iframe.contentDocument.documentElement.innerHTML]
				, {type: "text/plain;charset=" + iframe.contentDocument.characterSet}
			)
			, "demo.html"
		);
	}
//	iframe.contentDocument.execCommand(cmd,bool,value);
}

function setToIframe(content) {
  var targetFrame = document.getElementById('test');
  targetFrame.contentWindow.document.open('text/html', 'replace');
  targetFrame.contentWindow.document.write(content);
  targetFrame.contentWindow.document.close();
  //alert(content);
}