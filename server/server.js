Results = new Mongo.Collection("results");

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
      console.log( "¿Existe respuesta para user "+userId+" test: "+ doc.test+", answerID: "+ doc.answerID+"? " + answerExist );
      console.log( "Answers.find( { \"user\":\""+userId+doc.test+"\", \"answerID\": \""+doc.answerID+"\" } ).count() = " + answerExist );
      console.log( "Users:  " + userId + " == " + Meteor.userId() );
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
      // Time
      timeToComplete = 0;
      // Guardamos en result

      if ( !Results.find( { "user":this.userId+t } ).count() ) {
        var total = Kuestions.find({test:t}).count();
        Results.insert( { "user":this.userId+t, 
                          "username":Meteor.user().services.github.username, 
                          "email":Meteor.user().services.github.email,
                          "score":result + " de " + total,
                          "time": timeToComplete });
        console.log( "Result: " + result + " de " + total + " " + this.userId+t );  
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