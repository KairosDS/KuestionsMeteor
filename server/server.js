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
Meteor.publish("testsgroup", function () {
  return TestsGroup.find({});
});
Meteor.publish("active", function () {
    return Active.find({});
});
Meteor.publish("kcode", function(){
  return Kcode.find({});
})

var nQ = {};
var timeId = {};
var timeEndTest = {};
var timeIniTest = {};
var timeByQuestion = 45; //seconds
var maxTime = {};
var debugMode = true;

Meteor.startup( function(){
  var _log = function(msg) {
    if ( debugMode ) {
      console.log( msg );
    }
  };

  var getDiff = function( d2, d1 ) {
    var diff=d2-d1,sign=diff<0?-1:1,milliseconds,seconds,minutes,hours,days;
    diff/=sign; // or diff=Math.abs(diff);
    diff=(diff-(milliseconds=diff%1000))/1000;
    diff=(diff-(seconds=diff%60))/60;
    diff=(diff-(minutes=diff%60))/60;
    days=(diff-(hours=diff%24))/24;
    var aTime = [];
    if ( days > 0 ) { aTime.push(days+" days"); }
    if ( hours > 0 ) { aTime.push(hours+" hours"); }
    if ( minutes > 0 ) { aTime.push(minutes+" minutes"); }
    if ( seconds > 0 ) { aTime.push(seconds+" seconds"); }
    var timeString = aTime.join(", ");
    //var res = (sign===1?"Elapsed: ":"Remains: ")+timeString;
    var res = timeString;
    console.info(res);
    return res;
  };
  var _updateTimeCounter = function(user,test){
    Active.remove({"u":user,"t":test});
    TimeCounter.update({"user":user,"test":test},{"user":user,"test":test,"timeIni":timeIniTest[this.userId],"timeEnd":timeEndTest[this.userId]});
  };
  var timeoutStart = function(args){
    var user = args.user;
    var test = args.test;
    var timeToClock = args.timeToClock;
    timeId[user+test] = Meteor.setTimeout(function(){
      _updateTimeCounter(user,test);
      _log("Tiempo " + (timeEndTest[this.userId]-timeIniTest[this.userId]) + " segundos para el test superado");
    }, timeToClock);
  };

  nQ['java1'] = Kuestions.find({"test":"java1"}).count();
  nQ['javascript1'] = Kuestions.find({"test":"javascript1"}).count();
  nQ['javascript2'] = Kuestions.find({"test":"javascript2"}).count();
  nQ['polymer'] = Kuestions.find({"test":"polymer"}).count();
  nQ['friki'] = Kuestions.find({"test":"friki"}).count();
  nQ['Arquitecto'] = Kuestions.find({"test":"Arquitecto"}).count();
  nQ['Testing'] = Kuestions.find({"test":"Testing"}).count();
  nQ['design'] = Kuestions.find({"test":"design"}).count();

  maxTime = {
    "java1": nQ['java1']*60,
    "javascript1": nQ['javascript1']*timeByQuestion,
    "javascript2": nQ['javascript2']*timeByQuestion,
    "polymer": nQ['polymer']*timeByQuestion,
    "friki": nQ['friki']*timeByQuestion,
    "Arquitecto": nQ['Arquitecto']*timeByQuestion,
    "Testing": nQ['Testing']*timeByQuestion,
    "design": nQ['design']*timeByQuestion
  };

  Answers.allow({
    'insert': function ( userId, doc) {
      var answerExist = !!Answers.find( { "user":userId+doc.test, "answerID": doc.answerID } ).count();
      _log( "¿Existe respuesta para user "+userId+" test: "+ doc.test+", answerID: "+ doc.answerID+"? " + answerExist );
      _log( "Answers.find( { \"user\":\""+userId+doc.test+"\", \"answerID\": \""+doc.answerID+"\" } ).count() = " + answerExist );
      _log( "Users:  " + userId + " == " + Meteor.userId() );
      //var resp = ( userId == Meteor.userId() )?( ( !answerExist )?"OK":"NEXT" ):false;
      var resp = ( userId == Meteor.userId() );
      _log( "RESULTADO INSERT RESPUESTA: " + resp );
      return resp; //( userId == Meteor.userId() );
    }
  });

  Meteor.methods({
    getQT: function(args){
      return maxTime;
    },
    testStart: function(args){
      var user = args.u;
      var test = args.t;
      var usertest = user + test;
      var timeToClock = 0;
      if (!TimeCounter.find().fetch().length || !TimeCounter.find({"user":user,"test":test}).fetch().length) {
        timeIniTest[this.userId] = new Date();
        TimeCounter.insert({"user":user,"test":test,"timeIni":timeIniTest[this.userId],"timeEnd":0});
        Active.insert({"u":user,"t":test});
        timeToClock = maxTime[test]*1000;
        _log("apunto el tiempo en el servidor para usuario " + user + " para el test " + test + ". Tiene maximo " + maxTime[test] + " segundos");
      } else {
        // Indicarle que ya comenzó el test en algun momento y no lo terminó
        var tc = TimeCounter.find({"user":user,"test":test}).fetch();
        _log( tc, tc[0], tc[0].timeIni );
        timeIniTest[this.userId] = new Date(tc[0].timeIni);
        var now = new Date();
        var timeVar = now.getTime() - timeIniTest[this.userId];
        timeToClock = maxTime[test]*1000 - timeVar;
        _log(timeToClock);
        _log("Test ya comenzado en algun momento y no lo terminó. Le quedan " + (timeToClock/1000) + " segundos" );
      }
      timeEndTest[this.userId] = timeIniTest[this.userId].getTime() + timeToClock;
      timeoutStart({user:user,test:test,timeToClock:timeToClock});
      return timeToClock;
    },
    questionAlreadyAnswered: function(args){
      var ansusid = args.ansusid;
      var answerID = args.answerID;
      var test = args.test;
      var resp = Answers.find({"user":ansusid, "answerID":answerID , "test":test}).count();
      return (resp!==0);
    },
    testEnd: function(args){
      Meteor.clearTimeout(timeId[this.userId+args.t]);
      _log("Clear Timeout " + timeId[this.userId+args.t]);
      //clockActive = false;
      _log( "Terminó el usuario " + this.userId );
      timeEndTest[this.userId] = new Date();
      // Calc score
      var t = args.t;
      var r = Answers.find({"user":this.userId+t}).fetch();
      var idType = ( Kuestions.find( { _id: { $type: 2 } } ).count() > 0 );
      var objId = new Meteor.Collection.ObjectID();
      var result = 0;
      var talento = args.ta;
      _log( "USER ID: " + this.userId + t );
      // CALC RESULT
      for ( i=0; i<r.length; i++ ){
        var id = r[i].answerID,
            oid , a;
        if (idType) { oid = id; } else { objId._str = id; oid = objId; }
        var Ooid = new Meteor.Collection.ObjectID(oid);
        var ku = Kuestions.findOne({$or: [{_id: oid},{_id: Ooid}]});
        var a = ku.answers;
        obj = _.find( a, function(obj) { return ( obj.text === r[i].answerTXT ); } );
        _log( "id:" + oid + " a:" + a + "   |  "+obj.text + " === " + r[i].answerTXT );
        result += parseInt( obj.value );
        _log( "Valor respuesta: " + obj.value + " --> RESULTADO TOTAL: " + result );
      }
      // Time
      timeToComplete = getDiff( timeEndTest[this.userId], timeIniTest[this.userId] );
      _log( "end: " + timeEndTest[this.userId] + ",ini: "+ timeIniTest[this.userId] );
      _log( "Time to complete test: " + timeToComplete );
      _updateTimeCounter(this.userId,args.t);
      // Guardamos en result

      // SAVE SCORE
      if ( !Results.find( { "user":this.userId+t } ).count() && t) {
        _log( "ENTRA A GUARDAR RESULTADO...");
        var total = Kuestions.find({test:t}).count();
        Results.insert( { "user":this.userId+t,
                          "username":Meteor.user().services.github.username,
                          "email":Meteor.user().services.github.email,
                          "score":result + " de " + total,
                          "time": timeToComplete,
                          "date": new Date(),
                          "talento": talento 
                        });
        _log( "Result: " + result + " de " + total + " para " + this.userId + " en el test " + t );
        //GET EMAILS TO ALERT
        alertEmails = KTeam.find({$where: "this.alert_email==true"}).fetch();
        _log(alertEmails);
        // SAVE GLOBAL RANKING
        var username = Meteor.user().services.github.username;
        var res = Results.find({"username":username}).fetch();
        if ( res.length > 0 ) {
          var percents = {
            "java1": 100,
            "javascript1":35, "javascript2":60, "polymer":5,
            "Arquitecto":100,
            "Testing":100,
            "design":100,
            "friki":100
          };
          var resName = { "java1":"java", "javascript1":"js", "javascript2":"js", "polymer":"js", "Arquitecto":"qa", "Testing":"tg", "design":"hc", "friki":"fk" };
          var rt = { "java":0, "js":0, "qa":0, "tg":0, "hc":0, "fk":0 };
          for( i=0; i<res.length; i++){
            var el = res[i];
            var test = el.user.substr(17);
            var s = el.score.split(" de ");
            var rN = resName[test];
            var now = new Date();
            _log( "TEST: "+test+" rN:"+rN+" %:"+percents[test]);
            rt[rN] += percents[test] * s[0] / s[1];
          }
          _log( "SAVING RANKING: java:" + rt.java.toFixed(2) + ", js:"+rt.js.toFixed(2)+", qa:"+rt.qa.toFixed(2)+", tg:"+rt.tg.toFixed(2)+", hc:"+rt.hc.toFixed(2)+", fk:"+rt.fk.toFixed(2));
          Ranking.upsert({username:username},{username:username,result_java:rt.java.toFixed(2), result_js:rt.js.toFixed(2), result_qa:rt.qa.toFixed(2), result_tg:rt.tg.toFixed(2), result_hc:rt.hc.toFixed(2), result_fk:rt.fk.toFixed(2), date: now });
          _log('upsert OK');  
        }

        var code = Kcode.find({"user":Meteor.userId(), volatile: true}).fetch();
        if (code.length) {
          _log('code found ' + code[0]._id);
          Kcode.remove(code[0]._id);
        }
        return "<h3>Test finalizado correctamente. Nos pondremos en contacto contigo si superaste el test. Muchas gracias!</h3>";
      } else {
        return "<h3>Este test ya lo realizaste y no es posible hacerlo mas de una vez. Si lo superaste nos pondremos en contacto contigo. Muchas gracias!</h3>";
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
        _log( "Test " + t + " ya realizado para el usuario " + this.userId );
        return "<h3>Test ya realizado. Si lo superaste nos pondremos en contacto contigo. Muchas gracias!</h3>";
      }

    },
    getQuestionsAnswered: function( args ){
      var ansusid = args.ansusid,
          testID = args.testID;
      // Recuperar las preguntas que contesto el usuario de Answers
      // Eliminar estas del array de testID
      //console.log("testID: " + testID);
      return testID;
    },
    getKCode: function(arg){
      var code = '';
      var talento = '';
      var kcode = Kcode.find({$or:[{"code":arg.c, "user":""},{"code":arg.c, "volatile":false}]}).fetch();
      if (kcode.length===1) {
        code = kcode[0].code;
        talento = (kcode[0].talento==='') ? kcode[0].code : kcode[0].talento;
      }
      return {code: code, talento: talento};
    },
    setUserKcode: function(arg){
      var code = '';
      var talento = '';
      var kcode = Kcode.find({$or:[{"code":arg.c, "user":""}]}).fetch();
      if (kcode.length===1) {
        code = kcode[0].code;
        talento = kcode[0].talento;
        if (kcode[0].volatile === true && arg.u === Meteor.userId()) {
          Kcode.update({"code" : arg.c},{$set:{"user": arg.u}});
          console.log("guardo " + arg.u + " en Kcode DB " + arg.c);
          return true;
        }
      }
      return false;
    },
    preLogout: function() {
      var u = Meteor.userId;
      Kcode.remove({user:u});
      return true;
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
