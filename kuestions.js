Kuestions = new Mongo.Collection("kuestions");
Answers = new Mongo.Collection("answers");

if (Meteor.isClient) {
  Session.set( "nCounter", 0 );
  Session.set( "testID", [] );

  var testID = [];

  Meteor.subscribe("kuestions");

  Template.main.helpers({
    
  });
  Template.team.helpers({
    jsTeam:[
      { name:"Jorge del Casar", description:"FrontEnd fucking master", image:"img/team/1.png", twitter_link:"https://twitter.com/JorgeCasar", twitter:"@JorgeCasar"},
      { name:"Álvaro Isorna", description:"The Architect",image:"img/team/2.jpg", twitter_link:"https://twitter.com/isorna", twitter:"@isorna"},
      { name:"Mánu Fosela", description:"Adaptive Developer", image:"img/team/3.jpg", twitter_link:"https://twitter.com/manufosela", twitter:"@manufosela"}
    ]
  });

  Template.jsTest.helpers({
    nextQuestion: function(){
      if ( Session.get("testID").length ) {
        var oid = new Meteor.Collection.ObjectID();
        oid._str = Session.get("testID")[Session.get("nCounter")]; 
        var q = Kuestions.findOne( {_id:oid} );
        if ( q ) {
          return q.question;
        } else {
          Meteor.call( "testEnd", {}, function( err, response ) {} );
          return "";
        }
      } else {
        return "";
      }
    },
    nextCodeExample: function(){
      if ( Session.get("testID").length ) {
        var oid = new Meteor.Collection.ObjectID();
        oid._str = Session.get("testID")[Session.get("nCounter")]; 
        var c = Kuestions.findOne( {_id:oid} );
        if ( c ) {
          return "<pre style='border:0'><code>" + c.codeExample.substring(1).replace("{","{<br>").replace("}","}<br>").replace(";",";<br>") + "</code></pre>";
        } else {
          return "";
        }
      } else {
        return "";
      }
    },
    answers: function(){
      if ( Session.get("testID").length ) {
        var oid = new Meteor.Collection.ObjectID();
        oid._str = Session.get("testID")[Session.get("nCounter")]; 
        var a = Kuestions.findOne( {_id:oid} );
        if ( a ) {
          return a.answers;
        } else {
          return "";
        }
      } else {
       return "";
      }
    }
  });

  Template.jsTest.events({
    'click .answer_test': function(){
      var answerID = Session.get( "testID" )[Session.get("nCounter")],
          answerTXT = document.querySelector("[name=answer_test]:checked").value,
          userId = Meteor.userId();
      Session.set( "nCounter", Session.get( "nCounter")+1 );
      document.querySelector("[name=answer_test]:checked").blur();
      document.querySelector("[name=answer_test]:checked").checked=false;
      // SAVE RESULT - SEND RESULT
      Answers.insert( {"user":userId, "answerID":answerID , "answerTXT":answerTXT },
        function( error, result) { 
          if ( !result ) {
            // ocultamos div de preguntas y damos mensaje segun error.error (403 no permitido...)
          }
        }
      );
    }
  });

  Template.main.events({
    'click .btn-github': function() {
        return Meteor.loginWithGithub({
          requestPermissions: ['user', 'user:email', 'avatar_url', 'public_data', 'public_repo']
        }, function (err) {
          if (err)
            Session.set('errorMessage', err.reason || 'Unknown error');
        } 
      );
    },
    'click .logout': function() {
      Meteor.logout();
    }
  });

  Template.jsTest.events({
    'click .start-js-test': function(){
      document.querySelector("#start_clock").style.display = "none";
      var ids = Kuestions.find({},{fields:{_id:1}}).fetch();
      for(i=0;i<ids.length;i++){
        testID.push( ids[i]._id.toString().replace("ObjectID(\"","").replace("\")",""));
      }
      Session.set( "testID", testID.sort(function() {return Math.random() - 0.5;} ) );
    }
  });

  Meteor.startup( function(){
    var dev = (location.host=="localhost"),
        clientid = (dev)?"dc1cdc65081be9e5ef7b":"abb44b013e032012ce15",
        secret = (dev)?"becf14076e4773a8ef48837372902ee74b01db3d":"88e18f6f7d35be18461813978a6e7eb3124808b4";

    ServiceConfiguration.configurations.upsert(
      { service: "github" },
      {
        $set: {
          clientId: clientid,
          loginStyle: "popup",
          secret: secret
        }
      }
    );
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