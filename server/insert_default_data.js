Meteor.startup(function () {
    if ( !Kuestions.find().fetch().length ) {
        Kuestions.insert( { "test":"javascript", "question": "¿pregunta numero uno?", "codeExample": "", "answers": [ { "text": "respuesta numero 1", "value": 0 }, { "text": "respuesta numero 2", "value": 0 }, { "text": "respuesta numero 3", "value": 1 } ] }); 
        Kuestions.insert( { "test":"q-adopter", "question": "¿pregunta numero dos?", "codeExample": "function codigoEjemplo() { console.log('hola mundo'); }", "answers": [ { "text": "respuesta numero 1", "value": 2 }, { "text": "respuesta numero 2", "value": 0 }, { "text": "respuesta numero 3", "value": 1 } ] });         console.log( "inserted " + Kuestions.find({}).fetch().length + " questions" );
        Kuestions.insert( { "test":"friki", "question": "¿pregunta numero tres?", "codeExample": "", "answers": [ { "text": "respuesta numero 1", "value": 1 }, { "text": "respuesta numero 2", "value": 0 }, { "text": "respuesta numero 3", "value": 1 } ] }); 
        Results._ensureIndex({ "user": 1}); // mongo: db.results.createIndex({user:1})
        console.log( "Kuestions inserted" );
    } else {
        console.log( "db exists" );
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
        console.log( "team exists" );
    }
});