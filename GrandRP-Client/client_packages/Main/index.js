let main_browser = null;
main_browser = mp.browsers.new("package://cef/index.html");
chat_browser = mp.browsers.new("package://login/hud-chat.html");
var curr_lang = 'de';
var creatorCamera = void 0;
var Shop24Opened = false;


var sceneryCamera = void 0;
setTimeout(function () {
    mp.gui.chat.show(false);
    chat_browser.markAsChat();
    mp.events.call('Disablechat');
    chat_browser.execute('$(\'.chat-posts\').attr(\'style\',\'height: ' + mp.storage.data.chat_height * 10 + 'px\');');
    chat_browser.execute('TranslateChat(\'' + curr_lang + '\');');
    chat_browser.execute('chatAPI.ChangeLanguage(\'' + curr_lang + '\');');
    chat_browser.execute('chatAPI.clear();');
    mp.nametags.enabled = false;

}, 2000);


mp.keys.bind(0x45, false, () => {
    mp.events.callRemote("PressedKeyE");
    checkInterval();
});



mp.events.add("Client_ForceCloseDesigns", function () {
	CloseBrowsers();
});

//mp.events.add("BindEsctoClose", function () {
	mp.keys.bind(0x1B, false, function () {
		//ESC
		//
		CloseBrowsers();
	});
//});
CloseBrowsers = function () {
	if (Shop24Opened) CloseShop24();
};

mp.events.add("Client_OpenShop24", function (discount, money) {
    var json = "{\"name\":\"" + mp.players.local.name.replace('_', ' ') + "\",\"balance\":" + money + ",\"discount\":" + discount + ",\"show\":true}";
    main_browser.execute("APPS.state.shop24 = " + json);
    //
    Shop24Opened = true;
    //
   // ChangeHudState(false);
    mp.events.call("Disablechat");
    mp.game.ui.displayRadar(false);
    //
    mp.gui.cursor.show(true, true);
});
mp.events.add("Client_BuyShopItem", function (slot) {
    if (!Shop24Opened) return;
    //if (new Date().getTime() - lastCheck < 250) return;
   // lastCheck = new Date().getTime();
    mp.events.callRemote("ServerBuyShopItem", slot);
});

mp.events.add("Client_UpdateShop24Balance", function (money) {
    if (!Shop24Opened) return;
    main_browser.execute("APPS.state.shop24.balance = " + money);
});
CloseShop24 = function () {
    if (!Shop24Opened) return;
    main_browser.execute("APPS.state.shop24.show = false;");
    Shop24Opened = false;
    mp.gui.cursor.show(false, false);
    mp.events.call("Enablechat");
};

mp.events.add('ClientSendMessage', function (value, sendcheck) {
    mp.events.callRemote("ServerSendMessage", value, sendcheck);
});

mp.events.add('SendMessage', function (message, player_id, type, rank_name) {
		if (type == "nonrp") {
			chat_browser.execute('chatAPI.push(\'' + message + '\',\'' + player_id + ('\',1,\'' + "fff" + '\')'));
		} else if (type == "rp") {
			chat_browser.execute('chatAPI.push(\'' + message + '\',\'' + player_id + ('\',0,\'' + "fff" + '\')'));
	}
});
mp.events.add('Client_ChangeFamState', function (state) {
	if (state == true) chat_browser.execute('ChangeFamState(true);');else chat_browser.execute('ChangeFamState(false);');
});

mp.events.add('SendFamMessage', function (msg, name, rank_name, icon, color) {
	chat_browser.execute('chatAPI.push(\'' + msg + '\',\'' + name + '\',801,\'' + rank_name + '\',' + icon + ',' + color + ')');
});

mp.events.add('CreateChar', function () {
    mp.game.interior.enableInteriorProp(166657, "V_Michael_M_items");
	mp.game.interior.refreshInterior(166657);
	creatorCamera = mp.cameras.new("creatorCamera", new mp.Vector3(-812.8785034179688, 174.38375854492188, 77.2650375366211), new mp.Vector3(0.0, 0.0, -57.0), 45);
	creatorCamera.setActive(true);
    mp.players.local.freezePosition(true);
	mp.gui.cursor.show(true, true);
	main_browser.execute("APPS.state.create_person.show = true;");
    chat_browser.execute("APPS.state.create_person.sliders = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];");
    chat_browser.execute("APPS.state.create_person.mom_name = " + "Jennifer" + ";");
    chat_browser.execute("APPS.state.create_person.dad_name = " + "Esel" + ";");
    chat_browser.execute("APPS.state.create_person.sliders_similarity = 50;");
    chat_browser.execute("APPS.state.create_person.hair_name = " + "Fresh" + ";");
    chat_browser.execute("APPS.state.create_person.hair_color = 0;");
    chat_browser.execute("APPS.state.create_person.beard_name = " + "Mero" + ";");
    chat_browser.execute("APPS.state.create_person.sliders = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];");
    chat_browser.execute("APPS.state.create_person.brow_name = " + "Braue" + ";");
    chat_browser.execute("APPS.state.create_person.eye_name = " + "Rot" + ";");
});


mp.events.add("CamClothes", function () {
	if (creatorCamera) {
		creatorCamera.destroy();
		creatorCamera = null;
	}
	//let clothescam;
	creatorCamera = mp.cameras.new("CamClothes", new mp.Vector3(-814.0785034179688, 173.68375854492188, 76.5650375366211), new mp.Vector3(0.0, 0.0, -60.0), 45);
	mp.game.cam.renderScriptCams(true, false, 500, true, false);
});
mp.events.add("CamFace", function () {
	if (creatorCamera) {
		creatorCamera.destroy();
		creatorCamera = null;
	}
	creatorCamera = mp.cameras.new("CamFace", new mp.Vector3(-812.8785034179688, 174.38375854492188, 77.2650375366211), new mp.Vector3(0.0, 0.0, -57.0), 45);
	mp.game.cam.renderScriptCams(true, false, 500, true, false);
});
mp.events.add("FinishReg", function () {
	if (creatorCamera) {
		creatorCamera.destroy();
		creatorCamera = null;
	}
    mp.game.cam.renderScriptCams(false, false, 500, false, false);
    mp.players.local.freezePosition(false);
	mp.gui.cursor.show(false, false);
    //mp.events.callRemote("CharCreatedFinshed");
	mp.game.interior.disableInteriorProp(166657, "V_Michael_M_items");
	mp.game.interior.refreshInterior(166657);
	main_browser.execute("APPS.state.create_person.show = false;");
    mp.events.call("FinishRegAfterVideoEvent");
   // main_browser.execute("APPS.state.video_grand = {\"show\":true}");
   // mp.events.call("Enablechat");
});
mp.events.add("FinishRegAfterVideoEvent", function () {
    mp.events.call("Enablechat");
	//main_browser.execute("APPS.state.video_grand = {\"show\":false}");

	var facedata = [];

	var row_item = {
		mother: mothers[motherindex],
		father: fathers[fatherindex],
		similiarity: similarityindex
	};

	for (var i = 0; i < nosedata.length; i++) {
		facedata.push(nosedata[i]);
	}

	var row_item2 = {
		localeyebrows: eyebrows,
		localeyecolor: eyecolor,
		localhairstyle: hairstyle,
		localhaircolor: haircolor,
		localbeard: beards[beard],
		localmakeup: 255,
		localblush: 255,
		locallipstick: 255,
		localblushcolor: 1,
		locallipstickcolor: 1,
		localmoles: 255,
		localchesthair: 255
	};

	var locshirts = void 0;
	var locjeans = void 0;
	var locboots = void 0;

	var bGender = 0;
	if (mp.players.local.model != 1885233650) {
		bGender = 1;
	}

	if (bGender == 0) locshirts = maleshirts[shirts];else locshirts = femaleshirts[shirts];
	if (bGender == 0) locjeans = malejeans[jeans];else locjeans = femalejeans[jeans];
	if (bGender == 0) locboots = maleboots[boots];else locboots = femaleboots[boots];

	var row_item3 = {
		localshirts: locshirts,
		localjeans: locjeans,
		localboots: locboots
	};

	mp.players.local.freezePosition(false);
	mp.gui.cursor.show(false, false);
	mp.events.callRemote("CharCreatedFinshed", bGender, JSON.stringify(row_item), JSON.stringify(facedata), JSON.stringify(row_item2), JSON.stringify(row_item3));
});


