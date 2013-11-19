var system = require('system');

if (system.args.length === 1) {
	console.log( "\n\nERROR: no arguments received \nexample: phantomjs ResponsiveTest.js 'http://website.com'\n\n ");
	phantom.exit();
}

var responsiveTest = (function(website){
	var currentScreen 		= 0;
	var didAllCroppedImages = false;
	var timeStamp 			= new Date().getTime();
	var loadingTime 		= 0;
	var screens 			= [
		{name:'iphoneportrait', width:320, height:416},
		{name:'iphonelandscape', width:480, height:256},
		{name:'iphone5portrait', width:320, height:504},
		{name:'iphone5landscape', width:568, height:256},
		{name:'android240x320portrait', width:240, height:300},
		{name:'android240x320landscape', width:320, height:220},
		{name:'android384x620portrait', width:384, height:600},
		{name:'android620x384landscape', width:600, height:364},
		{name:'ipadportrait', width:768, height:929},
		{name:'ipadlandscape', width:1024, height:675},
		{name:'kindleportrait', width:600, height:820},
		{name:'kindlelandscape', width:1024, height:396},
		{name:'desktopmac15retina', width:1920, height:1200},
		{name:'fullhd', width:1920, height:1080}
	];

	function screenShot(webpage) {
		var page = require('webpage').create();
		
		page.zoomFactor = 1;

		page.viewportSize = {
			width: screens[currentScreen].width,
			height: screens[currentScreen].height
		};

		if(!didAllCroppedImages){
			page.clipRect = {
				top: 0,
				left: 0,
				width: screens[currentScreen].width,
				height: screens[currentScreen].height
			};
		}

		loadingTime = Date.now();

		console.log("\nloading" + screens[currentScreen].name);

		page.open(webpage, function (status) {
			if (status !== 'success') {
	            console.log('Unable to load the address!');
	            phantom.exit();
	        } else {
	        	loadingTime = Date.now() - loadingTime;

	        	console.log("loaded" + screens[currentScreen].name +  " in " + loadingTime + " milliseconds");

				window.setTimeout(function(){
					var filename = screens[currentScreen].name + "-" + loadingTime + 'msec' + '.png';
					var folder   = website.replace('www','').replace("http://",timeStamp+"-");
					var prepend  = didAllCroppedImages ? 'Full-' : 'Crop-';
					
					page.render('./responsiveScreenShots/'+prepend + folder+'/' + filename);
					page.close();

					currentScreen ++;
					
					if(currentScreen >= screens.length){
						didAllCroppedImages ? phantom.exit() : currentScreen = 0;
						didAllCroppedImages = true;
					}
						screenShot(webpage);
				},1000);
			}
		});
	}

	screenShot(website);
})(system.args[1]);