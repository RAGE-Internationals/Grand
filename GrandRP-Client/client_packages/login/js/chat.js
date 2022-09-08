let chat =
{
	size: 0,
	container: null,
	input: null,
	enabled: false,
    active: true,
    timer: null,
	timerPush: null,
    //previous: "",
    prevmsg: ["", "", "", "", "", "", "", "", "", ""],
    steplist: 0, // В какую ячейку истории записать следующее отправленное сообщение
    backlist: 0, // Какую ячейку сейчас просматриваем из сохраненных в истории
	hide_chat: 30*1000 // 15 - seconds
};

function ChangeEfirState(state){
    if(state == true)$('#efir').show();
    else $('#efir').hide();
}

function ChangeFamState(state){
    if(state == true)$('#famchat').show();
    else $('#famchat').hide();
}

function ChangeChatsState(member,job,is_gos_show = 0,is_depart_show = 0){
    $('#racion').hide();
    $('#nonrpracionid').hide();
    $('#gos').hide();
    $('#departament').hide();
    $('#efir').hide();
    $('#megaphone').hide();
    if(member > 0){
        $('#racion').show();
        $('#nonrpracionid').show();
        if(is_gos_show == 1 && member < 7 || is_gos_show == 1 && member > 11 && member != 13 && member != 15 && member != 16 && member != 17){
            $('#gos').show();
        }
        if(is_depart_show == 1 && member < 7 || is_depart_show == 1 && member > 11 && member != 13 && member != 15 && member != 16 && member != 17){
            $('#departament').show();
        }
        if(member == 3 || member == 4 || member == 12){
            $('#megaphone').show();
        }
        if(member == 13){
            $('#efir').show();
        }
    }
    else if(job > 0){
        $('#racion').show();
        $('#nonrpracionid').show();
    }
}

var triggerTMP = Symbol();
var trigger = Symbol();

class mp_fix {
	constructor(power) {
		this[triggerTMP] = null;
		try {
			this[triggerTMP] = window.mp.trigger;
			window.mp.trigger = null;
		}
		catch(err) {
			
		}
	}
	changeChatState(state) {
		this[trigger]("changeChatState", state);
	}
	Client_SendSMSFromChat(text) {
		this[trigger]("Client_SendSMSFromChat", text);
	}
	Client_SendCallFromChat(text) {
		this[trigger]("Client_SendCallFromChat", text);
	}
	ClientSendMessage(value,sendcheck) {
		this[trigger]("ClientSendMessage", value,sendcheck);
	}
	
	[trigger](...args)
	{
		return this[triggerTMP].apply(null, args);
	}
}
var class_mp = new mp_fix();

