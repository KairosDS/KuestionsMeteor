Meteor.startup(function () {
    if ( !Kuestions.find().fetch().length ) {
        Kuestions.insert( { "test":"javascript", "question": "¿pregunta numero uno?", "codeExample": "", "answers": [ { "text": "respuesta numero 1", "value": 0 }, { "text": "respuesta numero 2", "value": 0 }, { "text": "respuesta numero 3", "value": 1 } ] }); 
        Kuestions.insert( { "test":"q-adopter", "question": "¿pregunta numero dos?", "codeExample": "function codigoEjemplo() { console.log('hola mundo'); }", "answers": [ { "text": "respuesta numero 1", "value": 2 }, { "text": "respuesta numero 2", "value": 0 }, { "text": "respuesta numero 3", "value": 1 } ] });         console.log( "inserted " + Kuestions.find({}).fetch().length + " questions" );
        Kuestions.insert( { "test":"friki", "question": "¿pregunta numero tres?", "codeExample": "", "answers": [ { "text": "respuesta numero 1", "value": 1 }, { "text": "respuesta numero 2", "value": 0 }, { "text": "respuesta numero 3", "value": 1 } ] }); 
        Results._ensureIndex({ "user": 1}); // mongo: db.results.createIndex({user:1})
        console.log( "Kuestions inserted" );
    } else {
        console.log( "Kuestions exists" );
    }

    if ( !KTeam.find().fetch().length ){               
        KTeam.insert( { "name":"Carlos Moure"      , "description":"Nuestro Yoda, Partner de Kairós", "image":"img/team/6.jpg", "twitter_link":"https://twitter.com/",            "twitter":"@"             });
        KTeam.insert( { "name":"Elisa Colina"      , "description":"La administradora de talentos princesa Eli",                              "image":"img/team/9.jpg", "twitter_link":"https://twitter.com/",            "twitter":"@"             });
        KTeam.insert( { "name":"Reinaldo Aguilera" , "description":"El Lando Calrissian que organiza batallas contra el lado oscuro",                               "image":"img/team/8.jpg", "twitter_link":"https://twitter.com/",            "twitter":"@"             });
        KTeam.insert( { "name":"Juan Caja"         , "description":"EL Scrum Master Obi-Juan Kenobi",                        "image":"img/team/4.jpg", "twitter_link":"https://twitter.com/frapen",            "twitter":"@frapen"             });
        KTeam.insert( { "name":"Jorge del Casar"   , "description":"Luke FrontEnd-Walker, the fucking master",                         "image":"img/team/1.png", "twitter_link":"https://twitter.com/JorgeCasar",  "twitter":"@JorgeCasar"   });
        KTeam.insert( { "name":"Álvaro Isorna"     , "description":"Nuestro Han Solo, lo mismo pilota un desarollo que gestiona un contrabando de proyectos",                                   "image":"img/team/2.jpg", "twitter_link":"https://twitter.com/isorna",      "twitter":"@isorna"       });
        KTeam.insert( { "name":"Mánu Fosela"       , "description":"Chewbacca, el copiloto-developer",                             "image":"img/team/3.jpg", "twitter_link":"https://twitter.com/manufosela",  "twitter":"@manufosela"   });
        KTeam.insert( { "name":"Kus Cámara"        , "description":"R2-D-Kus, el CSS no tiene secretos para ella ",                            "image":"img/team/5.jpg", "twitter_link":"https://twitter.com/",            "twitter":"@"             });
        KTeam.insert( { "name":"Fer"               , "description":"Fer3-PO, habla todas las lenguas mobile",                         "image":"img/team/7.jpg", "twitter_link":"https://twitter.com/",            "twitter":"@"             });
        console.log( "KTeam inserted" );
    } else {
        console.log( "KTeam exists" );
    }

    if ( !Tests.find().fetch().length ) {
        Tests.insert( { "type":"Javascript Front-End Developer", "img":"img/js.svg", "description":"¿Eres un front-end developer?. ¿Te gusta node? ¿Javascript te pone? ¿Te molan los web components y Polymer? Estos son tus tests.", "tests":[{ "title":"Javascript para Padawans", "name": "javascript1", "QRand":false, "ARand":false, "parent":{} }, { "title":"Javascript para Jedis", "name": "javascript2", "QRand":false, "ARand":false, "parent":{} }, { "title":"Polymer", "name": "polymer", "QRand":false, "ARand":false, "parent":{} } ] } );
        Tests.insert( { "type":"Quality Architect", "img":"img/qa.svg", "description":"Si tu perfil es de alguien que sabe de arquitectura tecnológica, de metodologías ágiles, cuidas la calidad, se preocupa por la integración continua, sigue los principios SOLID... estos son tus tests", "tests":[ { "title":"Arquitecto", "name": "Arquitecto", "QRand":false, "ARand":false, "parent":{} } , { "type":"Testing", "title":"Testing", "name": "Testing", "QRand":false, "ARand":false, "parent":{} } ] } );
        Tests.insert( { "type":"Friki", "img":"img/friki.svg", "description":"¿Quieres subir nota? ¿Eres un friki y te mola demostrarlo? Este test es para completar alguno de los otros dos. Son preguntas con un cierto toque diferente. ¿Te atreves? ;)", "tests": [ { "title":"Eres un friki de la Programación?", "name": "friki", "QRand":false, "ARand":false, "parent":{} } ] } );
        /*
        //db.tests.insert( { "type":"Quality Architect", "img":"img/qa.svg", "description":"Si tu perfil es de alguien que sabe de arquitectura tecnológica, de metodologías ágiles, cuidas la calidad, se preocupa por la integración continua, sigue los principios SOLID... estos son tus tests", "tests":[ { "title":"Programación", "name": "q-adopter1", "QRand":false, "ARand":false, "parent":{} } , { "type":"Quality Architect", "title":"Testing", "name": "q-adopter2", "QRand":false, "ARand":false, "parent":{} } , { "type":"Quality Architect", "title":"Metodología Agiles", "name": "q-adopter3", "QRand":false, "ARand":false, "parent":{} } ] } )

        db.tests.insert( { "type":"Javascript Front-End Developer", "img":"img/js.svg", "description":"¿Eres un front-end developer?. ¿Te gusta node? ¿Javascript te pone? ¿Te molan lo web components y Polymer? Estos son tus tests.", "tests":[{ "title":"Javascript para Padawans", "name": "javascript1", "QRand":false, "ARand":false, "parent":{} }, { "title":"Javascript para Jedis", "name": "javascript2", "QRand":false, "ARand":false, "parent":{} }, { "title":"Polymer", "name": "polymer", "QRand":false, "ARand":false, "parent":{} } ] } )
        db.tests.insert( { "type":"Quality Architect", "img":"img/qa.svg", "description":"Si tu perfil es de alguien que sabe de arquitectura tecnológica, de metodologías ágiles, cuidas la calidad, se preocupa por la integración continua, sigue los principios SOLID... estos son tus tests", "tests":[ { "title":"Arquitecto", "name": "Arquitecto", "QRand":false, "ARand":true, "parent":{} },{ "title":"Testing", "name": "Testing", "QRand":false, "ARand":true, "parent":{} } ] } )
        db.tests.insert( { "type":"Friki", "img":"img/friki.svg", "description":"¿Quieres subir nota? ¿Eres un friki y te mola demostrarlo? Este test es para completar alguno de los otros dos. Son preguntas con un cierto toque diferente. ¿Te atreves? ;)", "tests": [ { "title":"Eres un friki de la Programación?", "name": "friki", "QRand":false, "ARand":false, "parent":{} } ] } )
        */
        console.log( "Tests inserted" );
    } else {
        console.log( "Tests exists" );
    }
});