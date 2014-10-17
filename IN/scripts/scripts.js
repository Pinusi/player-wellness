if (!WELLNESS) { var WELLNESS = {}; }
if (!WELLNESS.CLIENT) { WELLNESS.CLIENT = {}; }

WELLNESS.CLIENT.Main = function()
{
	this.url = 'login';
	this.addEvents(this.url);
	this.playeruser = null;
}

WELLNESS.CLIENT.Main.prototype.addEvents = function(url,data)
{
	this.url = url;
	var that = this;
	switch(url){
		case 'login':
			that.addLoginEvents();
			break;
		case 'home':
			that.addHomeEvents();
			break;
		case 'dashboard':
			that.addDashEvents(data);
			break;
		case 'playerform':
			that.addFormEvents();
			break;
		case 'editquestions':
			that.data = data;
			that.addEditEvents();
			break;
		case 'generalreport':
			that.addReportEvents();
			break;
	}
}

WELLNESS.CLIENT.Main.prototype.addLoginEvents = function()
{
	var that = this;
	$('#login').click(function() { 
	    that.appLogin();
	});

	$('#pass').keypress(function(e){
        if(e.which == 13){//Enter key pressed
        	that.appLogin();
        }
    });
}

WELLNESS.CLIENT.Main.prototype.appLogin = function()
{

	var user = $('#user').val();
    var pass = $('#pass').val();
    var remember = $('#remember-me input').is(':checked');
    $.ajax({
        url: '/',
        type: 'POST',
        data: {user:user, pass: pass, remember: remember}, // An object with the key 'submit' and value 'true;
        success: function (result) {
        	if( result.type === 'perfect' )
        	{
        		//va alla dashboard e fa sparire le faccie
        		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
        		var host = window.location.host != '' ? window.location.host + "/" : '';
        		window.location.href = protocol + host + result.redirect;
        	}
        	else
        	{
        		//player o utente non trovato
        		$('#login-container').addClass('incorrect');
        	}
        }
    });
}

WELLNESS.CLIENT.Main.prototype.addHomeEvents = function()
{
	//button to open login modal
	$('#traineedash').on('click',function(){
		$('#traineepop').find('.popUp').removeClass('incorrect');
		$('#traineepop').show();
	});

	//everywhere close login modal
	$('#traineepop').on('click',function(e){
	   	var $box = $('#traineepop .popUp');
	   	if(!$box.is(e.target) && $box.has(e.target).length === 0)
	      	$( this ).hide();
	});

	var that = this;

	$('#traineepass').keypress(function(e){
        if(e.which == 13){
        //Enter key pressed
        	that.operatorLogin();
        }
    });

	//login for trainee
	$('#traineelogin').click(function() { 
	    that.operatorLogin(); 
	});

	//i player vanno alla dashboard
	$('#playerdash').click(function() {
		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
		var host = window.location.host != '' ? window.location.host + "/" : '';
		window.location.href = protocol + host + "dashboard";
	});
}

WELLNESS.CLIENT.Main.prototype.operatorLogin = function()
{
	// var user = $('#traineeuser').val();
	    var pass = $('#traineepass').val();
	    $.ajax({
	        url: '/home',
	        type: 'POST',
	        data: {pass: pass}, // An object with the key 'submit' and value 'true;
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
	        		$('#traineepop').find('.popUp').addClass('incorrect');
	        	}
	        	else
	        	{
	        		//player o utente non trovato
	        		$('#traineepop').find('.popUp').addClass('incorrect');
	        	}
	        }
	    });  
}