var chatAPI =
{
    push: (text,name = '',type = 999,color = '',nonrp = false,additional = 0) =>
    {
        chat.size++;
        if (chat.size >= 50)
        {
            chat.container.children(":last").remove();
        }
        clearTimeout(chat.timer);
        clearTimeout(chat.timerPush);
        
        $("#chat").css("opacity", 1.0);
        $(".chat-posts").css("overflow",'overlay');
        hideTimer();
        //console.log(`CHAT: ${text} | ${name} | ${type} | ${color}`);
        //chat.container.prepend(`<p class="chat-post">` + text + `</p>`);
        if(type == 0)chat.container.prepend(`<div class="chat-post" style="color: #${color}"><strong>` + name + `</strong>` + text + `</div>`);
        else if(type == 1)chat.container.prepend(`<div class="chat-post" style="color: #${color}"><strong>(( ` + name + `</strong>` + text + ` ))</div>`);
        else if(type == 3){
            if(nonrp == true)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-police">${color} ${name}:</strong>(( ${text} ))</div>`);
            else chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-police">${color} ${name}:</strong>${text}</div>`);        
        }
        else if(type == 131)chat.container.prepend(`<div class="chat-post smi-ad property"><span>сми</span><div class = "chat-smi-wrap"><span>${text}</span><span><list class = "chat-post-buttons"><button class = "chat-post-button" onclick = "SendCall(${color})"><img src = "images/chat/phone.svg"></button><button class = "chat-post-button" onclick = "SendSMS(${color})"><img src = "images/chat/sms.svg"></button></list>Отправитель: ${name}</span></div></div>`);
        else if(type == 132)chat.container.prepend(`<div class="chat-post smi-ad auto"><span>сми</span><div class = "chat-smi-wrap"><span>${text}</span><span><list class = "chat-post-buttons"><button class = "chat-post-button" onclick = "SendCall(${color})"><img src = "images/chat/phone.svg"></button><button class = "chat-post-button" onclick = "SendSMS(${color})"><img src = "images/chat/sms.svg"></button></list>Отправитель: ${name}</span></div></div>`);
        else if(type == 133)chat.container.prepend(`<div class="chat-post smi-ad biz"><span>сми</span><div class = "chat-smi-wrap"><span>${text}</span><span><list class = "chat-post-buttons"><button class = "chat-post-button" onclick = "SendCall(${color})"><img src = "images/chat/phone.svg"></button><button class = "chat-post-button" onclick = "SendSMS(${color})"><img src = "images/chat/sms.svg"></button></list>Отправитель: ${name}</span></div></div>`);
        else if(type == 134)chat.container.prepend(`<div class="chat-post smi-ad discount"><span>сми</span><div class = "chat-smi-wrap"><span>${text}</span><span><list class = "chat-post-buttons"><button class = "chat-post-button" onclick = "SendCall(${color})"><img src = "images/chat/phone.svg"></button><button class = "chat-post-button" onclick = "SendSMS(${color})"><img src = "images/chat/sms.svg"></button></list>Отправитель: ${name}</span></div></div>`);
        else if(type == 135)chat.container.prepend(`<div class="chat-post smi-ad job"><span>сми</span><div class = "chat-smi-wrap"><span>${text}</span><span><list class = "chat-post-buttons"><button class = "chat-post-button" onclick = "SendCall(${color})"><img src = "images/chat/phone.svg"></button><button class = "chat-post-button" onclick = "SendSMS(${color})"><img src = "images/chat/sms.svg"></button></list>Отправитель: ${name}</span></div></div>`);
        else if(type == 136)chat.container.prepend(`<div class="chat-post smi-ad love"><span>сми</span><div class = "chat-smi-wrap"><span>${text}</span><span><list class = "chat-post-buttons"><button class = "chat-post-button" onclick = "SendCall(${color})"><img src = "images/chat/phone.svg"></button><button class = "chat-post-button" onclick = "SendSMS(${color})"><img src = "images/chat/sms.svg"></button></list>Отправитель: ${name}</span></div></div>`);
        else if(type == 137)chat.container.prepend(`<div class="chat-post smi-ad utilities"><span>сми</span><div class = "chat-smi-wrap"><span>${text}</span><span><list class = "chat-post-buttons"><button class = "chat-post-button" onclick = "SendCall(${color})"><img src = "images/chat/phone.svg"></button><button class = "chat-post-button" onclick = "SendSMS(${color})"><img src = "images/chat/sms.svg"></button></list>Отправитель: ${name}</span></div></div>`);
        else if(type == 138)chat.container.prepend(`<div class="chat-post smi-ad other"><span>сми</span><div class = "chat-smi-wrap"><span>${text}</span><span><list class = "chat-post-buttons"><button class = "chat-post-button" onclick = "SendCall(${color})"><img src = "images/chat/phone.svg"></button><button class = "chat-post-button" onclick = "SendSMS(${color})"><img src = "images/chat/sms.svg"></button></list>Отправитель: ${name}</span></div></div>`);
        //family
        else if(type == 801){
            let icon_class = 'chat-ico-family1';
            if(nonrp == 0)icon_class = 'chat-ico-family1';
            else if(nonrp == 1)icon_class = 'chat-ico-family2';
            else if(nonrp == 2)icon_class = 'chat-ico-family3';
            else if(nonrp == 3)icon_class = 'chat-ico-family4';
            else if(nonrp == 4)icon_class = 'chat-ico-family5';
            else if(nonrp == 5)icon_class = 'chat-ico-family6';
            else if(nonrp == 6)icon_class = 'chat-ico-family7';
			else if(nonrp == 7)icon_class = 'chat-ico-family8';
			else if(nonrp == 8)icon_class = 'chat-ico-family9';
			else if(nonrp == 9)icon_class = 'chat-ico-family10';
            //
            let chat_color = 'FFFFFF';
            if(additional == 0)chat_color = 'FFFFFF';
            else if(additional == 1)chat_color = 'F6E400';
			else if(additional == 2)chat_color = 'F60000';
            else if(additional == 3)chat_color = '1bff00';
            chat.container.prepend(`<div class="chat-post"><strong class = "${icon_class} chat-ico-family-color" style="color: #${chat_color}">${color} ${name}:</strong>${text}</div>`);
        }
        //frac
        else if(type == 91){
            if(nonrp == true)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-medic">${color} ${name}:</strong>(( ${text} ))</div>`);
            else chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-medic">${color} ${name}:</strong>${text}</div>`);
        }
        else if(type == 92){
            if(nonrp == true)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-army">${color} ${name}:</strong>(( ${text} ))</div>`);
            else chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-army">${color} ${name}:</strong>${text}</div>`);
        }
        //
        else if(type == 97){
            if(nonrp == true)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-gang1">${color} ${name}:</strong>(( ${text} ))</div>`);
            else chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-gang1">${color} ${name}:</strong>${text}</div>`);
        }
        else if(type == 98){
            if(nonrp == true)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-gang2">${color} ${name}:</strong>(( ${text} ))</div>`);
            else chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-gang2">${color} ${name}:</strong>${text}</div>`);
        }
        else if(type == 99){
            if(nonrp == true)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-gang3">${color} ${name}:</strong>(( ${text} ))</div>`);
            else chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-gang3">${color} ${name}:</strong>${text}</div>`);
        }
        else if(type == 910){
            if(nonrp == true)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-gang4">${color} ${name}:</strong>(( ${text} ))</div>`);
            else chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-gang4">${color} ${name}:</strong>${text}</div>`);
        }
        else if(type == 911){
            if(nonrp == true)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-gang5">${color} ${name}:</strong>(( ${text} ))</div>`);
            else chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-gang5">${color} ${name}:</strong>${text}</div>`);
        }
        //
        else if(type == 912){
            if(nonrp == true)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-FIB">${color} ${name}:</strong>(( ${text} ))</div>`);
            else chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-FIB">${color} ${name}:</strong>${text}</div>`);
        }
        else if(type == 913){
            if(nonrp == true)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-smi">${color} ${name}:</strong>(( ${text} ))</div>`);
            else chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-smi">${color} ${name}:</strong>${text}</div>`);
        }
        else if(type == 914){
            if(nonrp == true)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-government">${color} ${name}:</strong>(( ${text} ))</div>`);
            else chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-government">${color} ${name}:</strong>${text}</div>`);
        }
        else if(type == 915) {
            if(nonrp == true)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-mafia1">${color} ${name}:</strong>(( ${text} ))</div>`);
            else chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-mafia1">${color} ${name}:</strong>${text}</div>`);
        }
        else if(type == 916) {
            if(nonrp == true)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-mafia2">${color} ${name}:</strong>(( ${text} ))</div>`);
            else chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-mafia2">${color} ${name}:</strong>${text}</div>`);
        }
        else if(type == 917) {
            if(nonrp == true)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-mafia3">${color} ${name}:</strong>(( ${text} ))</div>`);
            else chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-mafia3">${color} ${name}:</strong>${text}</div>`);
        }
        else if(type == 918) {
            if(nonrp == true)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-mafia3">${color} ${name}:</strong>(( ${text} ))</div>`);
            else chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-mafia3">${color} ${name}:</strong>${text}</div>`);
        }
        //
        else if(type == 1001)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-efir">${name}:</strong>${text}</div>`);
        //
        else if(type == 200)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-megaphone">${name}:</strong>${text}</div>`);
        //
        else if(type == 201)chat.container.prepend(`<div class="chat-post"><strong class = "chat-ico-log">${text}</strong></div>`);
        //
        else chat.container.prepend(`<div class="chat-post">` + text + `</div>`);
        /*
        chat-post smi-ad buy
        chat-post smi-ad sell
        chat-post smi-ad services
        chat-post smi-ad heart
        chat-post smi-ad other
        <div class="chat-post smi-ad heart">
            <span>сми</span>
            <div class = "chat-smi-wrap">
                <span>Видел как лаунчер хвалят на SAMP Live?</span>
                <span>
                    <list class = "chat-post-buttons">
                        <button class = "chat-post-button"><img src = "images/chat/phone.svg"></button>
                        <button class = "chat-post-button"><img src = "images/chat/sms.svg"></button>
                    </list>
                    Отправитель: Johny Depp
                </span>
            </div>
        </div>
        
        <div class="chat-post">
            <strong class = "chat-ico-1">
                Игрок (1)
            </strong> 
            Тест Тест Тест Тест Тест Тест Тест Тест Тест Тест Тест Тест Тест Тест Тест Тест Тест Тест Тест Тест Тест Тест Тест Тест
        </div>
        */
        chat.container.scrollTop(9999);
    },
    clear: () =>
    {
        chat.container.html("");
    },
    activate: (toggle) =>
    {
        if (toggle == false
            && (chat.input != null))
            enableChatInput(false);

        chat.active = toggle;
    },
    show: (toggle) =>
    {
        if(toggle)
            $("#chat").show();
        else
            $("#chat").hide();

        chat.active = toggle;
    }
};

