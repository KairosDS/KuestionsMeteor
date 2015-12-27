Tests 		= new Mongo.Collection("tests");
Kuestions = new Mongo.Collection("kuestions");
Answers 	= new Mongo.Collection("answers");
KTeam 		= new Mongo.Collection("kteam");


if (Meteor.isClient) {
  Session.set( "nCounter_javascript1", 0 );
  Session.set( "nCounter_javascript2", 0 );
  Session.set( "nCounter_polymer", 0 );
  Session.set( "nCounter_Arquitecto", 0 );
  Session.set( "nCounter_Testing", 0);
  Session.set( "nCounter_friki", 0 );
  Session.set( "testID", [] );
  Session.set( "activeTest", "" );
  Session.set( "messageTest" , "" );
  Session.set( "testNotStarted" , true );

  var testID,
  		activeTest;

  Meteor.subscribe("kuestions");
  Meteor.subscribe("kteam");
  Meteor.subscribe("tests");

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

  Template.theTest.helpers({
  	activeTest: function() {
  		return Session.get( "activeTest" );
  	},
  	messageTest: function(){
  		return Session.get( "messageTest" );
  	},
  	testNotStarted: function(){
  		return Session.get( "testNotStarted" );
  	},
    nextQuestion: function(){
      if ( Session.get("testID").length && !Session.get("testNotStarted") ) {
        var oid = getId( { id:Session.get("testID")[Session.get("nCounter_"+Session.get("activeTest"))] } ),
        		q = Kuestions.findOne( {_id:oid} );
        		//console.log( oid, Session.get("nCounter_"+Session.get("activeTest")), Session.get("testID")[Session.get("nCounter_"+Session.get("activeTest"))]);
        if ( q ) {
      			return q.question;	
        } else {
        	Meteor.call( 
        		"testEnd", 
        		{t:Session.get("activeTest")}, 
          	function( err, response ) { 
          		if ( err) { console.log( err, response ); 
          		} else { 
          			var huevopascua = "<div class='huevopascua'><img src='/img/fintest.gif' /></div>";
          			showMesg(  response + huevopascua ); 
          		}
          	}
        	); 
          return "";
        }
      } else {
        return "";
      }
    },
    nextCodeExample: function(){
      if ( Session.get("testID").length && !Session.get("testNotStarted") ) {
        var oid = getId( { id:Session.get("testID")[Session.get("nCounter_"+Session.get("activeTest"))] } ),
        		c = Kuestions.findOne( {_id:oid} );
        if ( c ) {
          return "<pre style='border:0'><code>" + c.codeExample.replace("{","{<br>").replace("}","}<br>").replace(";",";<br>") + "</code></pre>";
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
    answers: function(){
      if ( Session.get("testID").length && !Session.get("testNotStarted") ) {
        var oid = getId( { id:Session.get("testID")[Session.get("nCounter_"+Session.get("activeTest"))] } ),
        		a = Kuestions.findOne( {_id:oid} );
        if ( a ) {
          return a.answers.sort(function() {return Math.random() - 0.5;} );
        } else {
          return "";
        }
      } else {
       return "";
      }
    }
  });
	Template.loginSection.helpers({
		"messageTest": function(){
			return Session.get("messageTest");
		},
		"testList": function(){
			return Tests.find({}).fetch();
		}
	});


//********  EVENTS  *************//

  Template.theTest.events({
    'click .answer_test': function(){
      var answerID = Session.get( "testID" )[Session.get("nCounter_"+Session.get("activeTest"))],
          answerTXT = document.querySelector("[name=answer_test]:checked").value,
          userId = Meteor.userId();
      // SAVE RESULT - SEND RESULT
      var ansusid = userId+Session.get("activeTest");
      if ( Session.get("activeTest") !== "" && ansusid && answerID && answerTXT ) {
      	if ( Answers.find({"user":ansusid, "answerID":answerID , "test":Session.get("activeTest")}).count() ) {
      		console.log( "Question already answered. Next" );
      	} else {
		      Answers.insert( {"user":ansusid, "answerID":answerID , "answerTXT":answerTXT, "test":Session.get("activeTest") },
		        function( error, result) { 
		          if ( error ) {
		            showMesg( "Ocurrio un error guardando tu respuesta en la base de datos" );
		          }
		          if ( !result ) { Session.set("nCounter_"+Session.get("activeTest"),9999); Session.set("activeTest",""); }
		          else {
		          	showNextQuestion();
		          }
		        }
		      );
		    }
	    } else {
	    	showMesg( "Ocurrio un error guardando tu respuesta en la base de datos" );
	    }
    },
    'click .start-test': function(){
      var ids = Kuestions.find({test:Session.get("activeTest")},{fields:{_id:1}}).fetch(),
      		userId = Meteor.userId(),
        	ansusid = userId+Session.get("activeTest");
      testID = [];
      for(i=0;i<ids.length;i++){
        testID.push( ids[i]._id.toString().replace("ObjectID(\"","").replace("\")",""));
      }
      Session.set( "testNotStarted" , false );
      Meteor.call( 
				"getQuestionsAnswered", 
				{ansusid:ansusid, testID:testID},
				function( err, response ) { 
		    		if ( err) { console.log( err, response ); 
		    		} else { 
				 			Session.set( "testID", response ); //.sort(function() {return Math.random() - 0.5;} ) );
				      showMesg(  "" );
		    		}
		    	}
			);
    }
  });

	Template.loginSection.events({
		'click .test': function(){
			var t = $(event.target).attr("data-test");
			Session.set( "testNotStarted" , true );
			Meteor.call( 
				"doTest", 
				{ t:t },
				function( err, response ){
					if ( err ) { console.log( err, response ); }
					else {
						showMesg( response );
						if ( response === "" ) {
							Session.set( "activeTest", t );
							Session.set( "testNotStarted" , true );
						} else {
							Session.set( "activeTest", "" );
						}
					}
				});
		}
	});

  Template.main.events({
    'click .logout': function() {
      Meteor.logout();
    }
  });

  Meteor.startup( function(){
    getId = function( args ){
      var id = args.id,
          idType = ( Kuestions.find( { _id: { $type: 2 } } ).count() > 0 );
      if ( idType ) {
        oid = id;
      } else {
        oid = new Meteor.Collection.ObjectID();
        oid._str = id;
      }
      return oid;
    };
    showNextQuestion = function(){
      Session.set( "nCounter_"+Session.get("activeTest"), Session.get( "nCounter_"+Session.get("activeTest") )+1 );
    	document.querySelector("[name=answer_test]:checked").blur();
			document.querySelector("[name=answer_test]:checked").checked=false;
    };
    endTest = function(){

    };
    showMesg = function( text ) {
    	Session.set( "messageTest", text );
    };
  });

  Tracker.autorun(function(){
  	
  });

}