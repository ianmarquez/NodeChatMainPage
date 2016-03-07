var chat = (function(){
	"use strict";
	var userid = '';
	/*Listeners*/
	var socket = io(chat_config.socket);
	socket.on('connect', function(){console.log('successfully connected to chat server');});
	socket.on('disconnect', function(){console.log('you have been disconnected to the chat server');});	
	
	socket.on('done typing', function(msg){
		if($('#' + msg.div).length != 0){
			$('#' + msg.div).empty();
		}
	});

	socket.on('typing', function(msg){
		if($('#' + msg.div).length != 0){
			$('#' + msg.div).html(msg.sender + ' is typing...');
		}
	});

	socket.on('private message', function(msg){
		if($('#' + msg.div).length == 0){
			chat.create_chat_window(msg.senderID,msg.sendername);
		}						
		$('#' + msg.div).append(msg.message);
		$('#' + msg.div).animate({ 
			scrollTop: $('#'+msg.div).get(0).scrollHeight
		},0);	
	});

	socket.on('get online', function(data){
		var div;
		$('#userlist').empty();
		for(var i = 0; i < data.users.length; i++){
			var userid = data.users[i].userid;
			var username = data.users[i].username; 
			var imagepath = data.users[i].imagepath;
			var position = data.users[i].position;
			var profilePic = '<div class="col-md-1 default_pic "><span class="default_pic_icon glyphicon glyphicon-user col-md-6" aria-hidden="true"></span></div>';
			if(imagepath != ""){
				imagepath = '/iLink/img/profile_pictures/'+imagepath;
				if(status == 1){
					profilePic = '<div class="col-md-1 default_pic" style="background-color:#449E48">';
				}else{
					profilePic = '<div class="col-md-1 default_pic" style="background-color:#ddd">';
				}
				profilePic += '<img class="img-circle-pic" src="'+imagepath+'" /></div>';
			}
			div = '<div class="username" onclick="chat.create_chat_window('+ userid +',\''+username+'\')">';
			div+='<div class="row">';
			div+= profilePic;
			div+='<div id=\'user'+userid+'\'class=\'col-md-8\'>';
			div+='<div class="col-md-12 username-complete user-info">'+ username +'</div>';
			div+='<div class="col-md-12 username-group user-info">'+position+'</div>';
			div+='</div>';
			div+='<div class=\'pull-right\'>';
			div+='</div>';
			div+='</div>';
			div+='</div>';
			$('#userlist').append(div);
		}
		
	});
	/*End Listeners*/

	/*Emitters*/
	var set_chat_info = function(userid, username, imagepath, position){
		var data = {
			userid: userid,
			username: username,
			applicationkey: chat_config.applicationkey,
			imagepath: imagepath,
			position: position
		};
		socket.emit('connected', data);
	};
	var get_online_users = function(){
		socket.emit('get online', {applicationkey:chat_config.applicationkey});
	};
	var privatemessage = function(sender,recipient,recipient_applicationkey, msg, div){
		var data = {
			sender: sender,
			recipient: recipient,
			recipient_applicationkey: recipient_applicationkey,
			applicationkey: chat_config.applicationkey,
			message: msg,
			div: div
		};
		socket.emit('private message', data);
	};
	var timeout= undefined;
	var user_typing = false;
	var typing = function(recipient_id){
		if(user_typing != true){
			console.log('true');
			user_typing = true;
			socket.emit('typing', {recipientID:recipient_id});
		}else{
			clearTimeout(timeout);
			timeout = setTimeout(function(){user_typing=false;socket.emit('done typing', {recipientID:recipient_id});}, chat_config.doneTypingInterval);
		}
	}	
	var set_userid = function(id){
		userid = id;
	}
	var create_chat_window = function(recipientid, username){
		var current_user = chat_config.userid;
		var chatDiv = $(
		'<div id="chat_wrapper'+recipientid+'" class="col-md-4 pull-right chatbox">'
		+'<div class="chatcontainer">'
		+'<div id="chat_header'+recipientid+'" class="chatheader">'
		+'<div class="chat_head_complete">'+username+'</div>'
		+'<a style="color:#fff;" id="close_chat'+recipientid+'" class="pull-right"><span class="glyphicon glyphicon-remove"></span></a>'
		+'</div>'
		+'<div id="chatbody'+recipientid+'">'
		+'<div id="message_box'+recipientid+'" class="col-md-12 chatarea"></div>'
		+'<div class="col-md-12 typing" id="typing'+recipientid+'"></div>'
		+'<textarea class="col-md-12 messageinput" id="message'+recipientid+'" maxlength="100" onkeypress="return chat.chat_send(event,\''+recipientid+'\',\'c4ca4238a0b923820dcc509a6f75849b\')" placeholder="Message"></textarea>'
		+'</div>'
		+'</div>'
		+'</div>'
		);
		$('#chatTabs').append(chatDiv);
		document.getElementById('chat_header'+recipientid).addEventListener('click',minimize_chat_window,false);
		document.getElementById('close_chat'+recipientid).addEventListener('click',close_chat_window,false);
	};
	var minimize_chat_window = function(){
		var recipientid = $(this).attr('id');
	 	recipientid = recipientid.split("chat_header");
	 	recipientid = recipientid[1]
		if($('#chatbody'+recipientid).hasClass('hiddenchat')) {
			$('#chatbody'+recipientid).removeClass('hiddenchat');
			$('#chat_wrapper'+recipientid).removeClass('pushdown');
			$('#chatbody'+recipientid).show();
			$('#message'+recipientid).focus();
		}else{
			$('#chatbody'+recipientid).addClass('hiddenchat');
			$('#chat_wrapper'+recipientid).addClass('pushdown');
			$('#chatbody'+recipientid).hide();
		}
	};
	var close_chat_window = function(){
		var recipientid = $(this).attr('id');
	 	recipientid = recipientid.split("close_chat");
	 	recipientid = recipientid[1];

		$('#chat_wrapper'+recipientid).remove();
	};
	var chat_send = function(e, recipientid, recipient_app_id){
		var div = 'message_box' + userid;
		var msg = $('#message'+recipientid).val();
		typing(recipientid);
		if(e.keyCode == 13 || e.which ==13){
			var data = {
				sender: userid,
				recipient: recipientid,
				recipient_applicationkey: recipient_app_id,
				message: "<div class=\"row\"><div class=\"pull-right col-md-12\"><div class=\"chatmessage senderchatbubble pull-left\">"+msg+"</div></div></div>",
				div: div
			}
			$('#message'+recipientid).val('');
			$('#message_box'+recipientid).append("<div class=\"row\"><div class=\"pull-right col-md-12\"><div class=\"chatmessage userchatbubble pull-right\">"+msg+"</div></div></div>");
			privatemessage(data.sender, data.recipient, data.recipient_applicationkey,data.message, data.div);
			chat_scroll_bottom(recipientid);
			return false;
		}

		return true;
	};
	var chat_scroll_bottom = function(recipientid){
		$('#message_box'+recipientid).animate({ 
			scrollTop: $('#message_box'+recipientid).get(0).scrollHeight
		},0);
	};
	var set_chatinfo = function(){
		var fname = $('#chat_firstname').val();
		var lname = $('#chat_lastname').val();
		var id = $('#chat_userid').val();
		var username = fname + ' ' + lname;
		set_chat_info(id, username, '', '');
		set_userid(id);
		$('#setChatInfo').modal('toggle');
	};
	$(document).ready(function(){
		$('#sidebar_chatbox').hide();
		$("#toggle_userlist").click(function(){
			var height = $('#sidebar_chatbox').outerHeight() + 2;
			if($('.toggle_messenger').hasClass('clicked') == false){
				$('.toggle_messenger').addClass('clicked');
			}		
			if($('#sidebar_chatbox').is(":hidden")){
				get_online_users(chat_config.applicationkey);
				$('#userlist').removeClass('hidden');
				$('#searchChatUser').removeClass('hidden');
				$(".toggle_messenger").css('margin-bottom', height+'px');
			}else{
				$(".toggle_messenger").css('margin-bottom', '0');
			} 
			$('#sidebar_chatbox').slideToggle(1,function(){});
		});
	});
	$( window ).resize(function(){
		if($('#sidebar_chatbox').is(":visible")){
			var height = $('#sidebar_chatbox').outerHeight() + 2;
			$(".toggle_messenger").css('margin-bottom', height+'px');
		}	
	});

	document.getElementById('save-chat').addEventListener('click', set_chatinfo, false);
	document.getElementById('refresh_user_list').addEventListener('click',get_online_users,false);

	/*End Emitters*/
	return {
		privatemessage: privatemessage,
		typing: typing,
		set_chat_info:set_chat_info,
		get_online_users:get_online_users,
		minimize_chat_window:minimize_chat_window,
		close_chat_window:close_chat_window,
		chat_send: chat_send,
		create_chat_window:create_chat_window
	}

})();