WELLNESS.CLIENT.Main.prototype.addDashEvents = function(isTrainee)
{

	var that = this;

	//back button
	$('#backtohome').on('click',function(){
		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
		var host = window.location.host != '' ? window.location.host + "/" : '';
		window.location.href = protocol + host + "home";
	});

	if(isTrainee){

		//update who compleated the form
		setInterval(function(){
		   	$.ajax({
		        url: '/dashboard',
		        type: 'GET', 
		        data: {refresh: true},
		        success: function (player_list) {
		        	//loop through players
		        	for (var k = 0; k < player_list.length; k++) {
		        		var current_player = player_list[k];
		        		//if the variable exist and is true
		        		if(current_player.formCompleated)
		        		{
		        			//add the clas to fade out
		        			$('.playerImage.'+ current_player.surname.toLowerCase()).addClass('completedForm');
		        		}
		        	}
		        }
		    });
		}, 15000);

		//button to go and change questions
		$('#changequestions').on('click',function(){
			var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
			var host = window.location.host != '' ? window.location.host + "/" : '';
			window.location.href = protocol + host + "editquestions";
		});

		//button to go and see report
		$('#generalreport').on('click',function(){
			var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
			var host = window.location.host != '' ? window.location.host + "/" : '';
			window.location.href = protocol + host + "generalreport";
		});
	}
	else
	{
		//button to open login modal
		$('.player_login').on('click',function(){
			//cleanup
			$('#playerpop').find('#playerday').val(null);
			$('#playerpop').find('#playermonth').val(null);
			$('#playerpop').find('#playeryear').val(null);
			$('#playerpop').find('.popUp').removeClass('incorrect');
			//set variables
			var user = $( this ).attr('data-user');
			$('#playerpop').attr('data-user',user);
			$('#playerpop').find('.popUpPlayerCircle').empty().append('<div class="playerImage ' + user + '"></div>')
			$('#playerpop').find('.playerInfo').empty().append('<span class="playerNo">' + $( this ).find('.playerNo').html() + '</span>' + user);
			$('#playerpop').show();
		});

		//close modal
		$('#playerpop').on('click',function(e){
		   	var $box = $('#playerpop .popUp.dob');
		   	if(!$box.is(e.target) && $box.has(e.target).length === 0)
		      	$( this ).hide();
		});

		
		//player login
		$('#playerlogin').click(function() { 
			that.playerLogin(); 

		});

		$('#playerday').keypress(function(e){
	        if(e.which == 13){
	        //Enter key pressed
	        	that.playerLogin();
	        }
	    });
	    $('#playermonth').keypress(function(e){
	        if(e.which == 13){
	        //Enter key pressed
	        	that.playerLogin();
	        }
	    });
	    $('#playeryear').keypress(function(e){
	        if(e.which == 13){
	        //Enter key pressed
	        	that.playerLogin();
	        }
	    });
	}
}

WELLNESS.CLIENT.Main.prototype.playerLogin = function()
{
	var user = $('#playerpop').attr('data-user');
    var pass = $('#playerday').val() + '-' + $('#playermonth').val() + '-' + $('#playeryear').val();
    $.ajax({
        url: '/dashboard',
        type: 'POST',
        data: {user: user, pass: pass}, // An object with the key 'submit' and value 'true;
        success: function (result) {
        	if( result.type === 'player' )
        	{
        		//va al playerform
        		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
        		var host = window.location.host != '' ? window.location.host + "/" : '';
        		window.location.href = protocol + host + result.redirect;
        	}
        	else if( result.type === 'invalid-password')
        	{
        		//incorrect password
        		$('#playerpop').find('.popUp').addClass('incorrect');
        	}
        	else
        	{
        		//player o utente non trovato
        		$('#playerpop').find('.popUp').addClass('incorrect');
        	}
        }
    }); 
}

/*
	PAGE: player_form.jade
	SAVE ANSWERS
 */
