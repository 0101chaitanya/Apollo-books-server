const { ApolloServer, gql } = require('apollo-server');
const authors = require('./db/authors');
const books = require('./db/books');

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's name in the context of the book instead of the author's id
 * However, for simplicity, we will store the author's name in connection with the book
 */

const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
  }
  type Book {
    title: String!
    published: Int!
    author: String!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
  }
`;

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const url = 'http://localhost:4000';

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
