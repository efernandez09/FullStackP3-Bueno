const mongoose = require('mongoose');
const express = require('express');

// Importamos apollo server (Importamos los typeDefs y los resolvers)
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('../FullStackP2/src/graphql/typeDefs');
const resolvers = require('../FullStackP2/src/graphql/resolvers');


// Cadena de conexión
const uri = 'mongodb+srv://admin:1234@cluster0.amvowh2.mongodb.net/weektasks';

// Opciones de configuración de la conexión
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

// ! Conexión a la base de datos
mongoose.connect(uri, options);

// Obtener la instancia de la conexión
const db = mongoose.connection;

// Manejar eventos de la conexión
db.on('error', console.error.bind(console, 'Error de conexión:'));
db.once('open', function() {
  console.log("Conexión exitosa a la base de datos");
  // hacer algo con la base de datos
});

// Funcion para iniciar el servidor Apollo-Express
async function startServer() {
  
  const app = express();

  // Declaraciones app.use EN CASO DE NO FUNCIONAR PROBAR A DECLARAR DESPUES DEL MIDDELWARE DE APOLLO
  
  // Cors
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

 
  app.use(express.static('public'));


  const server = new ApolloServer({typeDefs, resolvers});

  // Se debe declarar esta funcion asíncrona para evitar que el middelware
  // que une apollo con express se aplique antes de que se inicie el servicio y cause errores
  await server.start();

  // Unimos apollo server a la aplicacion de express
  server.applyMiddleware({app});
  
  // Definimos el pueto predeterminado y lo que se ejecutara cuando se inicie el servidor.
  app.listen(3000, function() {
    console.log('🚀 Frontend client corriendo en http://localhost:3000 🚀 ')
    console.log(`🚀 Servidor de apollo en http://localhost:3000${server.graphqlPath} 🚀`)
  });
}

// Iniciamos el servidor
startServer();