WELLNESS.CLIENT.Main.prototype.saveAnswers = function()
{	
	/*
		form_answers = {
			"q_id": "answer",
			"q_id_tappop": {
				"general": "answer",
				"specific": {
					"Name": ["uno", "due"], ...
				}, ...
			}
		}
	 */
	var form_answers = {};

    //il form e' completo?
    var form_completo = true;
	    
    $('.serverAnsw').each(function()
    {
    	switch($(this).attr('data-type'))
    	{
    		//se e' testo semplice salva il valore e l'id
    		case 'txt':
    			form_answers[$(this).attr('data-id')] = $(this).find('input').val();
    			if( !form_answers[$(this).attr('data-id')] || form_answers[$(this).attr('data-id')] == 0 ){
    				form_completo = false;
		    	}
	    		break;
	    	//se e' tap salva il data-answer e l'id
    		case 'tap':
    			form_answers[$(this).attr('data-id')] = $( this ).find('.formBtn.selected p').html();
    			if( !form_answers[$(this).attr('data-id')] ){
    				form_completo = false;
		    	}
	    		break;
	    	case 'tappop':
	    		var form_specific = {};
	    		if($(this).attr('data-ispop'))
	    		{
		    		//salva popup
					$('.popOverlay[popup-data-to=' + $(this).attr('data-id') + ']').find('.popupAnsw').each(function()
					{
						if($(this).find('.formBtn.selected p').length != 0)
						{
							var data_header = $(this).attr('data-header');
							form_specific[data_header] = [];
							$(this).find('.formBtn.selected p').each(function(){
								form_specific[data_header].push($(this).html());
							});
						}
					});
				}
	    		form_answers[$(this).attr('data-id')] = {
	    			"general": $( this ).find('.formBtn.selected p').html(),
	    			"specific": form_specific 
	    		}
    			if(!form_answers[$(this).attr('data-id')].general){
    				form_completo = false;
		    	}
	    		break;
	    }
	});
	
	return [form_completo,form_answers];
}

WELLNESS.CLIENT.Main.prototype.addFormEvents = function()
{
	/*
		this.form_answers = {
			"q_id": "answer",
			"q_id_tappop": {
				"general": "answer",
				"specific": {
					"Name": ["uno", "due"], ...
				}, ...
			}
		}
	 */
	// this.form_answers = {};

	// this.form_answered = 0;
	var that = this;

	//back button
	$('#backtodash').on('click',function(){
		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
		var host = window.location.host != '' ? window.location.host + "/" : '';
		window.location.href = protocol + host + "dashboard";
	});

	//click on each tap button
	$('.serverAnsw .formBtnCont').on('click',function(){
		//togli gli altri della stessa domanda
		$( this ).siblings().find('.formBtn').removeClass('selected');
		//aggiugngi la classe selected
		$( this ).find('.formBtn').addClass('selected');
	});

	//click on each tap button
	$('.popupAnsw .formBtnCont').on('click',function(){
		$( this ).find('.formBtn').toggleClass('selected');
	});

	$('.tappop').on('click',function(){
		$('.popOverlay[popup-data-to=' + $(this).attr('popup-data-from') + ']').show();
		$( this ).parents('.serverAnsw').attr("data-ispop", true);
	});

	$('.nopop').on('click',function(){
		$( this ).parents('.serverAnsw').attr("data-ispop", false);
	});

	//TBRefactored
	$(".popOverlay").on('click',function(e){
		var $box = $('.popUp');
		var $box_close = $('.closePop');
	   	if(!$box.is(e.target) && $box.has(e.target).length === 0 || $box_close.is(e.target))
	      	$( this ).hide();
	});

	//close modal
	$('.closePop').on('click',function(e){
	   	// var $box = $('.popUp');
	   	// var $box_close = $('.closePop');
	   	// if(!$box.is(e.target) && $box.has(e.target).length === 0 && !$box_close.is(e.target))
	    e.preventDefault();
	    $('.popOverlay').hide();
	});

	//click on submit
	$('#enotcomplete').find('.popUpBtn').on('click',function(){
		$('#enotcomplete').hide();
	});

	$('#submitanswers').click(function() {
		var answers_saved = that.saveAnswers();
		var is_complete = answers_saved[0];
		var answers = answers_saved[1];

	    //se non manca nulla chiama
	    if(is_complete)
	    {
		    $.ajax({
		        url: '/playerform',
		        type: 'POST',
		        data: {answers: answers},
		        success: function (response) {
		        	if(response.result == 'ok'){
			        	//va alla dashboard
		        		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
		        		var host = window.location.host != '' ? window.location.host + "/" : '';
		        		window.location.href = protocol + host + response.redirect;
		        	}
		        	else
		        	{
		        		console.log('error');
		        	}
		        }
		    }); 
		}
		else
		{
			$('#enotcomplete').show();
		}

	});
}

