const { ApolloServer, gql } = require('apollo-server');
const authors = require('./db/authors');
const books = require('./db/books');
const { v4: uuidv4 } = require('uuid');

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
    books :[Book]
  }
  type Book {
    title: String!
    published: Int!
    authorName: String!
    authorDetails: Author
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      authorName: String!
      genres: [String!]!
    ): Book
`;

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (parent, args, context) => {
      if (!args.author && !args.genre) {
        return books;
      }

      if (!args.genre) {
        return books.filter((book) => book.authorName === args.authorName);
      }
      if (!args.author) {
        return books.filter((book) => book.genres.includes(args.genre));
      }
      return books
        .filter((book) => book.authorName === args.authorName)
        .filter((book) => {
          return book.genres.includes(args.genre);
        });
    },
    allAuthors: () => authors,
  },
  Book: {
    author: (parent, args, context) => {
      return authors.find((author) => author.name === parent.authorName);
    },
  },
  Mutation: {
    addBook: (parent, args, { authors, books }) => {},
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    authors,
    books,
  },
});
const url = 'http://localhost:4000';

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