function enableChatInput(enable)
{
    if(chat.active == false
		&& enable == true)
		return;
    if (enable != (chat.input != null))
	{
        mp.invoke("focus", enable);
        if (enable)
        {
            $("#chat").css("opacity", 1);
            $(".chat-hud-input").val('');
            $('.chat-hidden').show();
            chat.input = true;
            $(".chat-hud-input").focus();
			class_mp.changeChatState(true);
        }
		else
		{
            $('.chat-hidden').hide();//.fadeOut('fast');
            chat.input = null;
			class_mp.changeChatState(false);
            hide();
        }
    }
}

function hide() {
	clearTimeout(chat.timer);
	clearTimeout(chat.timerPush);
    if(chat.input == null){
        chat.timer = setTimeout(function () {
            $("#chat").css("opacity", 0.5);
            $(".chat-posts").css("overflow",'hidden');
        }, chat.hide_chat);
    }
}
function hideTimer() {
	clearTimeout(chat.timer);
	clearTimeout(chat.timerPush);
    if(chat.input == null){
        chat.timerPush = setTimeout(function () {
            $("#chat").css("opacity", 0.5);
            $(".chat-posts").css("overflow",'hidden');
        }, chat.hide_chat);
    }
}
function savehistory(value) {
    if(chat.steplist > 0){
        if(chat.prevmsg[chat.steplist-1] == value)return;//повтор
    }
    if(chat.steplist <= 9) {
        chat.prevmsg[chat.steplist] = value;
        chat.steplist++;
    }
    else if(chat.steplist > 9) 
    {
        for (let i = 0; i < 9; i++) {
            chat.prevmsg[i] = chat.prevmsg[(i + 1)];
        }
        chat.prevmsg[9] = value;
    }
}
function show() {
    $("#chat").css("opacity", 1);
	$(".chat-posts").css("overflow",'overlay');
}