mp.events.add('EndCreateChar', function () {
    mp.players.local.freezePosition(false);
	mp.gui.cursor.show(false, false);
});



mp.events.add("Client_Clear_Quene", function () {
    mp.gui.cursor.show(true, true);
    mp.game.ui.displayRadar(false);
    mp.players.local.freezePosition(true);
    main_browser.execute("APPS.state.login.opened = true;");
    main_browser.execute("APPS.state.login.in_quene = 0;");
    main_browser.execute("APPS.state.login_quene.number = 0;");
    main_browser.execute("APPS.state.login_quene.show = false;");
    main_browser.execute("APPS.state.login.show = true;");
    mp.events.call("Disablechat");
});
mp.events.add('Enablechat', function () {
    mp.game.ui.displayRadar(true);
    mp.gui.chat.activate(true);
    mp.gui.chat.show(true);
});
mp.events.add('Disablechat', function (player) {
	mp.gui.chat.activate(false);
	mp.gui.chat.show(false);
});

mp.events.add("GrandGanglife:Client:OpenCase", function (grandpoints, grandcoins, money, case_exp, total_score, daynight) {
    mp.gui.cursor.show(true, true);
    mp.game.ui.displayRadar(false);
    mp.players.local.freezePosition(true);
    main_browser.execute("APPS.state.cases.show = true;");
	main_browser.execute("APPS.state.cases.grandpoints = " + grandpoints);
	main_browser.execute("APPS.state.cases.grandcoins = " + grandcoins);
	main_browser.execute("APPS.state.cases.money = " + money);
	main_browser.execute("APPS.state.cases.case_exp = [" + case_exp + "];");
	main_browser.execute("APPS.state.cases.total_score = " + total_score);


    main_browser.execute("APPS.state.cases.gender = " + -1);
    main_browser.execute("APPS.state.cases.opening = " + 0);
    main_browser.execute("APPS.state.cases.day_night = " + daynight);
});


