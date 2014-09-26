if (!WELLNESS) { var WELLNESS = {}; }
if (!WELLNESS.CLIENT) { WELLNESS.CLIENT = {}; }

WELLNESS.CLIENT.Main = function()
{
	this.url = 'login';
	this.addEvents(this.url);
}

WELLNESS.CLIENT.Main.prototype.addEvents = function(url)
{
	this.url = url;
	var that = this;
	switch(url){
		case 'home':
			that.addHomeEvents();
			break;
		case 'dashboard':
			that.addDashEvents();
			break;
		case 'playerform':
			that.addFormEvents();
			break;
	}
}

WELLNESS.CLIENT.Main.prototype.addHomeEvents = function()
{
	//button to open login modal
	$('#traineedash').on('click',function(){
		$('#traineepop').show();
	});

	$('#traineeclose').on('click',function(){
		$('#traineepop').hide();
	});

	$(document.body).on('click',function(e){
	   var $box = $('#traineepop');
	   var $button = $('#traineedash');
	   if(e.target.id !== 'traineepop' && !$.contains($box[0], e.target) && e.target.id !== 'traineedash' && !$.contains($button[0], e.target))
	      $box.hide();
	});

	//login for trainee
	$('#traineelogin').click(function() { 

	    var user = $('#traineeuser').val();
	    var pass = $('#traineepass').val();
	    $.ajax({
	        url: '/home',
	        type: 'POST',
	        data: {user: user, pass: pass}, // An object with the key 'submit' and value 'true;
	        success: function (result) {
	        	if( result.type === 'trainee' )
	        	{
	        		//va alla dashboard e fa sparire le faccie
	        		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
	        		var host = window.location.host != '' ? window.location.host + "/" : '';
	        		window.location.href = protocol + host + result.redirect;
	        	}
	        	else if( result.type === 'invalid-password')
	        	{
	        		//password sbagliata
	        	}
	        	else
	        	{
	        		//player o utente non trovato
	        	}
	        }
	    });  

	});

	$('#playerdash').click(function() {
		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
		var host = window.location.host != '' ? window.location.host + "/" : '';
		window.location.href = protocol + host + "dashboard";
	});
}

WELLNESS.CLIENT.Main.prototype.addDashEvents = function()
{
	$('.player_login').click(function() { 

	    var user = $('#user').val();
	    var pass = $('#pass').val();
	    $.ajax({
	        url: '/home',
	        type: 'POST',
	        data: {user: user, pass: pass}, // An object with the key 'submit' and value 'true;
	        success: function (result) {
	        	if( result.type === 'player' )
	        	{
	        		//va alla dashboard e fa sparire le faccie
	        		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
	        		var host = window.location.host != '' ? window.location.host + "/" : '';
	        		window.location.href = protocol + host + result.redirect;
	        	}
	        	else if( result.type === 'invalid-password')
	        	{
	        		//password sbagliata
	        	}
	        	else
	        	{
	        		//player o utente non trovato
	        	}
	        }
	    });  

	});
}

WELLNESS.CLIENT.Main.prototype.addFormEvents = function()
{
	$('.sendanswers').click(function() { 

	    var answers = [];
	    var form_completo = true;
	    
	    $('.answers').each(function(){
	    	if( $(this).val() )
    		answers.push(
    		{
    			id: $(this).attr('id'),
    			txt: $(this).val()
    		});
    		else
    		{
    			form_completo = false;
    		}
    	});

	    if(form_completo)
	    {
		    $.ajax({
		        url: '/playerform',
		        type: 'POST',
		        data: {answers: answers}, // An object with the key 'submit' and value 'true;
		        success: function (result) {
		        	if( result.type === 'trainee' )
		        	{
		        		//perfetto
		        	}
		        	else
		        	{
		        		//error
		        	}
		        }
		    }); 
		} 

	});
}