//Results = new Mongo.Collection("results");
Ranking   = new Mongo.Collection("ranking");

Meteor.publish("kuestions", function () {
  return Kuestions.find({},{fields:{"_id":1,"test":1,"question":1,"codeExample":1,"answers.text":1}});
});
Meteor.publish("answers", function () {
  return Answers.find({});
});
Meteor.publish("kteam", function () {
  return KTeam.find({});
});
Meteor.publish("tests", function () {
  return Tests.find({});
});
Meteor.publish("kid", function(){
  return Kuestions.find({},{fields:{"_id":1}});
});

Meteor.startup( function(){
  /*var dev = (location.host=="localhost"),
        clientid = (dev)?"dc1cdc65081be9e5ef7b":"d3ecf49b839fc43d6e26",
        secret = (dev)?"becf14076e4773a8ef48837372902ee74b01db3d":"84f74c16d05b9cb15b444358d5c2b003d355b996";

  console.log( "---> " + dev );

  ServiceConfiguration.configurations.upsert(
    { service: "github" },
    {
      $set: {
        clientId: clientid,
        loginStyle: "popup",
        secret: secret
      }
    }
  );*/


  Answers.allow({
    'insert': function ( userId, doc) {
      var answerExist = Answers.find( { "user":userId+doc.test, "answerID": doc.answerID } ).count();
      //console.log( "¿Existe respuesta para user "+userId+" test: "+ doc.test+", answerID: "+ doc.answerID+"? " + answerExist );
      //console.log( "Answers.find( { \"user\":\""+userId+doc.test+"\", \"answerID\": \""+doc.answerID+"\" } ).count() = " + answerExist );
      //console.log( "Users:  " + userId + " == " + Meteor.userId() );
      var resp = ( userId == Meteor.userId() )?( ( !answerExist )?"OK":"NEXT" ):false;
      return ( userId == Meteor.userId() ); 
    }
  });

  Meteor.methods({
    testEnd: function(args){
      console.log( "Terminó el usuario " + this.userId );
      // Calc score
      var t = args.t,
          r = Answers.find({"user":this.userId+t}).fetch(),
          idType = ( Kuestions.find( { _id: { $type: 2 } } ).count() > 0 ),
          objId = new Meteor.Collection.ObjectID(), 
          result = 0;
      console.log( "USER ID: " + this.userId + t );
      // CALC RESULT
      for ( i=0; i<r.length; i++ ){
        var id = r[i].answerID,
            oid , a;
        if (idType) { oid = id; } else { objId._str = id; oid = objId; }
        a = Kuestions.findOne({_id:oid}).answers;
        obj = _.find( a, function(obj) { return ( obj.text === r[i].answerTXT ); } );
        console.log( "id:" + oid + " a:" + a + "   |  "+obj.text + " === " + r[i].answerTXT );
        result += parseInt( obj.value );
        console.log( obj.value + " --> " + result );
      }
      // Time (PENDIENTE)
      timeToComplete = 0;
      // Guardamos en result

      // SAVE SCORE
      if ( !Results.find( { "user":this.userId+t } ).count() ) {
        var total = Kuestions.find({test:t}).count();
        Results.insert( { "user":this.userId+t, 
                          "username":Meteor.user().services.github.username, 
                          "email":Meteor.user().services.github.email,
                          "score":result + " de " + total,
                          "time": timeToComplete,
                          "date": new Date() });
        console.log( "Result: " + result + " de " + total + " " + this.userId+t );  

        // SAVE GLOBAL RANKING
        var username = Meteor.user().services.github.username;
        var res = Results.find({"username":username}).fetch();
        var percents = {
          "javascript1":35, "javascript2":60, "polymer":5,
          "Arquitecto":100, 
          "Testing":100,
          "design":100,
          "friki":100
        };
        var resName = { "javascript1":"js", "javascript2":"js", "polymer":"js", "Arquitecto":"qa", "Testing":"tg", "design":"hc", "friki":"fk" };
        var rt = { "js":0, "qa":0, "tg":0, "hc":0, "fk":0 };
        for( i=0; i<res.length; i++){
          var el = res[i];
          var test = el.user.substr(17);
          var s = el.score.split(" de ");
          var rN = resName[test]; 
          console.log( "TEST: "+test+" rN:"+rN+" %:"+percents[test]);
          rt[rN] += percents[test] * s[0] / s[1];
        }
        console.log( "SAVING RANKING: js:"+rt.js.toFixed(2)+", qa:"+rt.qa.toFixed(2)+", tg:"+rt.tg.toFixed(2)+", hc:"+rt.hc.toFixed(2)+", fk:"+rt.fk.toFixed(2));
        Ranking.upsert({username:username},{username:username,result_js:rt.js.toFixed(2), result_qa:rt.qa.toFixed(2), result_tg:rt.tg.toFixed(2), result_hc:rt.hc.toFixed(2), result_fk:rt.fk.toFixed(2) });

        return "Test finalizado correctamente. Nos pondremos en contacto contigo si superaste el test. Muchas gracias!";
      } else {
        return "Este test ya lo realizaste y no es posible hacerlo mas de una vez. Si lo superaste nos pondremos en contacto contigo. Muchas gracias!";
      }
    },
    getId: function( args ){
      var id = args.id,
          idType = ( Kuestions.find( { _id: { $type: 2 } } ).count() > 0 );
      if ( idType ) {
        oid = id;
      } else {
        oid = new Meteor.Collection.ObjectID();
        oid._str = id;
      }
      return oid;
    },
    doTest: function( args ) {
      var t = args.t;
      if ( !Results.find( { "user":this.userId+t } ).count() ) {
        return "";
      } else {
        return "Test ya realizado. Si lo superaste nos pondremos en contacto contigo. Muchas gracias!";
      }
      
    },
    getQuestionsAnswered: function( args ){
      var ansusid = args.ansusid,
          testID = args.testID;
      // Recuperar las preguntas que contesto el usuario de Answers
      // Eliminar estas del array de testID
      return testID;
    }
  });

});

/*
  service: "github",
        cliendId: "dc1cdc65081be9e5ef7b",
        secret: "becf14076e4773a8ef48837372902ee74b01db3d"
        //clientId: "644c1ff5b4c8d33ea422",
        //secret: "e50d99825dc23fd4cba59e3a7bf0ff0c3736361d"


KAIROS:

cliendId:  03235db285cb8699703d
secret:   516e841105a890bf5552f662457b28322f700b02


*/