mp.events.add('playerReady', () => {
    setTimeout(() => {
        mp.gui.chat.show(false);
    }, 500)
    mp.game.gameplay.disableAutomaticRespawn(true);
    mp.game.gameplay.ignoreNextRestart(true);

    mp.game.gameplay.setFadeInAfterDeathArrest(false);
    mp.game.gameplay.setFadeOutAfterDeath(false);
    mp.game.gameplay.setFadeInAfterLoad(false);

    //mp.events.call("Disablechat");
    //setTimeout(() => {
    var randomcam = Math.floor(Math.random() * (13 - 0)) + 0;
    //
    switch (randomcam) {
        case 0:
            //zpos = mp.game.gameplay.getGroundZFor3dCoord(mp.players.local.position.x, mp.players.local.position.y, mp.players.local.position.z, 0.0, false);
            mp.players.local.position = new mp.Vector3(22.813, -582.146, 31.625);
            sceneryCamera = mp.cameras.new('default', new mp.Vector3(23.445695877075195, -580.3161010742188, 294.0935974121094), new mp.Vector3(0, 0, 0), 40);
            sceneryCamera.pointAtCoord(20.50064468383789, -583.344482421875, 292.6960144042969);
            break;
        case 1:
            mp.players.local.position = new mp.Vector3(2429.513, 3769.841, 40.528);
            sceneryCamera = mp.cameras.new('default', new mp.Vector3(2429.733154296875, 3769.856201171875, 56.71295166015625), new mp.Vector3(0, 0, 0), 40);
            sceneryCamera.pointAtCoord(2500.53173828125, 3782.931640625, 48.26481628417969);
            break;
        case 2:
            mp.players.local.position = new mp.Vector3(-1341.079, -1595.156, 3.553);
            sceneryCamera = mp.cameras.new('default', new mp.Vector3(-1340.187255859375, -1595.8428955078125, 49.43791580200195), new mp.Vector3(0, 0, 0), 40);
            sceneryCamera.pointAtCoord(-1310.8848876953125, -1354.2581787109375, 6.989421844482422);
            break;
        case 3:
            mp.players.local.position = new mp.Vector3(892.947, 910.235, 194.098);
            sceneryCamera = mp.cameras.new('default', new mp.Vector3(885.670166015625, 911.8387451171875, 350.6573486328125), new mp.Vector3(0, 0, 0), 40);
            sceneryCamera.pointAtCoord(405.8322448730469, 1327.3505859375, 283.1975402832031);
            break;
        //
        case 4:
            mp.players.local.position = new mp.Vector3(-2224.261, 2709.865, 2.903);
            sceneryCamera = mp.cameras.new('default', new mp.Vector3(-2224.54638671875, 2710.178955078125, 21.46501922607422), new mp.Vector3(0, 0, 0), 40);
            sceneryCamera.pointAtCoord(-2359.283447265625, 2699.5244140625, 1.9513435363769531);
            break;
        case 5:
            mp.players.local.position = new mp.Vector3(-2092.109, 4547.122, 3.882);
            sceneryCamera = mp.cameras.new('default', new mp.Vector3(-2092.257568359375, 4547.20361328125, 59.0174674987793), new mp.Vector3(0, 0, 0), 40);
            sceneryCamera.pointAtCoord(-1975.33349609375, 4554.35693359375, 42.48538589477539);
            break;
        case 6:
            mp.players.local.position = new mp.Vector3(-390.277, 3009.085, 14.926);
            sceneryCamera = mp.cameras.new('default', new mp.Vector3(-386.7982482910156, 2997.361328125, 34.09531784057617), new mp.Vector3(0, 0, 0), 40);
            sceneryCamera.pointAtCoord(-303.9058837890625, 3024.150146484375, 16.156888961791992);
            break;
        case 7:
            mp.players.local.position = new mp.Vector3(2824.370, 874.502, 1.985);
            sceneryCamera = mp.cameras.new('default', new mp.Vector3(2860.5107421875, 897.8576049804688, 23.19618034362793), new mp.Vector3(0, 0, 0), 40);
            sceneryCamera.pointAtCoord(2920.83935546875, 805.736572265625, 11.026789665222168);
            break;
        case 8:
            mp.players.local.position = new mp.Vector3(315.158, -331.641, 48.548);
            sceneryCamera = mp.cameras.new('default', new mp.Vector3(315.12939453125, -330.9305114746094, 114.22130584716797), new mp.Vector3(0, 0, 0), 40);
            sceneryCamera.pointAtCoord(239.8555908203125, -412.3272705078125, 93.51347351074219);
            break;
        case 9:
            mp.players.local.position = new mp.Vector3(-2096.730, -1017.389, 8.980);
            sceneryCamera = mp.cameras.new('default', new mp.Vector3(-2202.66845703125, -1072.651611328125, 14.606544494628906), new mp.Vector3(0, 0, 0), 40);
            sceneryCamera.pointAtCoord(-2073.4853515625, -1027.6488037109375, 5.77520227432251);
            break;
        case 10:
            mp.players.local.position = new mp.Vector3(-43.054, 1066.213, 221.465);
            sceneryCamera = mp.cameras.new('default', new mp.Vector3(-32.671573638916016, 1078.701171875, 274.2003479003906), new mp.Vector3(0, 0, 0), 40);
            sceneryCamera.pointAtCoord(128.6531982421875, 813.7239990234375, 200.72268676757812);
            break;
        case 11:
            mp.players.local.position = new mp.Vector3(1074.866, -516.734, 62.660);
            sceneryCamera = mp.cameras.new('default', new mp.Vector3(1074.822998046875, -516.50439453125, 69.22357177734375), new mp.Vector3(0, 0, 0), 40);
            sceneryCamera.pointAtCoord(1113.0736083984375, -638.3034057617188, 57.3095588684082);
            break;
        case 12:
            mp.players.local.position = new mp.Vector3(2063.218, 133.020, 171.084);
            sceneryCamera = mp.cameras.new('default', new mp.Vector3(1988.56201171875, 153.00619506835938, 172.7399139404297), new mp.Vector3(0, 0, 0), 40);
            sceneryCamera.pointAtCoord(1789.742431640625, 58.4521484375, 146.29302978515625);
            break;
        case 13:
            mp.players.local.position = new mp.Vector3(653.431, -904.348, 22.049);
            sceneryCamera = mp.cameras.new('default', new mp.Vector3(653.0076904296875, -904.460205078125, 33.22127914428711), new mp.Vector3(0, 0, 0), 40);
            sceneryCamera.pointAtCoord(533.2747192382812, -864.9227294921875, 38.3217887878418);
            break;
    }
    mp.gui.cursor.show(true, true);
    setTimeout(function () {
        mp.gui.cursor.show(true, true);
    }, 1000);
    mp.players.local.freezePosition(true);
    sceneryCamera.setActive(true);
    mp.game.cam.renderScriptCams(true, false, 2000, true, false);
})


mp.events.add("Login_Error", function (msg) {
   // PlayAudioSound('DELETE', 'HUD_DEATHMATCH_SOUNDSET');
    main_browser.execute("APP.sendErrorMessage('" + msg + "');");
});


mp.events.add("LoginClose", function (state) {

    mp.game.cam.renderScriptCams(false, false, 2000, false, false);
    sceneryCamera.destroy();


    mp.gui.cursor.show(false, false);
    mp.game.ui.displayRadar(false);
    mp.players.local.freezePosition(false);
    main_browser.execute("APPS.state.login.opened = false;");
    main_browser.execute("APPS.state.login.show = false;");

	if(state == 1)
	{
		mp.events.call("Enablechat");
	}
});

mp.events.add("loginDataToServer", function (user, pass, state) {
    mp.events.callRemote("sendDataToServer", user, pass, state);
});

mp.events.add("SendDataToRegister", function (user, pass, email, promo, state, name, surname) {
    mp.events.callRemote("SendDataToRegisterServer", user, pass, email, promo, state, name, surname);

});


mp.events.add("Client_Registration", function () {
    main_browser.execute("APPS.state.login.show = false;");
    var json = "{\"step\":1,\"login\":'',\"password\":'',\"password2\":'',\"email\":'',\"opened\":true,\"show\":true}";
    main_browser.execute("APPS.state.registration = " + json);
});

mp.events.add("RegNextStep", function (nextacces) {
    main_browser.execute("APPS.state.registration.step = 3");
});
mp.events.add("RegNextStep2", function (nextacces) {
    main_browser.execute("APPS.state.registration.step = 2");
});

mp.events.add("RegNextStep", function (nextacces) {
    if (nextacces == 0) {
        mp.game.audio.playSound(-1, "DELETE", "HUD_DEATHMATCH_SOUNDSET", true, 0, true);
        main_browser.execute("APP.sendErrorMessage('" + language["?????? E-Mail ??? ???????????????"][curr_lang] + "');");
    } else main_browser.execute("APPS.state.registration.step = 3");
});
mp.events.add("RegNextStep2", function (nextacces) {
    if (nextacces == 0) {
        mp.game.audio.playSound(-1, "DELETE", "HUD_DEATHMATCH_SOUNDSET", true, 0, true);
        main_browser.execute("APP.sendErrorMessage('" + language["?????? ????? ??? ???????????????"][curr_lang] + "');");
    } else main_browser.execute("APPS.state.registration.step = 2");
});

mp.events.add("CheckEmailRegister", function (email) {
    mp.events.callRemote("CheckEmailRegisterServer", email);
});

mp.events.add("CheckNameRegister", function (name) {
    mp.events.callRemote("CheckNameRegisterServer", name);
});

mp.events.add("Client_ToLoginFromReg", function () {
    main_browser.execute("APPS.state.registration.show = false;");
    var log = '';
    var json = "{\"login\":'" + log + "',\"password\":'',\"in_quene\":0,\"opened\":true,\"show\":true}";
    main_browser.execute("APPS.state.login = " + json);
    mp.gui.cursor.show(true, true);
});


