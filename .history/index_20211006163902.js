const { ApolloServer, gql } = require('apollo-server');
let authors = require('./db/authors');
let books = require('./db/books');
const resolvers = require('./GQL/resolvers');
const typeDefs = require('./GQL/typeDefs');
const Book = require('./DBSchema/bookSchema');
const Author = require('./DBSchema/authorSchema');
const mongoose = require('mongoose');
require('dotenv').config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  dataSources: (Book, Author) => ({
    Book,
    Author,
  }),
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
