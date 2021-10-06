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
    author: Author!
    id: ID!
    genres: [String!]!
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
      author: ID!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, born: Int!): Author
  }
`;

module.exports = typeDefs;