var left_notif_interval = null;
var left_notif_progress = 0;
mp.events.add("Client_Left_Notification", function (msg, add_msg, status) {
	if (left_notif_interval) {
		clearInterval(left_notif_interval);
		left_notif_interval = null;
	}
	main_browser.execute('APPS.state.hud.left_notif_progress = 100;');
	main_browser.execute('APPS.state.hud.left_notif_text = \'' + msg + '\';');
	main_browser.execute('APPS.state.hud.left_notif_additional_text = \'' + add_msg + '\';');
	if (status == 0) main_browser.execute('APPS.state.hud.left_notif_status = 0;');else if (status == 1) main_browser.execute('APPS.state.hud.left_notif_status = 1;');
	main_browser.execute('APPS.state.hud.left_notif_show = true;');
	left_notif_progress = 100;
	left_notif_interval = setInterval(function () {
		left_notif_progress -= 1;
		main_browser.execute('APPS.state.hud.left_notif_progress = ' + left_notif_progress + ';');
		if (left_notif_progress <= 0) {
			clearInterval(left_notif_interval);
			left_notif_interval = null;
			main_browser.execute('APPS.state.hud.left_notif_show = false;');
			main_browser.execute('APPS.state.hud.left_notif_status = 0;');
		}
	}, 50);
});

var theft_timeout = null;
mp.events.add("Client_Theft_Notify", function (title, theft_text) {
	if (theft_timeout) {
		main_browser.execute('APPS.state.hud.theft_notif_show = false;');
		clearTimeout(theft_timeout);
		theft_timeout = null;
	}
	//PlayAudioSound('MP_AWARD', 'HUD_FRONTEND_DEFAULT_SOUNDSET');
    mp.game.audio.playSound(-1, "MP_AWARD", "HUD_FRONTEND_DEFAULT_SOUNDSET", true, 0, true);
	main_browser.execute('APPS.state.hud.theft_title = \'' + title + '\';');
	main_browser.execute('APPS.state.hud.theft_text = \'' + theft_text + '\';');
	main_browser.execute('APPS.state.hud.theft_notif_show = true;');
	theft_timeout = setTimeout(function () {
		theft_timeout = null;
		main_browser.execute('APPS.state.hud.theft_notif_show = false;');
	}, 10000);
});



var event_timeout = null;
mp.events.add("Client_Event_Notify", function (text) {
	if (curr_lang == 'ru' && mp.storage.data.new_design_show == 1 && playerincapture == true) return;
	if (event_timeout) {
		main_browser.execute('APPS.state.hud.event_show = false;');
		clearTimeout(event_timeout);
		event_timeout = null;
	}
    mp.game.audio.playSound(-1, "Zone_Team_Capture", "DLC_Apartments_Drop_Zone_Sounds", true, 0, true);
	main_browser.execute('APPS.state.hud.event_name = \'' + text + '\';');
	main_browser.execute('APPS.state.hud.fam_event = false;');
	main_browser.execute('APPS.state.hud.event_show = true;');
	event_timeout = setTimeout(function () {
		event_timeout = null;
		main_browser.execute('APPS.state.hud.event_show = false;');
	}, 5000);
});

mp.events.add("Client_Event_countdown", function (count) {
	main_browser.execute('APPS.state.hud.event_coutdown = ' + parseInt(count) + ';');
});


mp.events.add("MenuClose", function () {
	CloseMenu();
});

mp.events.add("Menu_Error", function (msg) {
    mp.game.audio.playSound(-1, "DELETE", "HUD_DEATHMATCH_SOUNDSET", true, 0, true);
	main_browser.execute("APP.sendErrorMessage('" + msg + "');");
});

global.CloseMenu = function () {
	main_browser.execute("APPS.state.main_menu.show = false;");
};

mp.events.add("MenuEvent", function (action) {
	//if (!menuOpen || !loggedin || chatActive) return;
	//if (new Date().getTime() - lastCheck < 500) return;
	//lastCheck = new Date().getTime();
	switch (action) {
		case 'referal':
			CloseMenu();
			mp.events.callRemote("Server_OpenReferalMenu");
			break;
		case 'ChristmasGifts':
			CloseMenu();
			mp.events.callRemote("Server_OpenChristmasGifts");
			break;
		case 'easter':
			CloseMenu();
			mp.events.callRemote("Server_OpenEasterMenu");
			break;
		case 'christmas':
			CloseMenu();
			mp.events.callRemote("Server_OpenChristmasMenu");
			break;
		case 'battlepass':
			CloseMenu();
			mp.events.callRemote("Server_OpenBattlePass");
			break;
		case 'birthday':
			CloseMenu();
			mp.events.callRemote("Server_OpenBirthdayDesign");
			break;
		case 'stats':
			CloseMenu();
			//mp.events.callRemote("Server_OpenStats");
            main_browser.execute("APPS.state.stats.show = true;");
			break;
		case 'inventory':
			CloseMenu();
			OpenInv();
			break;
		case 'report':
			CloseMenu();
			//
            main_browser.execute("APPS.state.report.show = true;");
			break;
		case 'donate':
			CloseMenu();
			//
            main_browser.execute("APPS.state.donate.show = true;");
			//mp.events.callRemote("ServerMenu", "donate");
			break;
		case 'MyJob':
			CloseMenu();
			//
			mp.events.callRemote("OpenJobHelpServer");
			break;
		case 'MyBattalions':
			CloseMenu();
			//
			mp.events.callRemote("Server_OpenBattalionsMenu");
			break;
		case 'MyOrg':
			mp.events.callRemote("OpenMemberInfo_Server");
			break;
		case 'MyBusiness':
			mp.events.callRemote("OpenBusinessMenu");
			break;
		case 'Achievments':
			CloseMenu();
			//
			mp.events.callRemote("OpenAchievments");
			break;
		case 'Daily':
			CloseMenu();
			//
			mp.events.callRemote("OpenDailyMissions");
			break;
		case 'settings':
			CloseMenu();
			//
			//mp.events.callRemote("Server_OpenSettings");
            main_browser.execute("APPS.state.settings.show = true;");
			break;
		case 'family':
			CloseMenu();
			//
			mp.events.callRemote("Server_OpenFamilyMenu");
			break;
	}
});






mp.events.add("Client_ShowNotification", function (msg, color) {
	ShowNotification(msg, color);
});

