function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
	}
	return null;
}
function writeCookie(name, value, hours) {
	var hostname = window.location.hostname;
	if (hours > 0) {
		var date = new Date();
		date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	} else if(hours == -1) {
		var expires = "; expires=" + new Date().toGMTString()+"; max-age=0";
	} else {
		var expires = "";
	}
	document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/; domain="+hostname;
}
function rememberPos() {
	writeCookie('arp_scroll_position', window.pageYOffset, 6);
}

function sleep(delay) {
    var start = new Date().getTime();
	while (new Date().getTime() < start + delay);
}

function action(query, text, skip, repeat, timeout, value)
{
	if (query == undefined)
		return;
	var selector = document.querySelectorAll(query);
	if (text == undefined)
		text = null;
	if (skip == undefined)
		skip = 0;
	if (repeat == undefined)
		repeat = 1;
	if (timeout == undefined)
		timeout = null;
	if (value == undefined)
		value = null;
	//console.log(query, text, skip, repeat, timeout, value);
	//console.log(document.body.innerHTML);
	for (var i = 0; i < selector.length; i++) {
		if(selector[i] != null)
		{
			//console.log(selector[i].innerText);
			if(i >= skip)
			{
				if(text)
				{
					if(text.localeCompare(selector[i].innerText) == 0)
					{
						if (value)
							selector[i].value = value;
						else
							selector[i].click();
					}
					else
						continue;
				} else {
					if (value)
						selector[i].value = value;
					else
						selector[i].click();
				}
				if(repeat == 0)
					return;
				repeat--;
				break;
			}
		}
	}
	if (timeout)
		setTimeout(action, timeout, query, text, skip, repeat, timeout, value); //element not there yet
}

function actions(request)
{
	if(request.query)
	{
		var queries = request.query.split(' ');
		var texts = request.text.split('|');
		var skips = request.skip.split(' ');
		var repeats = request.repeat.split(' ');
		var timeouts = request.timeout.split(' ');
		var values = request.value.split('|');
		for (var c = 0; c < queries.length; c++)
			action(queries[c], texts[c], skips[c], repeats[c], timeouts[c], values[c]);
	}
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	if(request.pipattern)
  	{
		var regex = new RegExp(request.pipattern, "i");
		//console.log(document.body.innerHTML);
		if (regex.test(document.body.innerHTML))
		{
			sendResponse({findresult: "skip"});
			return;
		}
  	}
	var regex = new RegExp(request.checkme, "i");
	if(request.pattern == 'A') {
		if (regex.test(document.body.innerHTML)) {
			actions(request);
			sendResponse({findresult: "yes"});
		} else {
			//Snub them.
			sendResponse({});
		}
	} else if(request.pattern == 'B') {
		if (!regex.test(document.body.innerHTML)) {
			actions(request);
			sendResponse({findresult: "yes"});
		} else {
		//Snub them.
		sendResponse({});
		}
	} else if(request.pattern == 'C') {
		writeCookie('arp_scroll_switch', '1', 12);
	} else if(request.pattern == 'D') {
		writeCookie('arp_scroll_switch', '0', -1);
		writeCookie('arp_scroll_position', 0, -1);
	}
});

var do_jump = readCookie('arp_scroll_switch');
if(do_jump && do_jump == '1') {
	var arp_jump = readCookie('arp_scroll_position');
	window.scrollTo(0, arp_jump);
}
window.addEventListener("scroll", rememberPos, false);
