const { v4: uuidv4 } = require('uuid');

const resolvers = {
  Query: {
    book: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      return await Book.find({ name: args.name });
    },
    bookCount: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      if (args.author) {
        return await Book.count({ author: args.author });
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
    author: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      return await Author.find({ id: parent.author });
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

      console.log(found);
      if (!found) {
        const author = await new Author({
          name: args.authorName,
        });
        author.save();
      }

      const newBook = new Book({
        title: args.title,
        published: args.published,
        authorName: args.authorName,
        genres: args.genres,
      });

      const added = await newBook.save();
      console.log(added);
      return added;
    },
  },
};

module.exports = resolvers;