var notif_interval = null;
var notif_progress = 0;
global.ShowNotification = function (msg, color) {
	if (notif_interval) {
		clearInterval(notif_interval);
		notif_interval = null;
	}
	main_browser.execute('APPS.state.hud.notif_progress = 0;');
	main_browser.execute('APPS.state.hud.notif_text = \'' + msg + '\';');
	if (color == 2) main_browser.execute('APPS.state.hud.notif_status = 2;'), mp.game.audio.playSound(-1, "CLICK_BACK", "WEB_NAVIGATION_SOUNDS_PHONE", true, 0, true);else if (color == 6) main_browser.execute('APPS.state.hud.notif_status = 3;'), mp.game.audio.playSound(-1, "DELETE", "HUD_DEATHMATCH_SOUNDSET", true, 0, true);else if (color == 25) main_browser.execute('APPS.state.hud.notif_status = 1;'), mp.game.audio.playSound(-1, "Enter_1st", "GTAO_FM_Events_Soundset", true, 0, true);else if (color == 4) main_browser.execute('APPS.state.hud.notif_status = 4;'), mp.game.audio.playSound(-1, "Zone_Team_Capture", "DLC_Apartments_Drop_Zone_Sounds", true, 0, true);
		notif_progress = 0;
	notif_interval = setInterval(function () {    
		//mp.gui.chat.push(`${notif_progress}`);
		notif_progress += 1;
		main_browser.execute('APPS.state.hud.notif_progress = ' + notif_progress + ';');
		if (notif_progress >= 100) {
			//mp.gui.chat.push(`???????????`);
			clearInterval(notif_interval);
			notif_interval = null;
			main_browser.execute('APPS.state.hud.notif_status = 0;');
		}
	}, 50);
};

var report_status = 0;
mp.events.add("Client_SwitchReportStatus", function (state) {
    
	if (state == true) {
		report_status = 1;
		main_browser.execute('APPS.state.hud.hide_admin_reports = true;');
	} else {
		report_status = 0;
		main_browser.execute('APPS.state.hud.hide_admin_reports = false;');
	}
});

var cursor = 0;
mp.keys.bind(0x77, false, function () {
    if(mp.players.local.getVariable('InLogin') == true)
    {
       return;
    }
    if (cursor == 0) 
    {
        cursor = 1;
        mp.gui.cursor.show(true, true);
    }
    else
    {
        cursor = 0;
        mp.gui.cursor.show(false, false);
    }
});




mp.keys.bind(0x72, false, function () {
	mp.events.callRemote('Server_OpenAdminCenter');
});
var phoneopnened = 0;
mp.keys.bind(0x71, false, function () {
    if(mp.players.local.getVariable('InLogin') == true)
    {
       return;
    }
    if (phoneopnened == 0) 
    {
        phoneopnened = 1;
        main_browser.execute('APPS.state.hud_mobile.show = true;');
        mp.gui.cursor.show(true, true);
    }
    else
    {
        phoneopnened = 0;
        main_browser.execute('APPS.state.hud_mobile.show = false;');
        mp.gui.cursor.show(false, false);
    }
});
var invopnened = 0;
mp.keys.bind(0x49, false, function () {
    if(mp.players.local.getVariable('InLogin') == true)
    {
       return;
    }
    if (invopnened == 0) 
    {
        invopnened = 1;
       // main_browser.execute('APPS.state.inventory.show = true;');
        var _json24 = "{\"theme\":" + 1 + ",\"additional_strength\":" + 1 + ",\"sex\":" + 1 + ",\"prime\":" + 1 + ",\"refreshed\":1,\"key_1\":'" + GetKeyCode(1) + "',\"key_2\":'" + GetKeyCode(1) + "',\"key_3\":'" + GetKeyCode(1) + "',\"key_4\":'" + GetKeyCode(1) + "',\"key_5\":'" + GetKeyCode(1) + "',\"backpack\":[" + "" + "],\"pockets\":[" + "" + "],\"wearhead\":[" + "" + "],\"fastmenu\":[" + "" + "],\"trunk\":[\"\"],\"hovering\":[" + "" + "],\"ExtraName\":\"None\",\"additional_type\":0,\"individe\":false,\"backpack_level\": 0,\"backpack_size\": 0,\"backpack_max_size\": 20,\"show\":true}";
        main_browser.execute("APPS.state.inventory = " + _json24);
        mp.gui.cursor.show(true, true);
    }
    else
    {
        invopnened = 0;
        main_browser.execute('APPS.state.inventory.show = false;');
        mp.gui.cursor.show(false, false);
    }
});




var opened = 0;
mp.keys.bind(0x4D, false, function () {
    if(mp.players.local.getVariable('InLogin') == true)
    {
       return;
    }
	if (opened == 0) 
        {
            opened = 1;
            main_browser.execute('APPS.state.main_menu.show = true;');
            mp.gui.cursor.show(true, true);
        }
        else
        {
            opened = 0;
            main_browser.execute('APPS.state.main_menu.show = false;');
            mp.gui.cursor.show(false, false);
            
        }
});


global.AdminCenterOpened = false;

mp.events.add("Client_OpenAdminCenter", function (report_pool, leader_pool, biz_pool, admin_pool, teleport_pool, house_pool, admin_level, kill_log) {
	var duel_room_json = '{"kill_log":' + JSON.stringify(kill_log) + ',"report_info":' + JSON.stringify(report_pool) + ',"report_name":"","report_level":0,"report_is_media":0,"report_player_id":0,"in_report_data":[],"leader_info":' + JSON.stringify(leader_pool) + ',"punishment_name":"","punishment_pid":0,"punishment_info":[],"biz_info":' + JSON.stringify(biz_pool) + ',"admin_info":' + JSON.stringify(admin_pool) + ',"teleport_info":' + JSON.stringify(teleport_pool) + ',"family_info":' + JSON.stringify(house_pool) + ',"adm_level":' + admin_level + ',"add_report_line":"","show":true}';
	main_browser.execute('APPS.state.apanel = ' + duel_room_json);
	AdminCenterOpened = true;
	mp.events.call("Disablechat");
	mp.game.ui.displayRadar(false);
	mp.gui.cursor.show(true, true);
});

mp.events.addDataHandler('SetAduty', function (state) {
    if(state == true)
    {
        mp.players.local.setAlpha(100);
    }
    else
    {
        mp.players.local.setAlpha(255);
    }
});

mp.events.addDataHandler('SetAduty', function (state) {
    if(state == true)
    {
        mp.players.local.setAlpha(100);
    }
    else
    {
        mp.players.local.setAlpha(255);
    }
});



