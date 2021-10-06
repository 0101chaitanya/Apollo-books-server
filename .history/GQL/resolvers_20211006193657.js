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
        return await Book.find({ genre: args.genre });
      }
      return await Book.find({
        authorName: args.authorName,
        genre: args.genre,
      });
    },
    allAuthors: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      return await Author.find({});
    },
  },
  Book: {
    authorDetails: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      return await Author.find({ name: parent.authorName });
    },
  },
  Author: {
    books: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      return Book.find({ authorName: parent.name });
    },
  },
  Mutation: {
    editAuthor: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      return await Book.findOneAndUpdate(
        { name: args.name },
        { born: args.born }
      );
    },

    addBook: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      const found = await Author.findOne({ name: args.authorName });

      if (!found) {
        await new Author({
          name: args.authorName,
        }).save();
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
