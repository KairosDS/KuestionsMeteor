Meteor.startup(function () {
    if ( !KTeam.find().fetch().length ){               
        KTeam.insert( { "name": "Carlos Moure"      , "description": "Nuestro Yoda, Partner de Kairós", "image": "img/team/6.jpg", "twitter_link":"https://twitter.com/", "twitter":"@" });
        KTeam.insert( { "name": "Elisa Colina"      , "description": "La administradora de talentos princesa Eli", "image":"img/team/9.jpg", "twitter_link":"https://twitter.com/", "twitter":"@" });
        KTeam.insert( { "name": "Reinaldo Aguilera" , "description": "El Lando Calrissian que organiza batallas contra el lado oscuro", "image":"img/team/8.jpg", "twitter_link":"https://twitter.com/", "twitter":"@" });
        KTeam.insert( { "name": "Juan Caja"         , "description": "El Scrum Master Obi-Juan Kenobi", "image":"img/team/4.jpg", "twitter_link":"https://twitter.com/frapen", "twitter":"@frapen" });
        KTeam.insert( { "name": "Jorge del Casar"   , "description": "Luke FrontEnd-Walker, the fucking master", "image":"img/team/1.png", "twitter_link":"https://twitter.com/JorgeCasar", "twitter":"@JorgeCasar" });
        KTeam.insert( { "name": "Álvaro Isorna"     , "description": "Nuestro Han Solo, lo mismo pilota una interfaz de usuario que gestiona un contrabando de proyectos", "image":"img/team/2.jpg", "twitter_link":"https://twitter.com/isorna", "twitter":"@isorna" });
        KTeam.insert( { "name": "Mánu Fosela"       , "description": "Chewbacca, el copiloto-developer", "image":"img/team/3.jpg", "twitter_link":"https://twitter.com/manufosela",  "twitter":"@manufosela" });
        KTeam.insert( { "name": "Fer"               , "description": "Fer3-PO, habla todas las lenguas mobile", "image":"img/team/7.jpg", "twitter_link":"https://twitter.com/", "twitter":"@" });
        console.log( "KTeam inserted" );
    } else {
        console.log( "KTeam exists" );
    }

    if (!TestsGroup.find().fetch().length) {
        TestGroup.insert({});
        TestsGroup.insert({ "lang" : "es", "testgroup" : "javascript", "name" : "js", "img" : "img/js.svg", "description" : "¿Eres un front-end developer?. ¿Te gusta node? ¿Javascript te pone? ¿Te molan lo web components y Polymer? Estos son tus tests." });
        TestsGroup.insert({ "lang" : "es", "testgroup" : "friki", "name" : "fk", "img" : "img/friki.svg", "description" : "¿Quieres subir nota? ¿Eres un friki y te mola demostrarlo? Este test es para completar alguno de los otros dos. Son preguntas con un cierto toque diferente. ¿Te atreves? ;)" });
        TestsGroup.insert({ "lang" : "es", "testgroup" : "java", "name" : "java", "img" : "img/java.png", "description" : "Con Java empecé y con Java terminaré, aunque entre medias me pongan otros retos yo controlo de Backend en Java. Así que te lo demostraré en mi test" });
        TestsGroup.insert({ "lang" : "es", "testgroup" : "arquitecto", "name" : "qa", "img" : "img/qa.svg", "description" : "Si tu perfil es de alguien que sabe de arquitectura tecnológica, de metodologías ágiles, cuidas la calidad, se preocupa por la integración continua, sigue los principios SOLID... estos son tus tests" });
        TestsGroup.insert({ "lang" : "es", "testgroup" : "design", "name" : "hc", "img" : "img/design.svg", "description" : "¿Eres un apasionado del diseño web? ¿Responsive y Adaptative es tu obsesion? ¿CSS3 no tiene secretos para ti? ¿HTML5 y tú sois uno? ¡Este es tu test!" });
        TestsGroup.insert({ "lang" : "en", "testgroup" : "javascript", "name" : "js", "img" : "img/js.svg", "description" : "Are you a front-end developer ?. Do you like node? You love Javascript? Do you get web components and Polymer? These are your tests." });

        /*TestGroup.insert({ "group": "javascript", "short": "js", "name":"Javascript Front-End Developer", "img":"img/js.svg", "description":"¿Eres un front-end developer?. ¿Te gusta node? ¿Javascript te pone? ¿Te molan los web components y Polymer? Estos son tus tests." });
        TestGroup.insert({ "group": "java", "short":"java", "name":"Java Back-End Developer", "img" : "img/java.png", "description" : "Con Java empecé y con Java terminaré, aunque entre medias me pongan otros retos yo controlo de Backend en Java. Así que te lo demostraré en mi test" });
        TestGroup.insert({ "group": "architecture", "short":"qa", "name": "Quality Architect", "img" : "img/qa.svg", "description" : "Si tu perfil es de alguien que sabe de arquitectura tecnológica, de metodologías ágiles, cuidas la calidad, se preocupa por la integración continua, sigue los principios SOLID... estos son tus tests" });
        TestGroup.insert({ "group": "design", "short":"hc", "name": "HTML/CSS", "img" : "img/design.svg", "description" : "¿Eres un apasionado del diseño web? ¿Responsive y Adaptative es tu obsesion? ¿CSS3 no tiene secretos para ti? ¿HTML5 y tú sois uno? ¡Este es tu test!" });
        TestGroup.insert({ "group": "friki", "short":"fk", "name": "Friki", "img" : "img/friki.svg", "description" : "¿Quieres subir nota? ¿Eres un friki y te mola demostrarlo? Este test es para completar alguno de los otros dos. Son preguntas con un cierto toque diferente. ¿Te atreves? ;)" });
        */        
        console.log( "Tests Group inserted" );
    } else {
        console.log("TestGroup exists");
    }

    if ( !Tests.find().fetch().length ) {
        Tests.insert( { "testsgroup": "javascript", "lang":"es", "title": "Javascript para Padawans", "name": "javascript1", "QRand":false, "ARand":false, "group":"javascript", "percent":30, "timebyquestion": 0 } );
        Tests.insert( { "testsgroup": "javascript", "lang":"es", "title": "Javascript para Jedis", "name": "javascript2", "QRand":false, "ARand":false, "group":"javascript", "percent":50, "timebyquestion": 0 });
        Tests.insert( { "testsgroup": "javascript", "lang":"es", "title": "Javascript para Yoda", "name": "javascript3", "QRand":false, "ARand":false, "group":"javascript", "percent":15, "timebyquestion": 0 });
        Tests.insert( { "testsgroup": "javascript", "lang":"es", "title": "Polymer", "name": "polymer", "QRand":false, "ARand":false, "group":"javascript", "percent":5, "timebyquestion": 0 } );
        Tests.insert( { "testsgroup": "arquitecto", "lang":"es", "title": "Arquitecto", "name": "Arquitecto", "QRand":false, "ARand":false, "group":"architecture", "percent":100, "timebyquestion": 0 });
        Tests.insert( { "testsgroup": "arquitecto", "lang":"es", "title": "Testing", "name": "Testing", "QRand":false, "ARand":false, "group":"architecture", "percent":"", "timebyquestion": 0 });
        Tests.insert( { "testsgroup": "friki", "lang":"es", "title": "¿Eres un friki de la web?", "name": "friki", "QRand":false, "ARand":false, "group":"friki", "percent":100, "timebyquestion": 0 });
        Tests.insert( {	"testsgroup": "java", "lang":"es", "title": "Java", "name": "java1", "QRand": false, "ARand": false, "group":"java", "percent":100, "timebyquestion": 0 });    
        Tests.insert( { "testsgroup": "design", "lang":"es", "title": "HTML/CSS", "name": "design", "QRand": false, "ARand": false, "group":"design", "percent":100, "timebyquestion": 0 });
        Tests.insert( { "testsgroup": "javascript", "lang":"en", "title": "Javascript for Padawans", "name": "javascript1", "QRand":false, "ARand":false, "group":"javascript", "percent":35, "timebyquestion": 0 } );
        Tests.insert( { "testsgroup": "javascript", "lang":"en", "title": "Javascript for Jedis", "name": "javascript2", "QRand":false, "ARand":false, "group":"javascript", "percent":60, "timebyquestion": 0 });
        Tests.insert( { "testsgroup": "javascript", "lang":"es", "title": "Polymer", "name": "polymer", "QRand":false, "ARand":false, "group":"javascript", "percent":5, "timebyquestion": 0 } );
        
        console.log( "Tests inserted" );
    } else {
        console.log( "Tests exists" );
    }

    if ( !Kuestions.find().fetch().length ) {
        Kuestions.insert( { "test": "javascript1", "lang": "es", "question": "¿pregunta numero uno?", "codeExample": "", "answers": [ { "text": "respuesta numero 1", "value": 0 }, { "text": "respuesta numero 2", "value": 0 }, { "text": "respuesta numero 3", "value": 1 } ] }); 
        Kuestions.insert( { "test": "javascript2", "lang": "es", "question": "¿pregunta numero uno?", "codeExample": "", "answers": [ { "text": "respuesta numero 1", "value": 0 }, { "text": "respuesta numero 2", "value": 0 }, { "text": "respuesta numero 3", "value": 1 } ] }); 
        Kuestions.insert( { "test": "javascript3", "lang": "es", "question": "¿pregunta numero uno?", "codeExample": "", "answers": [ { "text": "respuesta numero 1", "value": 0 }, { "text": "respuesta numero 2", "value": 0 }, { "text": "respuesta numero 3", "value": 1 } ] }); 
        Kuestions.insert( { "test": "polymer", "lang": "es", "question": "¿pregunta numero uno?", "codeExample": "", "answers": [ { "text": "respuesta numero 1", "value": 0 }, { "text": "respuesta numero 2", "value": 0 }, { "text": "respuesta numero 3", "value": 1 } ] }); 
        
        Kuestions.insert( { "test": "Arquitecto", "lang": "es", "question": "¿pregunta numero dos?", "codeExample": "function codigoEjemplo() { console.log('hola mundo'); }", "answers": [ { "text": "respuesta numero 1", "value": 2 }, { "text": "respuesta numero 2", "value": 0 }, { "text": "respuesta numero 3", "value": 1 } ] });
        Kuestions.insert( { "test": "Testing", "lang": "es", "question": "¿pregunta numero dos?", "codeExample": "", "answers": [ { "text": "respuesta numero 1", "value": 2 }, { "text": "respuesta numero 2", "value": 0 }, { "text": "respuesta numero 3", "value": 1 } ] });

        Kuestions.insert( { "test": "friki", "lang": "es", "question": "¿pregunta numero tres?", "codeExample": "", "answers": [ { "text": "respuesta numero 1", "value": 1 }, { "text": "respuesta numero 2", "value": 0 }, { "text": "respuesta numero 3", "value": 1 } ] }); 
        
        Kuestions.insert( { "test": "java1", "lang": "es", "question": "¿pregunta numero java?", "codeExample" : "Codigo java de ejemplo", "answers": [{	"text": "repuesta uno", "value": 0 }, { "text": "respuesta dos", "value": 0 }, { "text": "respuesta tres", 	"value" : 0 }, { "text": "respuesta cuatro", "value": 1 } ] } );
        
        Kuestions.insert( { "test": "design", "lang": "es", "question": "Pregunta preguntosa", "codeExample" : "&lt;label&gt;&lt;input type='checkbox'&gt;&lt;span&gt;Opción 1&lt;/span&gt;&lt;span class='error'&gt;(error)&lt;/span&gt;&lt;/label&gt;", "answers" : [{ "text": "repuesta 1", "value": 1 }, { "text": "respuesta ocho", "value": 0}, {"text": "respuesta 42", "value": 0 } ] } );

        Kuestions.insert( { "test": "javascript1", "lang": "en", "question": "question number one?", "codeExample": "", "answers": [ { "text": "answer number one", "value": 0 }, { "text": "answer number two", "value": 0 }, { "text": "answer number tree", "value": 1 } ] }); 
        Kuestions.insert( { "test": "javascript2", "lang": "en", "question": "question number one?", "codeExample": "", "answers": [ { "text": "answer number one", "value": 0 }, { "text": "answer number two", "value": 0 }, { "text": "answer number tree", "value": 1 } ] }); 
        Kuestions.insert( { "test": "javascript3", "lang": "en", "question": "question number one?", "codeExample": "", "answers": [ { "text": "answer number one", "value": 0 }, { "text": "answer number two", "value": 0 }, { "text": "answer number tree", "value": 1 } ] }); 
        Kuestions.insert( { "test": "polymer", "lang": "en", "question": "question number one?", "codeExample": "", "answers": [ { "text": "answer number one", "value": 0 }, { "text": "answer number two", "value": 0 }, { "text": "answer number tree", "value": 1 } ] }); 
        
        Kuestions.insert( { "test": "Arquitecto", "lang": "en", "question": "question number one?", "codeExample": "function codigoEjemplo() { console.log('hola mundo'); }", "answers": [ { "text": "answer number one", "value": 2 }, { "text": "answer number two", "value": 0 }, { "text": "answer number tree", "value": 1 } ] });
        Kuestions.insert( { "test": "Testing", "lang": "en", "question": "question number one?", "codeExample": "", "answers": [ { "text": "answer number one", "value": 2 }, { "text": "answer number two", "value": 0 }, { "text": "answer number tree", "value": 1 } ] });

        Kuestions.insert( { "test": "friki", "lang": "en", "question": "question number one?", "codeExample": "", "answers": [ { "text": "answer number one", "value": 1 }, { "text": "answer number two", "value": 0 }, { "text": "answer number tree", "value": 1 } ] }); 
        
        Kuestions.insert( { "test": "java1", "lang": "en", "question": "question number one?", "codeExample" : "Codigo java de ejemplo", "answers": [{	"text": "answer number one", "value": 0 }, { "text": "answer number two", "value": 0 }, { "text": "answer number three", 	"value" : 0 }, { "text": "respuesta cuatro", "value": 1 } ] } );
        
        Kuestions.insert( { "test": "design", "lang": "en", "question": "Pregunta preguntosa", "codeExample" : "&lt;label&gt;&lt;input type='checkbox'&gt;&lt;span&gt;Opción 1&lt;/span&gt;&lt;span class='error'&gt;(error)&lt;/span&gt;&lt;/label&gt;", "answers" : [{ "text": "repuesta 1", "value": 1 }, { "text": "respuesta ocho", "value": 0}, {"text": "respuesta 42", "value": 0 } ] } );


        Results._ensureIndex({ "user": 1}); // mongo: db.results.createIndex({user:1})
        console.log( "inserted " + Kuestions.find({}).fetch().length + " questions" );
    } else {
        console.log( "Kuestions exists" );
    }
    
    if ( !Kcode.find({"name":"kairostest"}).fetch().length ) {
        if (!Kcode) {
            Kcode = new Meteor.Collection("kcode");
        }
        Kcode.insert({ "name":"kairostest", "volatile":false, "talento": "PRUEBA" });
        console.log( "kariostest kcode inserted" );
    } else {
        console.log("kairostest kcode exists");
    }

    if ( !Adminusers.find({}).fetch().length ) {
        if (!Adminusers) {
            Adminusers = new Meteor.Collection("adminusers");
        }
        Adminusers.insert({"name":"Mánu Fosela", "user":"manu.fosela"});
        Adminusers.insert({"name":"Elisa Colina", "user":"elisa.colina"});
        Adminusers.insert({"name":"Alicia Esteban", "user":"alicia.esteban"});
        Adminusers.insert({"name":"Lorena Mata", "user":"lorena.mata"});
        Adminusers.insert({"name":"Jorge del Casar", "user":"jorge.casar"});
        console.log("Default adminusers inserted");
        Adminusers = null;
    } else {
        console.log("Adminusers exists");
    }

});