function SendSMS(phone){
    //mp.trigger('Client_SendSMSFromChat',phone);
	class_mp.Client_SendSMSFromChat(phone);
}
function SendCall(phone){
	class_mp.Client_SendCallFromChat(phone);
}

let lastMessage = 0;

$(document).ready(function()
{
    chat.container = $('.chat-posts');
    hide();
    $(".chat-posts").show();
    $("body").keydown(function(event)
    {
        if(event.which == 32 && chat.input == null || event.which == 13 && chat.input == null){
            return false;
        }
        if (event.which == 84 && chat.input == null
            && chat.active == true) {
            //отыгрровки
            //if($(".chat-actions-hidden" ).is(':visible')) {
            $(".chat-actions-hidden").hide();//.fadeOut();
            $("#main-action").removeClass("opacity");
            //}
            //
            clearTimeout(chat.timer);
            clearTimeout(chat.timerPush);
            enableChatInput(true);
            event.preventDefault();
            show();
            if(chat.steplist <= 9)chat.backlist = chat.steplist;
            else chat.backlist = 9;
        }
        else if (event.which == 13 && chat.input != null) {
            var value = $(".chat-hud-input").val();
            for(let i = 0; i < value.length; i++){
                if(value.match('<'))value = value.replace('<', ' ');
            }
            if (value.length > 0 && new Date().getTime() - lastMessage > 500) {
                savehistory(value);
                lastMessage = new Date().getTime();
                /*if (value[0] == "/") {
                    value = value.substr(1);

                    if (value.length > 0 && value.length <= 100){
                        enableChatInput(false);//дополнительно
                        mp.invoke("command", value);
                    }
                }
                else {*/
                    if (value.length <= 100){
                        let sendcheck = 0;
                        if($('.connect-radio')[1].checked == true)sendcheck = 1;
                        else if($('.connect-radio')[3].checked == true)sendcheck = 8;
                        else if($('.connect-radio')[2].checked == true)sendcheck = 2;
                        else if($('.connect-radio')[4].checked == true)sendcheck = 3;
                        else if($('.connect-radio')[5].checked == true)sendcheck = 4;
                        else if($('.connect-radio')[6].checked == true)sendcheck = 9;
                        else if($('.connect-radio')[7].checked == true)sendcheck = 11;
                        else if($('.connect-radio')[8].checked == true)sendcheck = 12;
                        //famchat

                        if($(".chat-actions-hidden" ).is(':visible')){
                            if($('.connect-radio')[9].checked == true)sendcheck = 5;
                            else if($('.connect-radio')[10].checked == true)sendcheck = 6;
                            else if($('.connect-radio')[11].checked == true)sendcheck = 7;
                            else if($('.connect-radio')[12].checked == true)sendcheck = 10;
                        }
                        
						class_mp.ClientSendMessage(value,sendcheck);
                    }
                //}
            }
            enableChatInput(false);
        }
        else if (event.which == 27 && chat.input != null) {
            enableChatInput(false);
        }
        else if (event.which == 38 && chat.input != null) { // Листание вверх
            if(chat.steplist <= 9) {
                if(chat.backlist >= 1) chat.backlist--;
                $(".chat-hud-input").val(chat.prevmsg[chat.backlist]);
                //
            } else {
                $(".chat-hud-input").val(chat.prevmsg[chat.backlist]);
                if(chat.backlist >= 1) chat.backlist--;
            }
			return false;
            
        } else if (event.which == 40 && chat.input != null) { // Листание вниз
            
            if (chat.backlist < chat.steplist && chat.steplist != 10)chat.backlist++;
            else if(chat.steplist == 10 && chat.backlist < chat.steplist-1)chat.backlist++;
            $(".chat-hud-input").val(chat.prevmsg[chat.backlist]);
			return false;
        }
        else if (event.which == 9 && chat.input != null) {
            if($('.connect-radio')[0].checked == true){
                $('.connect-radio')[0].checked = false,$('.connect-radio')[1].checked = true;
            }
            else if($('.connect-radio')[1].checked == true){
                if($("#racion" ).is(':visible'))$('.connect-radio')[1].checked = false,$('.connect-radio')[2].checked = true;
                else if($("#efir" ).is(':visible') && !$("#racion" ).is(':visible'))$('.connect-radio')[1].checked = false,$('.connect-radio')[6].checked = true;
                else if($("#famchat" ).is(':visible'))$('.connect-radio')[1].checked = false,$('.connect-radio')[8].checked = true;
                else $('.connect-radio')[1].checked = false,$('.connect-radio')[0].checked = true;
            }
            else if($('.connect-radio')[2].checked == true){
                if($("#nonrpracionid" ).is(':visible'))$('.connect-radio')[2].checked = false,$('.connect-radio')[3].checked = true;
                else $('.connect-radio')[2].checked = false,$('.connect-radio')[0].checked = true;
            }
            else if($('.connect-radio')[3].checked == true){
                if($("#gos" ).is(':visible'))$('.connect-radio')[3].checked = false,$('.connect-radio')[4].checked = true;
                else if($("#efir" ).is(':visible'))$('.connect-radio')[3].checked = false,$('.connect-radio')[6].checked = true;
                else if($("#famchat" ).is(':visible'))$('.connect-radio')[3].checked = false,$('.connect-radio')[8].checked = true;
                else $('.connect-radio')[3].checked = false,$('.connect-radio')[0].checked = true;
            }
            else if($('.connect-radio')[4].checked == true){
                if($("#departament" ).is(':visible'))$('.connect-radio')[4].checked = false,$('.connect-radio')[5].checked = true;
                else if($("#efir" ).is(':visible'))$('.connect-radio')[4].checked = false,$('.connect-radio')[6].checked = true;
                else if($("#famchat" ).is(':visible'))$('.connect-radio')[4].checked = false,$('.connect-radio')[8].checked = true;
                else $('.connect-radio')[4].checked = false,$('.connect-radio')[0].checked = true;
            }
            else if($('.connect-radio')[5].checked == true){
                if($("#efir" ).is(':visible'))$('.connect-radio')[5].checked = false,$('.connect-radio')[6].checked = true;
                else if($("#megaphone" ).is(':visible'))$('.connect-radio')[5].checked = false,$('.connect-radio')[7].checked = true;
                else if($("#famchat" ).is(':visible'))$('.connect-radio')[5].checked = false,$('.connect-radio')[8].checked = true;
                else $('.connect-radio')[5].checked = false,$('.connect-radio')[0].checked = true;
            }
            else if($('.connect-radio')[6].checked == true){
                if($("#famchat" ).is(':visible'))$('.connect-radio')[6].checked = false,$('.connect-radio')[8].checked = true;
                else $('.connect-radio')[6].checked = false,$('.connect-radio')[0].checked = true;
            }
            else if($('.connect-radio')[7].checked == true){
                if($("#famchat" ).is(':visible'))$('.connect-radio')[7].checked = false,$('.connect-radio')[8].checked = true;
                else $('.connect-radio')[7].checked = false,$('.connect-radio')[0].checked = true;
            }
            else if($('.connect-radio')[8].checked == true){
                $('.connect-radio')[8].checked = false,$('.connect-radio')[0].checked = true;
            }
            mp.invoke("focus", true);
            $(".chat-hud-input").focus();
        }
        /*
        else if (event.which == 38 && chat.input != null) {
            chat.input.children("input").val(chat.previous);
        }
        */
    });
});
