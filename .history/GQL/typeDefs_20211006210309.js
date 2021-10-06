const { gql } = require('apollo-server');
const { MONGOID } = require('./resolvers');
const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
    books: [Book]
  }
  type Book {
    title: String!
    published: Int!
    author: MONGOID!
    id: ID!
    genres: [String!]!
    authorDetails: [Author]!
  }

  type Query {
    bookCount(author: String): Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
    book(name: String!): Book
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, born: Int!): Author
  }
`;

module.exports = typeDefs;
