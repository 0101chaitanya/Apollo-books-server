const { v4: uuidv4 } = require('uuid');

const resolvers = {
  Query: {
    book: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      return await Book.find({ name: args.name });
    },
    bookCount: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      if (args.name) {
        return await Book.find({ authorName: args.name }).length;
      }
      return await Book.count({});
    },
    authorCount: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      return Author.count({});
    },
    allBooks: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      if (!args.authorName && !args.genre) {
        return await Book.find({});
      }

      if (!args.genre) {
        return await Book.find({ authorName: args.authorName });
      }
      if (!args.authorName) {
        return await Book.find({
          authorName: args.authorName,
          genre: args.genre,
        });
      }
      return await Book.find({ genre: args.genre });
    },
    allAuthors: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      return authors;
    },
  },
  Book: {
    authorDetails: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      return authors.find((author) => author.name === parent.authorName);
    },
  },
  Author: {
    books: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      return books.filter((book) => book.authorName === parent.name);
    },
  },
  Mutation: {
    editAuthor: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;
      let authorIndex = authors.findIndex((a) => a.name === args.name);
      //books = books.filter((book) => book.authorName === author.name);
      if (authorIndex < 0) {
        return null;
      }

      authors.splice(authorIndex, 1, {
        ...authors[authorIndex],
        born: args.born,
      });
      let found = authors.find((a) => a.name === args.name);

      console.log(authorIndex, found);

      return found;
    },

    addBook: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

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

      books.push(newBook);
      console.log(newBook);
      return newBook;
    },
  },
};

module.exports = resolvers;
