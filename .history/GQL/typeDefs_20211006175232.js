const { gql } = require('apollo-server');

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
    authorName: String!
    id: ID!
    genres: [String!]!
    authorDetails: Author
  }

  type Query {
    bookCount(name: String): Int!
    authorCount: Int!
    allBooks(authorName: String, genre: String): [Book]!
    allAuthors: [Author]!
    book(name: String!): Book
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      authorName: String!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, born: Int!): Author
  }
`;

module.exports = typeDefs;
