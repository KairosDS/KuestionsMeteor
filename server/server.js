Results = new Mongo.Collection("results");

Meteor.publish("kuestions", function () {
  return Kuestions.find({},{fields:{"question":1,"codeExample":1,"answers.text":1}});
});
Meteor.publish("answers", function () {
  return Answers.find({});
});

Meteor.startup( function(){
  /*var cursorAnswers = Answers
                    .find({})
                    .observe({
                      added:function(d){
                        console.log( d._id );
                        if ( d.answerID ) {
                          // CALC SCORE
                          console.log( "Insertada respuesta: " + d.answerID );
                        }
                      }
                    });
                    */
  // Answers._ensureIndex( {answerID:1} ); //, { unique: true } );

  Answers.allow({
    'insert': function ( userId, doc) {
      var answerExist = Answers.find( { "user":userId, "answerID": doc.answerID } ).count();
      return ( userId == Meteor.userId() && !answerExist ); 
    }
  });

  Meteor.methods({
    'testEnd': function(){
      console.log( "Terminó el usuario " + this.userId );
      // Calc score
      var r = Answers.find({"user":this.userId}).fetch(), 
          result = 0;
      for ( i=0; i<r.length; i++ ){
        var oid = new Meteor.Collection.ObjectID(r[i].answerID),
            a = Kuestions.findOne({_id:oid}).answers;
        obj = _.find( a, function(obj) { return ( obj.text === r[i].answerTXT ); } );
        result += obj.value;
      }
      // Time
      timeToComplete = 0;
      // Guardamos en result
      Results.insert( { "user":this.userId, 
                        "username":Meteor.user().services.github.username, 
                        "email":Meteor.user().services.github.email,
                        "score":result,
                        "time": timeToComplete });
    }
  });

});