mp.events.add("LoadHud", function (pid, money, bankmoney, hour, minute, month, day, year) {
    main_browser.execute("APPS.state.hud.show = true;");

	if (minute < 10) main_browser.execute('APPS.state.hud.time = "' + hour + ':0' + minute + '";');else main_browser.execute('APPS.state.hud.time = "' + hour + ':' + minute + '";');
	//
	if (month < 10) {
		if (day < 10) main_browser.execute('APPS.state.hud.date = "0' + day + '.0' + month + '.' + year + '";');else main_browser.execute('APPS.state.hud.date = "' + day + '.0' + month + '.' + year + '";');
	} else {
		if (day < 10) main_browser.execute('APPS.state.hud.date = "0' + day + '.' + month + '.' + year + '";');else main_browser.execute('APPS.state.hud.date = "' + day + '.' + month + '.' + year + '";');
	}


    main_browser.execute('APPS.state.hud.server = ' + 1 + ';');
	main_browser.execute('APPS.state.hud.pid = ' + pid + ';');
	main_browser.execute('APPS.state.hud.money = ' + money + ';');
	main_browser.execute('APPS.state.hud.bankmoney = ' + bankmoney + ';');
    main_browser.execute('APPS.state.hud.online = ' + 0 + ';');


    setInterval(function () {
        var today = new Date();
        var hour = today.getUTCHours() + 3;
        if (curr_lang == 'de' || curr_lang == 'rs' || curr_lang == 'it' || curr_lang == 'fr' || curr_lang == 'es') {
            hour = today.getUTCHours() + 2;
            if (hour == -5) hour = 19;else if (hour == -4) hour = 20;else if (hour == -3) hour = 21;else if (hour == -2) hour = 22;else if (hour == -1) hour = 23;
        }
        var minute = today.getUTCMinutes();
        if (hour == 24) hour = 0;else if (hour == 25) hour = 1;else if (hour == 26) hour = 2;else if (hour == 27) hour = 3;else if (hour == 28) hour = 4;
        
        if (minute < 10) main_browser.execute('APPS.state.hud.time = "' + hour + ':0' + minute + '";');else main_browser.execute('APPS.state.hud.time = "' + hour + ':' + minute + '";');
        }, 1000);
});

mp.nametags.enabled = false;

mp.events.add('render', (nametags) => {
    nametags.forEach(nametag => {
        let [player] = nametag;
		
           var pos = player.getBoneCoords(23553, 0.5, 0, 0);
           var text = "";
           var color = "";

           if(player.getVariable('AdminDuty') == true)
           {
            text = "Administrator~n~ID: "+player.getVariable('PlayerId')+"~n~" + player.name.replace('_', ' ');
            color = [255, 0, 0, 255];
           }
           else
           {
            text = "ID: "+player.getVariable('PlayerId')+"~n~" + player.name.replace('_', ' ');
            color = [255, 255, 255, 255];
           }


           mp.game.graphics.drawText(text, [pos.x, pos.y, pos.z + 0.65], {
            font: 0,
            color: color,
            scale: [0.30, 0.30],
            outline: true
        });
    })
})
















var in_reg = true;
var motherindex = 0;
var fatherindex = 0;
var similarityindex = 50.0;

var nosedata = new Array(20);
var eyebrows = 0;
var eyecolor = 0;
var hairstyle = 0;
var haircolor = 0;
var beard = 0;
//
var shirts = 0;
var jeans = 0;
var boots = 0;

var maleshirts = [9, 13, 33, 71];
var femaleshirts = [27, 14, 68, 73];
var malejeans = [5, 75, 7];
var femalejeans = [76, 7, 25];
var maleboots = [1, 42, 6];
var femaleboots = [0, 4, 10];

var beards = [255, 0, 1, 2, 3, 4, 5];
var HairNames = ["Haare1", "Haare2", , "Haare3", "Haare4"];
var fathers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 42, 43, 44];
var mothers = [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 45];

var fatherNames = ["Jennifer", "Bibi", "Juju", "Katja"];
var motherNames = ["Esel", "Aspect", "Bernd", "Markus", "Justin Bieber"];
var appearanceItemNames = [[[1]["Test"]],[[2]["Mero"]]];
var eyeColors = [1,2];
    


mp.events.add("SetCharacterSex", function (sex) {
	mp.game.cam.renderScriptCams(true, false, 0, true, false);
	mp.players.local.model = sex ? mp.game.joaat("mp_m_freemode_01") : mp.game.joaat("mp_f_freemode_01");
	var bGender = true;
	if (mp.players.local.model != 1885233650) {
		bGender = false;
	}
	//????? ?? ?????? ????????
	mp.players.local.setComponentVariation(8, 15, 0, 0);
	//????? ????
	mp.players.local.setComponentVariation(3, 0, 0, 0);
	//
	if (bGender == true) {
		/*
  if(maleshirts[shirts] >= 16)mp.players.local.setComponentVariation(11, maleshirts[shirts]+10, 0, 0);
  else 
  */
		mp.players.local.setComponentVariation(11, maleshirts[shirts], 0, 0);
	} else mp.players.local.setComponentVariation(11, femaleshirts[shirts], 0, 0);
	if (bGender == true) {
		/*
  if(malejeans[jeans] >= 16)mp.players.local.setComponentVariation(4, malejeans[jeans]+3, 0, 0);
  else 
  */
		mp.players.local.setComponentVariation(4, malejeans[jeans], 0, 0);
	} else mp.players.local.setComponentVariation(4, femalejeans[jeans], 0, 0);
	if (bGender == true) {
		/*
  if(maleboots[boots] >= 16)mp.players.local.setComponentVariation(6, maleboots[boots]+5, 0, 0);
  else 
  */
		mp.players.local.setComponentVariation(6, maleboots[boots], 0, 0);
	} else mp.players.local.setComponentVariation(6, femaleboots[boots], 0, 0);
	//
	mp.players.local.setHeadOverlay(2, eyebrows, 1.0, 1, 1);
	mp.players.local.setEyeColor(eyecolor);
	mp.players.local.setComponentVariation(2, hairstyle, 0, 0);
	mp.players.local.setHairColor(haircolor, 0);
	mp.players.local.setHeadOverlay(1, beards[beard], 1.0, 1, 1);
	//
	UpdateParents(motherindex, fatherindex, similarityindex);

	main_browser.execute("APPS.state.create_person.mom_name = \"" + motherNames[motherindex] + "\"");
	main_browser.execute("APPS.state.create_person.dad_name = \"" + fatherNames[fatherindex] + "\"");
	//
	//HintShow('??????? ????? ?????? ???? ? ???????? ?????????');
});
function UpdateParents(mother, father, similarity) {
	mp.players.local.setHeadBlendData(
	// shape
	mothers[mother], fathers[father], 0,

	// skin
	mothers[mother], fathers[father], 0,

	// mixes
	similarity * 0.01, similarity * 0.01, 0.0, false);
}

mp.events.add("Create_ClearAnim", function () {
	mp.players.local.taskPlayAnim("amb@world_human_guard_patrol@male@base", "base", 8.0, 1, -1, 1, 0.0, false, false, false);
	mp.players.local.stopAnim("amb@world_human_guard_patrol@male@base", "base", 0.0);
});



