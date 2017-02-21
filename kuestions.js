Tests 		= new Mongo.Collection('tests');
Kuestions = new Mongo.Collection('kuestions');
Answers 	= new Mongo.Collection('answers');
KTeam 		= new Mongo.Collection('kteam');

maxTime = {};
clockActive = false;
gradclock = 0;

if (Meteor.isClient) {
  var debugMode = false;
  var _log = function(msg) {
    if ( debugMode ) {
      console.log( msg );
    }
  };
  var _resetCounters = function(){
    //console.log("resetCounters");
    var t = Tests.find({}).fetch();
    for (var k in t){
      for (var k2 in t[k].tests){
        Session.set('nCounter_'+t[k].tests[k2].name, 0);
        _log('nCounter_'+t[k].tests[k2].name+": "+Session.get('nCounter_'+t[k].tests[k2].name));
      }
    }
  };

  Active = new Meteor.Collection('active');

  Session.set('testID', []);
  Session.set('activeTest', '');
  Session.set('messageTest' , '');
  Session.set('testNotStarted' , true);
  Session.set('consoleOpen', false);
  Session.set('activeTime', false);
  Session.set('textEndCalledNow', false);
  Session.set('talento', '');


  Meteor.call('getQT',{},function(err, response) {
              if (err) { console.log(err, response);
              } else {
                maxTime = response;
              }
  });

	/* DETECT CONSOLE OPEN
	var element = new Image();
	element.__defineGetter__('id', function() {
    Session.set('consoleOpen', true);
	});
	setInterval(function() {
		Session.set('consoleOpen',false);
		console.log(element);
    console.clear();
	},1000);
*/

  var testID;
  var activeTest;

  var getParam = function(param) {
      var l = window.location.href.split('#')[0].split('?');
      if (l.length > 1) {
        var ps = l[1].split('&');
        for (var i=0; i<ps.length; i++) {
          var p = ps[i].split('=');
          if (p[0]===param) {
            return p[1];
          }
        }
        return null;
      }
    }

  Meteor.subscribe('kuestions');
  Meteor.subscribe('kteam');
  Meteor.subscribe('tests');
  Meteor.subscribe('active');


  var kcode = getParam('kcode');
  Meteor.call('getKCode', {c: kcode}, function(err, response) {
    if (response) {
      Session.set('kcode', response.code);
      Session.set('talento', response.talento);
    }
  });

  Template.team.helpers({
    jsTeam:function() {
    	return KTeam.find({}).fetch();
    }
  });
  Template.teamMember.helpers({
  	withTwitter:function(){
    	return (this.twitter!="@");
    }
  });
  
  Template.clock.helpers({
    activeTest: function() {
  		return Session.get('activeTest');
  	}
  });

  Template.theTest.helpers({
  	activeTest: function() {
  		return Session.get('activeTest');
  	},
  	messageTest: function(){
  		return Session.get('messageTest');
  	},
  	testNotStarted: function(){
  		return Session.get('testNotStarted');
  	},
    nextQuestion: function(){
      //console.log('Next Question');
      if (Session.get('testID').length && !Session.get('testNotStarted')) {
        var oid = getId({ id:Session.get('testID')[Session.get('nCounter_'+Session.get('activeTest'))] });
        //console.log("oid " + oid);
        var Ooid = (typeof oid !== "object") ? new Meteor.Collection.ObjectID(oid) : oid;
        //console.log("Ooid ", Ooid);
        var q = Kuestions.findOne({$or: [{_id: oid}, {_id: Ooid}]});
        //console.log('q: ' + q);
        //console.log(oid, Session.get('nCounter_'+Session.get('activeTest')), Session.get('nCounter_'+Session.get('activeTest')), Session.get('testID')[Session.get('nCounter_'+Session.get('activeTest'))]);
        if (q) {
      			return q.question;
        } else {
          _log('question ', q, 'testEnd called');
          Session.set('textEndCalledNow', true);
        	Meteor.call(
        		'testEnd',
        		{t:Session.get('activeTest'), ta: Session.get('talento')},
          	function(err, response) {
          		if (err) { console.log(err, response);
          		} else {
          			var huevopascua = "<div class='huevopascua'><img src='/img/fintest.gif' /></div>";
          			showMesg( response + huevopascua);
                Session.set('activeTest', '');
                Session.set('activeTime', false);
                Session.set('testNotStarted', true);
                Session.set('textEndCalledNow', false);
          		}
          	}
        	);
          $('#clock').hide();
          return '';
        }
      } else {
        return '';
      }
    },
    nextCodeExample: function(){
      if (Session.get('testID').length && !Session.get('testNotStarted')) {
        var oid = getId({ id:Session.get('testID')[Session.get('nCounter_'+Session.get('activeTest'))] });
        var Ooid = (typeof oid !== "object") ? new Meteor.Collection.ObjectID(oid) : oid;
        var c = Kuestions.findOne({$or: [{_id: oid},{_id: Ooid}]});
        if (c) {
          return "<pre style='border:0'><code>" + c.codeExample.replace("{","{<br>").replace("}","}<br>").replace(";",";<br>") + "</code></pre>";
        } else {
          return '';
        }
      } else {
        return '';
      }
    },
    answers: function(){
      if (Session.get('testID').length && !Session.get('testNotStarted')) {
        var oid = getId({ id:Session.get('testID')[Session.get('nCounter_'+Session.get('activeTest'))] });
        var Ooid = (typeof oid !== "object") ? new Meteor.Collection.ObjectID(oid) : oid;
        var a = Kuestions.findOne({$or: [{_id: oid},{_id: Ooid}]});
        if (a) {
          return a.answers.sort(function() {return Math.random() - 0.5;});
        } else {
          return '';
        }
      } else {
       return '';
      }
    }
  });
	Template.loginSection.helpers({
		'messageTest': function(){
			return Session.get('messageTest');
		},
		'testList': function(){
			var testList = Tests.find({}).fetch();
      var testGroups = [];
      var size = 3;
      while (testList.length > 0) {
        testGroups.push(testList.splice(0, size));
      }
      return testGroups;
		}
	});




//********  EVENTS  *************//

  Template.theTest.events({
    'click .answer_test': function(){
      var answerID = Session.get('testID')[Session.get('nCounter_'+Session.get('activeTest'))],
          answerTXT = document.querySelector("[name=answer_test]:checked").value,
          userId = Meteor.userId();
      // SAVE RESULT - SEND RESULT
      var ansusid = userId+Session.get('activeTest');
      if (Session.get('activeTest') !== '' && ansusid && answerID && answerTXT) {
      	Meteor.call('questionAlreadyAnswered',
      		{	ansusid: ansusid, answerID: answerID, test:Session.get('activeTest') },
      		function(err, response) {
      			if (err) {
      				console.log(err, response);
      				showMesg("Ocurrio un error en la base de datos.");
		    		} else {
		    			if (response) {
		    				showMesg("<p>La pregunta anterior ya fue respondida anteriormente</p>");
		    				showNextQuestion();
		    			} else {
		    				showMesg('');
					      var aId = Answers.insert({'user':ansusid, 'answerID':answerID , 'answerTXT':answerTXT, 'test':Session.get('activeTest') },
					        function(error, result) {
					          if (error) {
					          	console.log(" ERR: " + error);
					            showMesg("Ocurrio un error guardando tu respuesta en la base de datos");
					          } else {
						          //console.log("RES: " + result);
						          if (!result) {
						          	showMesg("Tu respuesta devolvió un error guardandola en la base de datos");
						          } else {
						          	showNextQuestion();
						          }
						        }
					        }
			      		);
			      	}
				    }
      		}
      	);
	    } else {
	    	showMesg("Tu respuesta no se guardo en la base de datos");
	    }
    },
    'click .start-test': function(){
      var ids = Kuestions.find({test:Session.get('activeTest')},{fields:{_id:1}}).fetch(),
      		userId = Meteor.userId(),
        	ansusid = userId+Session.get('activeTest');
      testID = [];
      for(i=0;i<ids.length;i++){
        testID.push(ids[i]._id.toString().replace("ObjectID(\"",'').replace("\")",''));
      }
      Session.set('testNotStarted' , false);
      $('#clock').show();
      Meteor.call('testStart',
        {'u':userId, 't':Session.get('activeTest')},
        function(err, response){  
          if (err) { console.log(err, response); }
          else {
            Session.set('activeTime',true);
            var now = new Date();
            gradclock = new Date(now.getTime() + response);
            clockActive = true;
            digit2 = $('#digit-2');
            digit3 = $('#digit-3');
            digit4 = $('#digit-4');
            digit5 = $('#digit-5');
            digit6 = $('#digit-6');
            requestAnimationFrame(render);
            console.log("Mostramos el reloj en cuenta a atrás");
          }
        }
      );
      Meteor.call(
        'getQuestionsAnswered',
        {ansusid:ansusid, testID:testID},
        function(err, response) {
          console.log(response);
          if (err) { console.log(err, response);
            console.log("ERROR");
            console.log(err);
          } else {
            Session.set('testID', response); //.sort(function() {return Math.random() - 0.5;}));
            //console.log(Session.get('testID'));
            showMesg( '');
          }
        }
      );
    }
  });

	Template.loginSection.events({
		'click .test': function(){
			var t = $(event.target).attr('data-test');
			Session.set('testNotStarted' , true);
      _resetCounters();
			Meteor.call(
				'doTest',
				{ t:t },
				function(err, response){
					if (err) { console.log(err, response); }
					else {
						showMesg(response);
						if (response === '') {
							Session.set('activeTest', t);
							Session.set('testNotStarted' , true);
              _log('quiere hacer el test ' + t);
              $('#clock').hide();
						} else {
							Session.set('activeTest', '');
						}
					}
				});
		}
	});

  Template.main.helpers({
    'consoleOpen':function(){
      return (Session.get('consoleOpen'))?'TRUE':'FALSE';
    },
    'hasKCode': function(){
      if (Session.get('kcode')) {
        return true;
      } else {
        Meteor.logout();
        return false;
      }
    }
  });
  Template.main.events({
    'click .logout': function() {
      Meteor.call('preLogout',{}, function() {
        Meteor.logout();
        Session.set('kcode', '');
      });
    }
  });

  Template.main.onRendered(function(){
    $('#clock').hide();
  });

  Meteor.startup(function(){
    getId = function(args){
      var id = args.id,
          idType = (Kuestions.find({ _id: { $type: 2 } }).count() > 0);
      if (idType) {
        oid = id;
      } else {
        oid = new Meteor.Collection.ObjectID();
        oid._str = id;
      }
      return oid;
    };
    showNextQuestion = function(){
      Session.set('nCounter_'+Session.get('activeTest'), Session.get('nCounter_'+Session.get('activeTest'))+1);
    	document.querySelector("[name=answer_test]:checked").blur();
			document.querySelector("[name=answer_test]:checked").checked=false;
    };
    endTest = function(){

    };
    showMesg = function(text) {
    	Session.set('messageTest', text);
    };
  });

  Tracker.autorun(function(){
    if (Meteor.user()) {
      Meteor.call('setUserKcode', {c:kcode, u:Meteor.userId()});
    }
    var isActive = (Active.find({u:Meteor.userId(),t:Session.get('activeTest')}).fetch().length===1);
    // console.log("isActive:"+isActive + " - test:" + Session.get('activeTest') + " - test NotStarted:" + Session.get('testNotStarted') + " - activeTime:" + Session.get('activeTime'));
      _log("!isActive: "+!isActive);
      _log("activeTest: "+Session.get('activeTest')+"!==''");
      _log("testNotStarted "+!Session.get('testNotStarted'));
      _log("activeTime: "+Session.get('activeTime'));
      _log("-----------------------------------------");

    if (!isActive && Session.get('activeTest')!=='' && !Session.get('testNotStarted') && Session.get('activeTime')) {
      //console.log("TIME OUT");
      if ( !Session.get('textEndCalledNow') ) {
        Session.set('textEndCalledNow', true);
        _log('testEnd Called');
        Meteor.call(
            'testEnd',
            {t:Session.get('activeTest')},
            function(err, response) {
              _log('testEnd has responsed');
              if (err) { console.log(err, response);
              } else {
                $('#clock').hide();
                clockActive = false;
                var text = '';
                if (!Session.get('activeTime')) {
                  text = '<h3 class="section-subheading text-muted">Lo sentimos. Finalizó el tiempo que tenias para realizar el test.</h3>';
                } else {
                  text = response;
                }
                showMesg(text);
                _resetCounters();
                Session.set('activeTest', '');
                Session.set('activeTime', false);
                Session.set('testNotStarted', true);
                Session.set('textEndCalledNow', false);
              }
            }
        );
      }
      //Session.set('activeTest', '');
      //Session.set('activeTime', false);
    }

  });

}