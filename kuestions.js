Kuestions = new Mongo.Collection("kuestions");
Answers = 	new Mongo.Collection("answers");
KTeam = 		new Mongo.Collection("kteam");
KHistory = 	new Mongo.Collection("khistory");

if (Meteor.isClient) {
  Session.set( "nCounter_javascript" , 0 );
  Session.set( "nCounter_q-adopter", 0 );
  Session.set( "testID", [] );
  Session.set( "activeTest", "" );
  Session.set( "messageTest" , "" );
  Session.set( "testNotStarted" , true );

  var testID = [],
  		activeTest;

  Meteor.subscribe("kuestions");
  Meteor.subscribe("kteam");
  Meteor.subscribe("khistory");

  Template.team.helpers({
    jsTeam:function() {
    	return KTeam.find({}).fetch();
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
      if ( Session.get("testID").length ) {
        var oid = getId( { id:Session.get("testID")[Session.get("nCounter_"+Session.get("activeTest"))] } ),
        		q = Kuestions.findOne( {_id:oid} );
        		console.log( oid, Session.get("nCounter_"+Session.get("activeTest")), Session.get("testID")[Session.get("nCounter_"+Session.get("activeTest"))]);
        if ( q ) {
          return q.question;
        } else {
          Session.set(
          	"endMessage", 
          	Meteor.call( 
          		"testEnd", 
          		{t:Session.get("activeTest")}, 
	          	function( err, response ) { 
	          		if ( err) { console.log( err, response ); 
	          		} else { Session.set( "messageTest", response ); }
	          	}
          	) 
          );
          return "";
        }
      } else {
        return "";
      }
    },
    nextCodeExample: function(){
      if ( Session.get("testID").length ) {
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
      if ( Session.get("testID").length ) {
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
		}
	});


//********  EVENTS  *************//

  Template.theTest.events({
    'click .answer_test': function(){
      var answerID = Session.get( "testID" )[Session.get("nCounter_"+Session.get("activeTest"))],
          answerTXT = document.querySelector("[name=answer_test]:checked").value,
          userId = Meteor.userId();
      Session.set( "nCounter_"+Session.get("activeTest"), Session.get( "nCounter_"+Session.get("activeTest") )+1 );
      document.querySelector("[name=answer_test]:checked").blur();
      document.querySelector("[name=answer_test]:checked").checked=false;
      // SAVE RESULT - SEND RESULT
      Answers.insert( {"user":userId, "answerID":answerID , "answerTXT":answerTXT, "test":Session.get("activeTest") },
        function( error, result) { 
          if ( !result ) {
            // ocultamos div de preguntas y damos mensaje segun error.error (403 no permitido...)
          }
        }
      );
    },
    'click .start-test': function(){
      var ids = Kuestions.find({test:Session.get("activeTest")},{fields:{_id:1}}).fetch();
      for(i=0;i<ids.length;i++){
        testID.push( ids[i]._id.toString().replace("ObjectID(\"","").replace("\")",""));
      }
      Session.set( "testID", testID.sort(function() {return Math.random() - 0.5;} ) );
      Session.set( "testNotStarted" , false );
    }
  });

	Template.loginSection.events({
		'click .test': function(){
			var t = $(event.target.parentElement).attr("data-test");
			Meteor.call( 
				"doTest", 
				{ t:t },
				function( err, response ){
					if ( err ) { console.log( err, response ); }
					if ( response === "" ) {
						Session.set( "activeTest", t );
						Session.set( "messageTest", response );
						Session.set( "testNotStarted" , true );
					} else {
						Session.set( "activeTest", "" );
						Session.set( "messageTest", response );
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
  });

  Tracker.autorun(function(){
  	
  });

}

/*
  service: "github",
        cliendId: "dc1cdc65081be9e5ef7b",
        secret: "becf14076e4773a8ef48837372902ee74b01db3d"
        //clientId: "644c1ff5b4c8d33ea422",
        //secret: "e50d99825dc23fd4cba59e3a7bf0ff0c3736361d"
*/