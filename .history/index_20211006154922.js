const { ApolloServer, gql } = require('apollo-server');
let authors = require('./db/authors');
let books = require('./db/books');
const resolvers = require('./resolvers');
const typeDefs = require('./GQL/typeDefs');
const Book = require('./DBSchema/bookSchema');
const Author = require('./DBSchema/authorSchema');
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    authors,
    books,
  }),
});
const url = 'http://localhost:4000';

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
