
ready(() => {
	read_options()
	getId('save').onclick = save_options
	getId('cancel').onclick = () => window.close()
	getId('presets').onchange = changepreset
	init()
})

var preset = 0;

function changepreset(obj)
{
	preset = obj.target.value;
	read_options()
}

// Option to save current value to localstorage
function save_options(){
	if(getId('default_time').value < 0) {
		getId('default_time').value = 0;
	}

	localStorage['preset_name'+preset] = getId('preset_name').value;
	localStorage['default_time'+preset] = getId('default_time').value;
	localStorage['random_time'+preset] = getId('randomTime').checked
	localStorage['custom_time'+preset] = getId('customTime').checked
	localStorage['pdcheck'+preset] = getId('pdcheck').checked
	localStorage['pdurl'+preset] = getId('pdurl').value;
	localStorage['pselector'+preset] = getId('pselector').value;
	localStorage['ptext'+preset] = getId('ptext').value;
	localStorage['pskip'+preset] = getId('pskip').value;
	localStorage['ptimeout'+preset] = getId('ptimeout').value;
	localStorage['pnrepeats'+preset] = getId('pnrepeats').value;
	localStorage['pvalue'+preset] = getId('pvalue').value;
	localStorage['timercheck'+preset] = getId('timercheck').checked;
	localStorage['actioncheck'+preset] = getId('actioncheck').checked
	localStorage['dpattern'+preset] = getId('defaultPattern').value;
	localStorage['dpattern1'+preset] = getId('defaultPattern1').value;
	localStorage['ipattern'+preset] = getId('ignorepattern').value;
	localStorage['npreset'+preset] = getId('next_preset').value;
	localStorage['loopbackcheck'+preset] = getId('loopbackcheck').checked
	localStorage['onetimecheck'+preset] = getId('onetimecheck').checked
	localStorage['notifcheck'+preset] = getId('notifcheck').checked
	localStorage['reloadcheck'+preset] = getId('reloadcheck').checked
	localStorage['completecheck'+preset] = getId('completecheck').checked
	localStorage['blockurls'+preset] = getId('blockurls').value;
	localStorage['waiturls'+preset] = getId('waiturls').value;
	localStorage['jscode'+preset] = getId('jscode').value;

	if(getId('timer01').checked) {
		localStorage['timermode'+preset] = '1';
	} else {
		localStorage['timermode'+preset] = '2';
	}

	localStorage['pmonitor'+preset] = getId('pmonitor').checked

	if(getId('pmsound01').checked) {
		localStorage['sound'+preset] = '1';
	} else if(getId('pmsound02').checked) {
		localStorage['sound'+preset] = '2';
	} else if(getId('pmsound03').checked) {
		localStorage['sound'+preset] = '3';
	} else if(getId('pmsound04').checked) {
		localStorage['sound'+preset] = '4';
	} else if(getId('pmsound05').checked) {
		localStorage['sound'+preset] = '5';
	} else if(getId('pmsound06').checked) {
		localStorage['sound'+preset] = '6';
	} else if(getId('pmsound07').checked) {
		localStorage['sound'+preset] = '7';
	}

	localStorage['soundurl'+preset] = getId('soundurl').value;
	localStorage['soundvolume'+preset] = getId('soundvolume').value;

	// notification closing
	if (getId('pm_sound_til_click').checked) {
		localStorage['pm_sound_til'+preset] = 'click';
	} else if (getId('pm_sound_til_sound').checked) {
		localStorage['pm_sound_til'+preset] = 'sound';
	} else if (getId('pm_sound_til_timeout').checked) {
		localStorage['pm_sound_til'+preset] = 'timeout';
	}
	localStorage['pm_sound_timeout'+preset]  = getId('pm_sound_timeout').value;

	localStorage['cachereloadinterv'+preset] = getId('cachereloadinterv').value;
	localStorage['loadtimeout'+preset] = getId('loadtimeout').value;
	localStorage['skiptimeout'+preset] = getId('skiptimeout').value;

	localStorage.support = !(getId('dontsupport').checked);
}

