
var preset = 0;
var pchange = 0;

ready(() => {
	console = chrome.extension.getBackgroundPage().console;
	pchange = 0;
	if(localStorage['preset'])
	{
		preset = localStorage['preset'];
		getId('ppresets').value = preset;
	}
	getId('ppresets').onchange = changepreset
	setTimeout(restoreOptions, 1);
	populateCustom(); // Populate the custom time dropdown with options
	getId('startbtn').onclick = startRefresh
	getId('default-value-button').onclick = () =>
		getId('contentid').value = localStorage['dpattern'+preset]
	getId('default-value-button1').onclick = () =>
		getId('contentid1').value = localStorage['dpattern1'+preset]
	getId('r08').onclick = () => getId('tcustom').focus()
	getId('tcustom').onfocus = () => getId('r08').checked = true
	getId('r07').onclick = () => getId('tmin').focus()
	getId('tmin').onfocus = () => getId('r07').checked = true
	getId('tmax').onfocus = () => getId('r07').checked = true

	getId('custom').onclick = updateCustomValue

	const update = () => {
		updateCustomValue()
		getId('custom').checked = true
	}

	getId('hours').onchange = update
	getId('minutes').onchange = update
	getId('seconds').onchange = update

	getId('timerbtn').onclick = startTimer
})

function changepreset(obj)
{
	pchange = 1;
	preset = obj.target.value;
	localStorage['preset'] = preset;
	restoreOptions();
}

function get_interval( )
{
  var time_result = []
  var interval_time = 5000;
  var radio_arr = document.getElementsByName("reloadOption");
  var total = radio_arr.length;

  for(i=0;i<total;i++) {
	if(radio_arr[i].checked) {
		if(radio_arr[i].value == 'rand') {
			var tmin = getId('tmin').value - 0;
			var tmax = getId('tmax').value - 0;
			if(tmin > tmax) {
				interval_time = tmax+'-'+tmin;
			} else {
				interval_time = tmin+'-'+tmax;
			}
			time_result[0] = interval_time;
			time_result[1] = 'rand';
		}else if(radio_arr[i].value == 'custom') {
			var tcustom = getId('tcustom').value - 0;
			if(tcustom < 0) {
				interval_time = 1000;
				getId('tcustom').value = '1';
			} else {
				interval_time = Math.round(tcustom * 1000);
			}
			time_result[0] = interval_time;
			time_result[1] = 'custom';
		} else if(radio_arr[i].id == 'custom'){ // the new dropdown feature
			interval_time = radio_arr[i].value;
			time_result[0] = interval_time;
			time_result[1] = 'customDropdown';
		}
		else {
			interval_time = radio_arr[i].value;
			time_result[0] = interval_time;
			time_result[1] = 'stand';
		}
	}
  }

  return time_result;
}

function set_interval(time_interval, time_type) {

  if(time_type == 'custom') {
    getId('r08').checked = true;
    var tcustom_inp = getId("tcustom");
    tcustom_inp.value = Math.floor(time_interval / 1000);
	return;
  } else if(time_type == 'rand') {
	getId('r07').checked = true;
	var min_max_arr = time_interval.split("-");
    getId("tmin").value = min_max_arr[0];
	getId("tmax").value = min_max_arr[1];
	return;
  }
  else if (time_type == 'customDropdown'){
  	getId('custom').checked = true;
  	return;
  }

  var radio_arr = document.getElementsByName("reloadOption");
  for(i = 0 ; i < radio_arr.length; i++) {
    if(radio_arr[i].value == time_interval) {
	radio_arr[i].checked = true;
	return;
    }
  }
}

