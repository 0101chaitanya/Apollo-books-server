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
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
  }
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
        return books.filter((book) => book.author === args.author);
      }
      if (!args.author) {
        return books.filter((book) => book.genres.includes(args.genre));
      }
      return books
        .filter((book) => book.author === args.author)
        .filter((book) => {
          console.log(book.genres, args.genre);
          return book.genres.includes(args.genre);
        });
    },
    allAuthors: () => authors,
  },
  Author: {
    books: (parent, args, context) => {
      return books.filter((book) => book.author === parent.name);
    },
  },
  Book: {
    author: (parent, args, context) => {
      return authors.find((author) => author.name === parent.author);
    },
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
