const { v4: uuidv4 } = require('uuid');

const resolvers = {
  Query: {
    bookCount: (parent, args, { dataSources }) => {
      let { authors, books } = dataSources;

      if (args.name) {
        return books.filter((book) => book.authorName === args.name).length;
      }
      return books.length;
    },
    authorCount: (parent, args, { dataSources }) => {
      let { authors, books } = dataSources;

      return authors.length;
    },
    allBooks: (parent, args, { dataSources }) => {
      let { authors, books } = dataSources;

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
    allAuthors: (parent, args, { dataSources }) => {
      let { authors, books } = dataSources;

      return authors;
    },
  },
  Book: {
    authorDetails: (parent, args, { dataSources }) => {
      let { authors, books } = dataSources;

      return authors.find((author) => author.name === parent.authorName);
    },
  },
  Author: {
    books: (parent, args, { dataSources }) => {
      let { authors, books } = dataSources;

      return books.filter((book) => book.authorName === parent.name);
    },
  },
  Mutation: {
    editAuthor: (parent, args, { dataSources }) => {
      let { authors, books } = dataSources;
      let author = authors.find((a) => a.name === args.name);
      //books = books.filter((book) => book.authorName === author.name);
      if (!author) {
        return null;
      }

      const newauthor = {
        ...author,
        //books,
        born: args.born,
      };

      dataSources.authors = [
        ...authors.map((a) => (a.name === args.name ? newauthor : a)),
      ];

      return authors.find((a) => a.name === args.name);
    },

    addBook: (parent, args, { dataSources }) => {
      let { authors, books } = dataSources;

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

module.exports = resolvers;