function startRefresh() {
	if ( getId("startbtn").value == "Start" ) {
		getId("startbtn").classList.add("stop");
		getId("startbtn").value = "Stop";
	
		getId("timerbtn").value = "Start Timer";
		getId("timerbtn").classList.remove("stop");
	
		var myInterval = get_interval();
		var views = chrome.extension.getViews();
		var checkme = getId("contentid").value;
		var page_monitor_pattern = 'A';
		if (!checkme)
		{
			checkme = getId("contentid1").value;
			page_monitor_pattern = 'B';
		}
		var preurl = getId("pdurlinp").value;
		var bquery = getId('bselector').value;
		var btext = getId('btext').value;
		var bskip = getId('bskip').value;
		var btimeout = getId('btimeout').value;
		var bnclicks = getId('bnclicks').value;
	
		for (var i in views) {
			if (views[i].loop_start) {
				views[i].loop_start(preset, -1, myInterval[0], myInterval[1], checkme, page_monitor_pattern, preurl,
							bquery, btext, bskip, btimeout, bnclicks);
			}
		}
	} else {
		getId("startbtn").value = "Start";
		getId("startbtn").classList.remove("stop");
		var views = chrome.extension.getViews();
		for (var i in views) {
			if (views[i].loop_stop) {
				views[i].loop_stop();
			}
		}
	}
}

function startTimer() {
  if (getId("timerbtn").value == "Start Timer" ) {
	var myInterval = get_interval();
	var checkme = getId("contentid").value;
	var page_monitor_pattern = 'A';
	if (!checkme)
	{
		checkme = getId("contentid1").value;
		page_monitor_pattern = 'B';
	}
	var preurl = getId("pdurlinp").value;
	var bquery = getId('bselector').value;
	var btext = getId('btext').value;
	var bskip = getId('bskip').value;
	var btimeout = getId('btimeout').value;
	var bnclicks = getId('bnclicks').value;

  	var timer_mode = getId("timermode").value;

  	if(timer_mode == "1") {
		var tHour = parseInt(getId("timerHour").value);
		var tMin = parseInt(getId("timerMin").value);
		var tSec = parseInt(getId("timerSec").value);
		if(isNaN(tHour)) {tHour = 0;getId("timerHour").value = "0";}
		if(isNaN(tMin)) {tMin = 0;getId("timerMin").value = "0";}
		if(isNaN(tSec)) {tSec = 0;getId("timerSec").value = "0";}
	
		var waitTime = (tHour * 3600 + tMin * 60 + tSec) * 1000;
	
		if(waitTime <= 0) {
			//alert("Counddown can't be 0!");
		} else {
			var views = chrome.extension.getViews();
			for (var i in views) {
				if (views[i].loop_start) {
					views[i].loop_start(preset, waitTime, myInterval[0], myInterval[1], checkme, page_monitor_pattern, preurl,
							bquery, btext, bskip, btimeout, bnclicks);
				}
			}
			getId("timerbtn").value = "Cancel Timer";
			getId("timerbtn").classList.add("stop");

			getId("startbtn").value = "Start";
			getId("startbtn").classList.remove("stop");
		}
	} else {
		var dateStr = getId("dateInp").value;
		var dDate = new Date(dateStr);
		if(isNaN(dDate)) {
			//alert("Date is invalid.<br>The format must be yyyy-MM-dd, e.g., 2012-09-21");
			return;
		}
		var dateTimeStr = dateStr+" "+getId("timeInp").value;
		var dTime = new Date(dateTimeStr);
		if(isNaN(dTime)) {
			//alert("Time is invalid.<br>The format must be HH:mm:ss, e.g., 23:10:11");
			return;
		}
		var now = new Date();
		if(now.getTime() >= dTime.getTime()) {
			//alert("Date time can't be earlier than the current time!");
		} else {
			var the_month =  dTime.getMonth() + 1;
			var dDate = dTime.getFullYear() + "/" + the_month + "/" + dTime.getDate();
			var dTime = dTime.getHours() + ":" + dTime.getMinutes() + ":" + dTime.getSeconds();
			var waitTime = dDate+" "+dTime;
			var views = chrome.extension.getViews();
			for (var i in views) {
				if (views[i].loop_start) {
					views[i].loop_start(preset, waitTime, myInterval[0], myInterval[1], checkme, page_monitor_pattern, preurl,
							bquery, btext, bskip, btimeout, bnclicks);
				}
			}
			getId("timerbtn").value = "Cancel Timer";
			getId("timerbtn").classList.add("stop");

			getId("startbtn").value = "Start";
			getId("startbtn").classList.remove("stop");
		}
	}
  } else {
    getId("timerbtn").value = "Start Timer";
    getId("timerbtn").classList.remove("stop");
    var views = chrome.extension.getViews();
    for (var i in views) {
	if (views[i].loop_stop) {
	    views[i].loop_stop();
	}
    }
  }
}

