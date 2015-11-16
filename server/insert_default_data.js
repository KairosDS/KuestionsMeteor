Meteor.startup(function () {
    if ( !Kuestions.find().fetch().length ) {
        Kuestions.insert( { "question": "¿pregunta numero uno?", "codeExample": "", "answers": [ { "text": "respuesta numero 1", "value": 0 }, { "text": "respuesta numero 2", "value": 0 }, { "text": "respuesta numero 3", "value": 1 } ] }); 
        Kuestions.insert( { "question": "¿pregunta numero dos?", "codeExample": "function codigoEjemplo() { console.log('hola mundo'); }", "answers": [ { "text": "respuesta numero 1", "value": 2 }, { "text": "respuesta numero 2", "value": 0 }, { "text": "respuesta numero 3", "value": 1 } ] });         console.log( "inserted " + Kuestions.find({}).fetch().length + " questions" );
        Kuestions.insert( { "question": "¿pregunta numero tres?", "codeExample": "", "answers": [ { "text": "respuesta numero 1", "value": 1 }, { "text": "respuesta numero 2", "value": 0 }, { "text": "respuesta numero 3", "value": 1 } ] }); 
    } else {
        console.log( "db exists" );
    }
});    