WELLNESS.CLIENT.Main.prototype.addEditEvents = function()
{
	var that = this;

	//get last id for q
	this.q_last = 0;
	for (var question_id in this.data) 
	{
		var q_num = parseInt(question_id.slice(2), 10);
		if(q_num > this.q_last)
		{
			this.q_last = q_num;
		}
	}

	//back button
	$('#backtodash').on('click',function(){
		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
		var host = window.location.host != '' ? window.location.host + "/" : '';
		window.location.href = protocol + host + "dashboard";
	});

	//remove question
	$('.removeFormInstruct.minus').on('click',function(){
		var id = $( this ).parents('.formQuestion').attr('data-id');
		if(that.data[id])
		{
			that.data[id].on = false;
		}
		$( this ).parents('.col-xs-12.col-sm-12.col-md-12.col-lg-12').remove();
	});

	//add new question
	$('.removeFormInstruct.plus').on('click',function(){
		$('#questiontype').show();
	});

	$(".popOverlay").on('click',function(e){
		var $box = $('.popUp');
	   	if(!$box.is(e.target) && $box.has(e.target).length === 0)
	      	$( this ).hide();
	});

	//remove option in MP
	$('.crossWhite').on('click',function(){
		$( this ).parents('.formBtnCont').remove();
	});

	//add option in MP
	$('.pickquestions .removeFormInstruct.addAnswer').on('click',function(){
		new_button = '	<div class="formBtnCont">';
		new_button += '		<a class="crossWhiteCont"><div class="crossWhite"></div></a>';
		new_button += '		<a class="posOrNegCont"><div class="posOrNeg posneg_topick"></div></a>';
		new_button += '		<input class="options_topick" name="Answer" value="Option" type="text"/>';
		new_button += '	</div>';
		$( this ).parents('.formBtnCont').before(new_button);
		$( this ).parents('.formBtnCont').prev().find('.crossWhite').on('click',function(){
			$( this ).parents('.formBtnCont').remove();
		});
		if($( this ).parents('.pickquestions').children().length == 7)
		{
			$( this ).parents('.formBtnCont').remove();
		}
		$( this ).parents('.formBtnCont').prev().find(".posOrNegCont").on("click", function(){
			$(this).find(".posOrNeg").toggleClass("neg");
		});
	});

	//text
	$('#addTextQuestions').on('click',function(){
		$('#questiontype').hide();

		that.q_last = that.q_last + 1;
		
		var new_question = '';
		new_question += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
		new_question += '<div class="formQuestion pickquestions" data-id="q_'+ that.q_last +'" data-type="txt">';
		new_question += '	<div class="formInstruct input">';
		new_question += '		<div class="removeFormInstruct minus">';
		new_question += '			<div class="minusBlue"></div>';
		new_question += '		</div>';
		new_question += '		<input class="question_topick" name="Answer" value="Insert Question" type="text"/>';
		new_question += '	</div>';
		new_question += '	<form>';
		new_question += '		<input type="text"/>';
		new_question += '	</form>';
		new_question += '</div>';
		new_question += '</div>';

		$('#plusbutton').before(new_question);

		$('.pickquestions[data-id="q_'+that.q_last+'"]').find('.removeFormInstruct.minus').on('click',function(){
			var id = $( this ).parents('.formQuestion').attr('data-id');
			if(that.data[id])
			{
				that.data[id].on = false;
			}
			$( this ).parents('.col-xs-12.col-sm-12.col-md-12.col-lg-12').remove();
		});
	});

	//multiple choice
	$('#addMPQuestions').on('click',function(){
		$('#questiontype').hide();

		that.q_last = that.q_last + 1;
		
		var new_question = '';
		new_question += '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">';
		new_question += '<div class="formQuestion pickquestions" data-id="q_'+ that.q_last +'" data-type="tap">';
		new_question += '	<div class="formInstruct">';
		new_question += '		<div class="removeFormInstruct minus">';
		new_question += '			<div class="minusBlue"></div>';
		new_question += '		</div>';
		new_question += '		<input class="question_topick" name="Answer" value="Insert Question" type="text"/>';
		new_question += '	</div>';
		new_question += '	<div class="formBtnCont">';
		new_question += '		<a class="crossWhiteCont"><div class="crossWhite"></div></a>';
		new_question += '		<a class="posOrNegCont"><div class="posOrNeg posneg_topick"></div></a>';
		new_question += '		<input class="options_topick" name="Answer" value="Yes" type="text"/>';
		new_question += '	</div>';
		new_question += '	<div class="formBtnCont">';
		new_question += '		<a class="crossWhiteCont"><div class="crossWhite"></div></a>';
		new_question += '		<a class="posOrNegCont"><div class="posOrNeg posneg_topick"></div></a>';
		new_question += '		<input class="options_topick" name="Answer" value="No" type="text"/>';
		new_question += '	</div>';
		new_question += '	<a class="formBtnCont">';
        new_question += '		<div class="formBtn addAnswer">';
        new_question += '			<div class="removeFormInstruct addAnswer">';
        new_question += '				<div class="plusBlue"></div>';
        new_question += '			</div>';
        new_question += '		</div>';
        new_question += '	</a>';
		new_question += '</div>';
		new_question += '</div>';

		$('#plusbutton').before(new_question);

		//readd events
		$('.pickquestions[data-id="q_'+that.q_last+'"]').find('.removeFormInstruct.minus').on('click',function(){
			var id = $( this ).parents('.formQuestion').attr('data-id');
			if(that.data[id])
			{
				that.data[id].on = false;
			}
			$( this ).parents('.col-xs-12.col-sm-12.col-md-12.col-lg-12').remove();
		});

		$('.pickquestions[data-id="q_'+that.q_last+'"]').find('.removeFormInstruct.addAnswer').on('click',function(){
			new_button = '	<div class="formBtnCont">';
			new_button += '		<a class="crossWhiteCont"><div class="crossWhite"></div></a>';
			new_button += '		<a class="posOrNegCont"><div class="posOrNeg posneg_topick"></div></a>';
			new_button += '		<input class="options_topick" name="Answer" value="Option" type="text"/>';
			new_button += '	</div>';
			$( this ).parents('.formBtnCont').before(new_button);
			if($( this ).parents('.pickquestions').children().length == 7)
			{
				$( this ).parents('.formBtnCont').remove();
			}
		});

		$('.pickquestions[data-id="q_'+that.q_last+'"]').find('.crossWhite').on('click',function(){
			$( this ).parents('.formBtnCont').remove();
		});

		$('.pickquestions[data-id="q_'+that.q_last+'"]').find('.posOrNegCont').on("click", function(){
			$(this).find(".posOrNeg").toggleClass("neg");
		});
	});

	//Question scale
	//STRUCTURE: <a class="posOrNegCont"><div class="posOrNeg posneg_topick neg"></div></a>
	$(".posOrNegCont").on("click", function(){
		$(this).find(".posOrNeg").toggleClass("neg");
	});

	//save and send
	$('#savequestions').on('click',function(){
		//get the new question list
		
		$('.pickquestions').each(function(){
			// for (var i = 0; i < that.data.length; i++) {
			// 	var act_q = that.data[i];
			var q_id = $(this).attr('data-id');
			if(that.data[q_id])
			{
				switch($(this).attr('data-type'))
				{
					case 'txt':
						that.data[q_id].txt = $(this).find('.question_topick').val();
						break;
					case 'tap':
						that.data[q_id].txt = $(this).find('.question_topick').val();
						var new_answers = [];
						var new_scale = [];
						$( this ).find('.options_topick').each(function(){
							new_answers.push($(this).val());
						});
						that.data[q_id].answers = new_answers;
						$( this ).find('.posneg_topick').each(function(){
							if($( this ).hasClass('neg'))
							{
								new_scale.push(1);
							}
							else
							{
								new_scale.push(0);
							}
						});
						that.data[q_id].scale = new_scale;
						break;
					//case tappop TBD
				}
			}
			else
			{
				//ADD NEW QUESTION
				switch($(this).attr('data-type'))
				{
					case 'txt':
						that.data[q_id] = {
							txt: $(this).find('.question_topick').val(),
					        type: "txt",
					        on: "true"
						};
						break;
					case 'tap':
						var brand_new_answers = [];
						var brand_new_scale = [];
						$( this ).find('.options_topick').each(function(){
							brand_new_answers.push($(this).val());
						});
						$( this ).find('.posneg_topick').each(function(){
							if($( this ).hasClass('neg'))
							{
								new_scale.push(1);
							}
							else
							{
								new_scale.push(0);
							}
						});
						that.data[q_id] = {
							txt: $(this).find('.question_topick').val(),
					        type: "tap",
					        answers: brand_new_answers,
					        on: "true",
					        scale: brand_new_scale
						};
						break;
				}
			}
			// };
		});
		

		//send
		$.ajax({
	        url: '/editquestions',
	        type: 'POST',
	        dataType: "json",
	        data: { questions: that.data },
	        success: function (response) {
	        	if(response.result == 'ok'){
		        	//va alla dashboard
	        		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
	        		var host = window.location.host != '' ? window.location.host + "/" : '';
	        		window.location.href = protocol + host + response.redirect;
	        	}
	        	else
	        	{
	        		console.log('error');
	        	}
	        }
	    });
	});
}