function restoreOptions() {
	if(localStorage['default_time'+preset]) {
		set_interval(localStorage['default_time'+preset] * 1000, "custom");
	}
	if(localStorage['random_time'+preset] == 'true') {
		show(getId('randombox'))
	} else
		hide(getId('randombox'))
	if(localStorage['pmonitor'+preset] && localStorage['pmonitor'+preset] == 'true'){
		show(getId('monitorbox'))
		if(localStorage['dpattern'+preset]){ // only show button if default text is set
			show(getId('default-value-button'))
		} else 
			hide(getId('default-value-button'))
		if(localStorage['dpattern1'+preset]){ // only show button if default text is set
			show(getId('default-value-button1'))
		} else
			hide(getId('default-value-button1'))
	} else 
		hide(getId('monitorbox'))
	if(localStorage['pdcheck'+preset] && localStorage['pdcheck'+preset] == 'true'){
		show(getId('pdurlbox'))
		var pdurl = localStorage['pdurl'+preset];
		getId('pdurlinp').value = pdurl
	} else {
		hide(getId('pdurlbox'))
		getId('pdurlinp').value = ''
	}
	if(localStorage['buttoncheck'+preset] && localStorage['buttoncheck'+preset] == 'true'){
		show(getId('buttonclick'))
		var bquery = localStorage['pselector'+preset];
		var btext = localStorage['ptext'+preset];
		var bskip = localStorage['pskip'+preset];
		var btimeout = localStorage['ptimeout'+preset];
		var bnclicks = localStorage['pnclicks'+preset];
		getId('bselector').value = bquery
		getId('btext').value = btext
		getId('bskip').value = bskip
		getId('btimeout').value = btimeout
		getId('bnclicks').value = bnclicks
	} else {
		hide(getId('buttonclick'))
		getId('bselector').value = ''
		getId('btext').value = ''
		getId('bskip').value = 0
		getId('btimeout').value = 100 
		getId('bnclicks').value = 1
	}
	if(localStorage['timercheck'+preset] && localStorage['timercheck'+preset] == 'true') {
		show(getId('timerbox'))
		if(localStorage['timermode'+preset] == "1") {
			show(getId('countdownMode'))
			getId('timermode').value = '1'

		} else {
			getId('timermode').value = '2'
			show(getId('dateMode'))
			//10 minutes later
			var nowTime = new Date((new Date()).getTime() + 600000);
			var dDate = nowTime.toLocaleDateString('en-ZA'); // this locale has required yyyy/MM/dd format
			var dTime = nowTime.toLocaleTimeString('en-ZA'); // hh24:mm:ss, 2-digit mm and ss
			getId('dateInp').value = dDate
			getId('timeInp').value = dTime
		}
	} else 
		hide(getId('timerbox'))
	// Set times if already defined
	if(localStorage['customHour'+preset]){
		getId('hours').value = localStorage.customHour
	}
	if(localStorage['customMinute'+preset]){
		getId('minutes').value = localStorage.customMinute
	}
	if(localStorage['customSecond'+preset]){
		getId('seconds').value = localStorage.customSecond
	}

	var port = chrome.extension.connect({name: "getOptions"});
	port.onMessage.addListener(recvData);
	port.postMessage({msg:'getAllOptions'});

	// quick fix for mac scrollbar
	document.body.style.paddingRight = '11px';
}