function read_options(){
	if(localStorage['default_time'+preset]) {
		getId('default_time').value = localStorage['default_time'+preset];
	}

 	getId('randomTime').checked  = (localStorage['random_time'+preset] == 'true');
	getId('customTime').checked = (localStorage['custom_time'+preset] == 'true');
 	getId('pdcheck').checked  = (localStorage['pdcheck'+preset] == 'true');
 	getId('pmonitor').checked  = (localStorage['pmonitor'+preset] == 'true');
 	getId('timercheck').checked  = (localStorage['timercheck'+preset] == 'true');
 	getId('actioncheck').checked  = (localStorage['actioncheck'+preset] == 'true');
 	getId('loopbackcheck').checked  = (localStorage['loopbackcheck'+preset] == 'true');
 	getId('onetimecheck').checked  = (localStorage['onetimecheck'+preset] == 'true');
 	getId('notifcheck').checked  = (localStorage['notifcheck'+preset] == 'true');
 	getId('reloadcheck').checked  = (localStorage['reloadcheck'+preset] == 'true');
 	getId('completecheck').checked  = (localStorage['completecheck'+preset] == 'true');

	// timer
	if(localStorage['timermode'+preset]) {
		if(localStorage['timermode'+preset] == '1') {
			getId('timer01').checked = true;
		} else if(localStorage['timermode'+preset] == '2') {
			getId('timer02').checked = true;
		}
	} else {
		getId('timer01').checked = true;
	}
	var psets = getId('presets');
	for (var i = 0; i < psets.length; i++)
		psets[i].innerHTML = i + ' ' + (localStorage['preset_name'+i] || '');

	getId('preset_name').value = localStorage['preset_name'+preset] || '';
	getId('defaultPattern').value = localStorage['dpattern'+preset] || '';
	getId('defaultPattern1').value = localStorage['dpattern1'+preset] || '';
	getId('ignorepattern').value = localStorage['ipattern'+preset] || '';
	getId('next_preset').value = localStorage['npreset'+preset] || '';
	getId('blockurls').value = localStorage['blockurls'+preset] || '';
	getId('waiturls').value = localStorage['waiturls'+preset] || '';
	getId('jscode').value = localStorage['jscode'+preset] || '';


 	// sound
	if(localStorage['sound'+preset] && localStorage['sound'+preset] == '2') {
		getId('pmsound02').checked = true;
	} else if(localStorage['sound'+preset] && localStorage['sound'+preset] == '3') {
		getId('pmsound03').checked = true;
	} else if(localStorage['sound'+preset] && localStorage['sound'+preset] == '4') {
		getId('pmsound04').checked = true;
	} else if(localStorage['sound'+preset] && localStorage['sound'+preset] == '5') {
		getId('pmsound05').checked = true;
	} else if(localStorage['sound'+preset] && localStorage['sound'+preset] == '6') {
		getId('pmsound06').checked = true;
	} else if(localStorage['sound'+preset] && localStorage['sound'+preset] == '7') {
		getId('pmsound07').checked = true;
	} else {
		getId('pmsound01').checked = true;
	}
	getId('soundvolume').value = localStorage['soundvolume'+preset];

	getId('pdurl').value = localStorage['pdurl'+preset] || '';
	getId('pselector').value = localStorage['pselector'+preset] || '';
	getId('ptext').value = localStorage['ptext'+preset] || '';
	getId('pskip').value = localStorage['pskip'+preset] || '';
	getId('ptimeout').value = localStorage['ptimeout'+preset] || '';
	getId('pnrepeats').value = localStorage['pnrepeats'+preset] || '';
	getId('pvalue').value = localStorage['pvalue'+preset] || '';
	getId('soundurl').value = localStorage['soundurl'+preset] || '';


	// notification closing
	if (!localStorage['pm_sound_til'+preset]) {
		localStorage['pm_sound_til'+preset] = 'click';
	}
	getId('pm_sound_til_' + localStorage['pm_sound_til'+preset]).checked = true;
	getId('pm_sound_timeout').value = localStorage['pm_sound_timeout'+preset] || 5;
	getId('cachereloadinterv').value = localStorage['cachereloadinterv'+preset] || -1;
	getId('loadtimeout').value = localStorage['loadtimeout'+preset] || 0;
	getId('skiptimeout').value = localStorage['skiptimeout'+preset] || 0;

	getId('dontsupport').checked = (localStorage.support == 'false');
}

var sound = new Audio();
var is_sound_playing = false;
var volume_change_timer;
var volume_fadeout_timer;

function play_sound() {
	clearInterval(volume_fadeout_timer);
	if (getId('pmsound02').checked)
		var sound_file = './sound/sound1.mp3';
	else if(getId('pmsound03').checked)
		var sound_file = './sound/sound2.mp3';
	else if(getId('pmsound04').checked)
		var sound_file = './sound/newegg.mp3';
	else if(getId('pmsound05').checked)
		var sound_file = './sound/walmart.mp3';
	else if(getId('pmsound06').checked)
		var sound_file = './sound/msi.mp3';
	else if(getId('pmsound07').checked)
		var sound_file = getId('soundurl').value;

	if (sound_file) {
		sound.volume = getId('soundvolume').value;
		sound.src = sound_file;
		sound.play();
	}
}

function pause_sound() {
	sound.pause();
}

function pause_sound_with_fadeout(sound) {
	var volume = sound.volume;
	volume_fadeout_timer = setInterval(function() {
		if (volume > 0) {
			volume -= 0.05;
			sound.volume = Math.max(volume, 0);
		} else {
			clearInterval(volume_fadeout_timer);
			sound.pause();
		}
	}, 16)
}

function init() {
	getId('test-play').onclick = play_sound;
	var soundoptions = document.getElementsByClassName('pmsound');
	[].forEach.call(soundoptions, function (soundoption) {
		soundoption.onclick = play_sound;
	});

	getId('soundvolume').onchange = function() {
		sound.volume = this.value;
		if (sound.paused)
			play_sound();
		clearTimeout(volume_change_timer);
		volume_change_timer = setTimeout(function () {
			pause_sound_with_fadeout(sound);
		}, 2000)
	}

	getId('incognito').onclick = function() {
		chrome.tabs.create({url: getId('incognito').href, active: true})
	}
}