mp.events.add("SetShirtsValue", function (index) {
	var bGender = true;
	if (mp.players.local.model != 1885233650) {
		bGender = false;
	}
	if (index == 0) {
		if (shirts - 1 < 0) shirts = maleshirts.length - 1;else shirts = shirts - 1;
	} else {
		if (shirts + 1 >= maleshirts.length) shirts = 0;else shirts = shirts + 1;
	}
	if (bGender == true) {
		/*
  if(maleshirts[shirts] >= 16)mp.players.local.setComponentVariation(11, maleshirts[shirts]+10, 0, 0);
  else 
  */
		mp.players.local.setComponentVariation(11, maleshirts[shirts], 0, 0);
	} else mp.players.local.setComponentVariation(11, femaleshirts[shirts], 0, 0);
});
mp.events.add("SetJeansValue", function (index) {
	var bGender = true;
	if (mp.players.local.model != 1885233650) {
		bGender = false;
	}
	if (index == 0) {
		if (jeans - 1 < 0) jeans = malejeans.length - 1;else jeans = jeans - 1;
	} else {
		if (jeans + 1 >= malejeans.length) jeans = 0;else jeans = jeans + 1;
	}
	if (bGender == true) {
		/*
  if(malejeans[jeans] >= 16)mp.players.local.setComponentVariation(4, malejeans[jeans]+3, 0, 0);
  else 
  */
		mp.players.local.setComponentVariation(4, malejeans[jeans], 0, 0);
	} else mp.players.local.setComponentVariation(4, femalejeans[jeans], 0, 0);
});
mp.events.add("SetBootsValue", function (index) {
	var bGender = true;
	if (mp.players.local.model != 1885233650) {
		bGender = false;
	}
	if (index == 0) {
		if (boots - 1 < 0) boots = maleboots.length - 1;else boots = boots - 1;
	} else {
		if (boots + 1 >= maleboots.length) boots = 0;else boots = boots + 1;
	}
	if (bGender == true) {
		/*
  if(maleboots[boots] >= 16)mp.players.local.setComponentVariation(6, maleboots[boots]+5, 0, 0);
  else 
  */
		mp.players.local.setComponentVariation(6, maleboots[boots], 0, 0);
	} else mp.players.local.setComponentVariation(6, femaleboots[boots], 0, 0);
});

mp.events.add("SetEyeBrowValue", function (index) {
	if (index == 0) {
		if (eyebrows - 1 < 0) eyebrows = 33;else eyebrows = eyebrows - 1;
	} else {
		if (eyebrows + 1 >= 34) eyebrows = 0;else eyebrows = eyebrows + 1;
	}
	//main_browser.execute(`$('#BrowName').text("`+appearanceItemNames[2][eyebrows]+`");`);
	if (in_reg == true) main_browser.execute("APPS.state.create_person.brow_name = '" + appearanceItemNames[2][eyebrows] + "';");else main_browser.execute("APPS.state.change_face.brow_name = '" + appearanceItemNames[2][eyebrows] + "';");
	mp.players.local.setHeadOverlay(2, eyebrows, 1.0, 1, 1);
});
mp.events.add("SetBeardValue", function (index) {
	var bGender = 0;
	if (mp.players.local.model != 1885233650) {
		bGender = 1;
	}
	if (bGender != 0) return;
	if (index == 0) {
		if (beard - 1 < 0) beard = beards.length - 1;else beard = beard - 1;
	} else {
		if (beard + 1 >= beards.length) beard = 0;else beard = beard + 1;
	}
	if (in_reg == true) main_browser.execute("APPS.state.create_person.beard_name = '" + appearanceItemNames[1][beard] + "';");
	//else main_browser.execute(`APPS.state.change_face.beard_name = '`+appearanceItemNames[1][beard]+`';`);
	mp.players.local.setHeadOverlay(1, beards[beard], 1.0, 1, 1);
});
mp.events.add("SetEyeColorValue", function (index) {
	if (index == 0) {
		if (eyecolor - 1 < 0) eyecolor = 31;else eyecolor = eyecolor - 1;
	} else {
		if (eyecolor + 1 >= 32) eyecolor = 0;else eyecolor = eyecolor + 1;
	}
	//main_browser.execute(`$('#EyeName').text("`+eyeColors[eyecolor]+`");`);
	if (in_reg == true) main_browser.execute("APPS.state.create_person.eye_name = '" + eyeColors[eyecolor] + "';");else main_browser.execute("APPS.state.change_face.eye_name = '" + eyeColors[eyecolor] + "';");
	mp.players.local.setEyeColor(eyecolor);
});
mp.events.add("SetHairStyleValue", function (index) {
	if (index == 0) {
		if (hairstyle - 1 < 0) hairstyle = 9;else hairstyle = hairstyle - 1;
	} else {
		if (hairstyle + 1 >= 10) hairstyle = 0;else hairstyle = hairstyle + 1;
	}
	if (in_reg == true) main_browser.execute("APPS.state.create_person.hair_name = '" + HairNames[hairstyle] + "';");
	//else main_browser.execute(`$('#HairName').text("`+HairNames[hairstyle]+`");`);
	mp.players.local.setComponentVariation(2, hairstyle, 0, 0);
});

mp.events.add("SetHairColorValue", function (index) {
	if (index == 0) {
		if (haircolor - 1 < 0) haircolor = 20;else haircolor = haircolor - 1;
	} else {
		if (haircolor + 1 >= 21) haircolor = 0;else haircolor = haircolor + 1;
	}
	if (in_reg == true) main_browser.execute("APPS.state.create_person.hair_color = '" + haircolor + "';");
	//main_browser.execute(`$('#HairColorName').text("`+haircolor+`");`);
	mp.players.local.setHairColor(haircolor, 0);
});

mp.events.add("SetNose", function (index, value) {
	if (!index) return;
	index = parseInt(index);
	index--;
	nosedata[index] = value;
	UpdateAppearence(index, value);
});


function UpdateAppearence(index, scale) {
	mp.players.local.setFaceFeature(parseInt(index), parseFloat(scale));
}



mp.events.add("SetSimilarity", function (value) {
	similarityindex = value;
	UpdateParents(motherindex, fatherindex, similarityindex);
});
mp.events.add("SetMotherValue", function (value) {
	if (value == 0) {
		if (motherindex - 1 < 0) motherindex = mothers.length - 1;else motherindex = motherindex - 1;
	} else if (value == 1) {
		if (motherindex + 1 >= mothers.length) motherindex = 0;else motherindex = motherindex + 1;
	}
	if (in_reg == true) main_browser.execute("APPS.state.create_person.mom_name = '" + motherNames[motherindex] + "';");else main_browser.execute("APPS.state.change_face.mom_name = '" + motherNames[motherindex] + "';");
	UpdateParents(motherindex, fatherindex, similarityindex);
});
mp.events.add("SetFatherValue", function (value) {
	if (value == 0) {
		if (fatherindex - 1 < 0) fatherindex = fathers.length - 1;else fatherindex = fatherindex - 1;
	} else if (value == 1) {
		if (fatherindex + 1 >= fathers.length) fatherindex = 0;else fatherindex = fatherindex + 1;
	}
	if (in_reg == true) main_browser.execute("APPS.state.create_person.dad_name = '" + fatherNames[fatherindex] + "';");else main_browser.execute("APPS.state.change_face.dad_name = '" + fatherNames[fatherindex] + "';");
	UpdateParents(motherindex, fatherindex, similarityindex);
});

