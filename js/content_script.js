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

function clickbtn(request)
{
	if(request.query)
	{
		var btn = document.querySelectorAll(request.query);
		//console.log(document.body.innerHTML);
		for (var i = 0; i < btn.length; i++) {
			if(btn[i] != null)
			{
				//console.log(btn[i].innerText);
				if(i >= request.skip)
				{
					if(request.text)
					{
						if(request.text.localeCompare(btn[i].innerText) == 0)
							btn[i].click();
					} else {
							//console.log("click");
							btn[i].click();
					}
					if(request.clicks == 0)
						return;
					request.clicks--;
					break;
				}
			}
		}
		setTimeout(clickbtn, request.timeout, request); //element not there yet
	}
}

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
	var regex = new RegExp(request.checkme, "i");
	if(request.pattern == 'A') {
		if (regex.test(document.body.innerHTML)) {
			clickbtn(request);
			sendResponse({findresult: "yes"});
		} else {
			//Snub them.
			sendResponse({});
		}
	} else if(request.pattern == 'B') {
		if (!regex.test(document.body.innerHTML)) {
			clickbtn(request);
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