WELLNESS.CLIENT.Main.prototype.addReportEvents = function()
{
	$('#backtodash').on('click',function(){
		var protocol = window.location.protocol != '' ? window.location.protocol + "//" : '';
		var host = window.location.host != '' ? window.location.host + "/" : '';
		window.location.href = protocol + host + "dashboard";
	});

	//button to send immediate report
	$('#sendreport').on('click',function(e){
	   	$.ajax({
	        url: '/excel',
	        type: 'POST', // An object with the key 'submit' and value 'true;
	        success: function (result) {
	        	
	        }
	    });
	});

	//update the table
	setInterval(function(){
	   	$.ajax({
	        url: '/generalreport',
	        type: 'GET', 
	        data: {refresh: true},
	        success: function (answers_by_date) {
	        	//update the table
	        	var table = '<thead>';
	        	table += 		'<tr>';
	        	table += 			'<th>'
	        	table += 			'</th>';
	        	for( var c = 0; c < answers_by_date.questions.length; c++ )
	        	{
	        		table += 		'<th>' + answers_by_date.questions[c].question;
	        		table += 		'</th>';
	        	}
	        	table += 		'</tr>';
	        	table += 	'</thead>';
	        	table += 	'<tbody>';
	        	for( var key in answers_by_date )
	        	{
	        		var answer = answers_by_date[key].answers;
	        		if(key != 'questions')
	        		{
	        			table += '<tr>';
	        			table += 	'<td class="name"><div class="playerInfo">';
	        			if(answers_by_date[key].role == "g_k")
	        			{
	        				table += 		'<span class="playerNo gk">' + answers_by_date[key].number + '</span>';	
	        			}
	        			else
	        			{
	        				table += 		'<span class="playerNo">' + answers_by_date[key].number + '</span>';
	        			}
	        			table += 		'<span>' + answers_by_date[key].name + '</span>';
	        			table += 	'</div></td>';
	        			for( var d = 0; d < answer.length; d++ )
	        			{
	        				if(answer[d].scale == "1")
	        				{
	        					table += '<td class="neg">';
	        						if(answer[d].specific)
	        						{
	        							table += answer[d].general;
	        							for (var key_2 in answer[d].specific) {
	        								table += '<div>' + key_2 + ":";
	        								var specific_list = answer[d].specific[key_2];
	        								for (var o = 0; o < specific_list.length; o++) {
	        									if(o < specific_list.length-1)
	        									{
	        										table += " " + specific_list[o] + ",";
	        									}
	        									else
	        									{
	        										table += " " + specific_list[o];
	        									}
	        								}
	        								table += '</div>'
	        							}
	        						}
	        						else
	        						{
	        							table += '<span class="neg">' + answer[d].general + '</span>';
	        						}
	        						
	        					table += '</td>';
	        				}
	        				else
	        				{
	        					table += '<td>' + answer[d].general;
	        					table += '</td>';
	        				}
	        			}
	        			table += '</tr>';
	        		}
	        	}
	        	table += 	'</tbody>';
	        	$('table').empty().append(table);
	        }
	    });
	}, 15000);
}