mp.events.add("SetRandomValue", function (value) {
	if (value == 0) {
		fatherindex = Math.floor(Math.random() * (fathers.length - 1 - 0)) + 0;
		motherindex = Math.floor(Math.random() * (mothers.length - 1 - 0)) + 0;
		similarityindex = Math.floor(Math.random() * (100 - 0)) + 0;

		if (in_reg == true) {
			main_browser.execute("APPS.state.create_person.sliders_similarity = " + similarityindex + ";");
			main_browser.execute("APPS.state.create_person.mom_name = '" + motherNames[motherindex] + "';");
			main_browser.execute("APPS.state.create_person.dad_name = '" + fatherNames[fatherindex] + "';");
		} else {
			main_browser.execute("APPS.state.change_face.sliders_similarity = " + similarityindex + ";");
			main_browser.execute("APPS.state.change_face.mom_name = '" + motherNames[motherindex] + "';");
			main_browser.execute("APPS.state.change_face.dad_name = '" + fatherNames[fatherindex] + "';");
		}
		UpdateParents(motherindex, fatherindex, similarityindex);
	} else if (value == 1) {
		fatherindex = Math.floor(Math.random() * (fathers.length - 1 - 0)) + 0;
		motherindex = Math.floor(Math.random() * (mothers.length - 1 - 0)) + 0;
		similarityindex = Math.floor(Math.random() * (100 - 0)) + 0;

		if (in_reg == true) {
			main_browser.execute("APPS.state.create_person.sliders_similarity = " + similarityindex + ";");
			main_browser.execute("APPS.state.create_person.mom_name = '" + motherNames[motherindex] + "';");
			main_browser.execute("APPS.state.create_person.dad_name = '" + fatherNames[fatherindex] + "';");
		} else {
			main_browser.execute("APPS.state.change_face.sliders_similarity = " + similarityindex + ";");
			main_browser.execute("APPS.state.change_face.mom_name = '" + motherNames[motherindex] + "';");
			main_browser.execute("APPS.state.change_face.dad_name = '" + fatherNames[fatherindex] + "';");
		}
		UpdateParents(motherindex, fatherindex, similarityindex);
		//
		for (var i = 0; i < nosedata.length; i++) {
			if (i == 13) nosedata[i] = Math.random() * (0.0 - 1.0) + 1.0; //).toFixed(1);
			else nosedata[i] = Math.random() * (-1.0 - 1.0) + 1.0; //).toFixed(1);
			if (in_reg == true) main_browser.execute("APPS.state.create_person.sliders[" + i + "] = " + nosedata[i] + ";");else main_browser.execute("APPS.state.change_face.sliders[" + i + "] = " + nosedata[i] + ";");
			UpdateAppearence(i, nosedata[i]);
		}
		eyebrows = Math.floor(Math.random() * (33 - 0)) + 0;
		//main_browser.execute(`$('#BrowName').text("`+appearanceItemNames[2][eyebrows]+`");`);
		if (in_reg == true) main_browser.execute("APPS.state.create_person.brow_name = '" + appearanceItemNames[2][eyebrows] + "';");else main_browser.execute("APPS.state.change_face.brow_name = '" + appearanceItemNames[2][eyebrows] + "';");
		mp.players.local.setHeadOverlay(2, eyebrows, 1.0, 1, 1);
		//
		eyecolor = Math.floor(Math.random() * (31 - 0)) + 0;
		//main_browser.execute(`$('#EyeName').text("`+eyeColors[eyecolor]+`");`);
		if (in_reg == true) main_browser.execute("APPS.state.create_person.eye_name = '" + eyeColors[eyecolor] + "';");else main_browser.execute("APPS.state.change_face.eye_name = '" + eyeColors[eyecolor] + "';");
		mp.players.local.setEyeColor(eyecolor);
	} else if (value == 2) {
		hairstyle = Math.floor(Math.random() * (10 - 0)) + 0;
		//main_browser.execute(`$('#HairName').text("`+HairNames[hairstyle]+`");`);
		main_browser.execute("APPS.state.create_person.hair_name = '" + HairNames[hairstyle] + "';");
		mp.players.local.setComponentVariation(2, hairstyle, 0, 0);
		//
		haircolor = Math.floor(Math.random() * (20 - 0)) + 0;
		//main_browser.execute(`$('#HairColorName').text("`+haircolor+`");`);
		main_browser.execute("APPS.state.create_person.hair_color = '" + haircolor + "';");
		mp.players.local.setHairColor(haircolor, 0);
		//
		var bGender = true;
		if (mp.players.local.model != 1885233650) {
			bGender = false;
		}
		if (bGender == true) {
			beard = Math.floor(Math.random() * (beards.length - 1 - 0)) + 0;
			main_browser.execute("APPS.state.create_person.beard_name = '" + appearanceItemNames[1][beard] + "';");
			//main_browser.execute(`$('#BeardName').text("`+appearanceItemNames[1][beard]+`");`);
			mp.players.local.setHeadOverlay(1, beards[beard], 1.0, 1, 1);
		}

		boots = Math.floor(Math.random() * (maleboots.length - 1 - 0)) + 0;
		if (bGender == true) {
			/*
   if(maleboots[boots] >= 16)mp.players.local.setComponentVariation(6, maleboots[boots]+5, 0, 0);
   else 
   */
			mp.players.local.setComponentVariation(6, maleboots[boots], 0, 0);
		} else mp.players.local.setComponentVariation(6, femaleboots[boots], 0, 0);
		//
		jeans = Math.floor(Math.random() * (malejeans.length - 1 - 0)) + 0;
		if (bGender == true) {
			/*
   if(malejeans[jeans] >= 16)mp.players.local.setComponentVariation(4, malejeans[jeans]+3, 0, 0);
   else 
   */
			mp.players.local.setComponentVariation(4, malejeans[jeans], 0, 0);
		} else mp.players.local.setComponentVariation(4, femalejeans[jeans], 0, 0);
		//
		shirts = Math.floor(Math.random() * (maleshirts.length - 1 - 0)) + 0;
		if (bGender == true) {
			/*
   if(maleshirts[shirts] >= 16)mp.players.local.setComponentVariation(11, maleshirts[shirts]+10, 0, 0);
   else
   */
			mp.players.local.setComponentVariation(11, maleshirts[shirts], 0, 0);
		} else mp.players.local.setComponentVariation(11, femaleshirts[shirts], 0, 0);
	}
});