function recvData(data){
	if(data.status == 'start') {
		getId("startbtn").value = "Stop";
		getId("startbtn").classList.add("stop");
	} else if(data.status == 'wait') {
		getId("timerbtn").value = "Cancel Timer";
		getId("timerbtn").classList.add("stop");
	} else {
		getId("startbtn").value = "Start";
		getId("startbtn").classList.remove("stop");
		getId("timerbtn").value = "Start Timer";
		getId("timerbtn").classList.remove("stop");
	}

	set_interval(data.time_interval, data.time_type);
	if(data.checkme) {
		if (data.pmpattern == 'A')
			getId('contentid').value = data.checkme;
		else if(data.pmpattern == 'B') 
			getId('contentid1').value = data.checkme;
	}
	if (data.preset != localStorage['preset'] && !pchange)
	{
		localStorage['preset'] = data.preset;
		getId('ppresets').value = data.preset;
		preset = data.preset;
		restoreOptions();
	}

	if(data.wait_time) {
		if(data.wait_time.toString().search(" ") == -1) {
			var waitTime = data.wait_time / 1000;
			var tHour = Math.floor(waitTime / 3600);
			var tMin = Math.floor((waitTime - tHour * 3600) / 60);
			var tSec = Math.floor(waitTime - (tHour * 3600) - (tMin * 60));
			getId('timerHour').value = tHour;
			getId('timerMin').value = tMin
			getId('timerSec').value = tSec
			getId('timermode').value = '1'
		} else {
			var nowTime = new Date(data.wait_time);
			var theMonth = nowTime.getMonth() + 1;
			if(theMonth < 10) {
				theMonth = "0"+theMonth;
			}
			var theDate = nowTime.getDate() + 1;
			if(theDate < 10) {
				theDate = "0"+theDate;
			}
			var theMin = nowTime.getMinutes() + 1;
			if(theMin < 10) {
				theMin = "0"+theMin;
			}
			var theSec = nowTime.getSeconds() + 1;
			if(theSec < 10) {
				theSec = "0"+theSec;
			}
			var dDate = nowTime.getFullYear() + "/" + theMonth + "/" + nowTime.getDate();
			var dTime = nowTime.getHours() + ":" + theMin + ":" + theSec;
			getId('dateInp').value = dDate
			getId('timeInp').value = dTime
			getId('timermode').value = '2'
		}
	}
}

function populateCustom(){
	var hours = getId('hours')
	var minutes = getId('minutes')
	var seconds = getId('seconds')

	for (var i = 0; i <= 24 ; i++) {
		var hourValue = i * 60 * 60 * 1000
		var option = "<option value="+ hourValue +">"+ i +"</option>"
		hours.innerHTML += option
	}
	for (var j = 0; j <= 60 ; j++) {
		var minuteValue = j * 60 * 1000
		var secondValue = j * 1000
		var minuteOption = "<option value="+ minuteValue +">"+ j +"</option>"
		var secondOption = "<option value="+ secondValue +">"+ j +"</option>"
		minutes.innerHTML += minuteOption
		seconds.innerHTML += secondOption
	};
}

function updateCustomValue(){
	var hours = getId('hours')
	var minutes = getId('minutes')
	var seconds = getId('seconds')
	localStorage.customHour = hours.value
	localStorage.customMinute = minutes.value
	localStorage.customSecond = seconds.value
	var sum = parseInt(hours.value) + parseInt(minutes.value) + parseInt(seconds.value)
	getId('custom').value = sum
}


var scrollRoot = document.body;
var header = getId('header');
var is_scrolling = true;

function update() {
	if (is_scrolling) {
		if (scrollRoot.scrollTop)
			header.classList.add('scrolled');
		else
			header.classList.remove('scrolled');
		is_scrolling = false;
	}
	requestAnimationFrame(update);
}
update();

document.onscroll = function () {
	is_scrolling = true;
}
