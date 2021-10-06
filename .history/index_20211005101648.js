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
    bookCount: Int!
    authorCount: Int!
    allBooks(authorName: String, genre: String): [Book]!
    allAuthors: [Author]!
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

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (parent, args, { books, authors }) => {
      if (!args.authorName && !args.genre) {
        return books;
      }

      if (!args.genre) {
        return books.filter((book) => book.authorName === args.authorName);
      }
      if (!args.authorName) {
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
    authorDetails: (parent, args, context) => {
      return authors.find((author) => author.name === parent.authorName);
    },
  },
  Author: {
    books: (parent, args, { authors, books }) => {
      return books.filter((book) => book.authorName === parent.name);
    },
  },
  Mutation: {
    editAuthor: (parent, args, { authors, books }) => {
      let author = authors.find((a) => a.name === args.name);
      
      if()
      
      console.log(author);
      author = {
        ...author,
        born: args.born,
      };

      authors.map((a) => (a.name === args.name ? author : a));

      return author;
    },

    addBook: (parent, args, { authors, books }) => {
      const found = authors.find((author) => author.name === args.authorName);

      if (!found) {
        authors.push({ name: args.authorName, id: uuidv4() });
      }

      const newBook = {
        title: args.title,
        published: args.published,
        authorName: args.authorName,
        id: uuidv4(),
        genres: args.genres,
      };

      books.concat(newBook);

      return newBook;
    },
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
