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
        return await Book.find({ author: args.author });
      }
      if (!args.authorName) {
        return await Book.find({ genre: args.genre });
      }
      return await Book.find({
        author: args.author,
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

      return Book.find({ author: parent.id });
    },
  },
  Mutation: {
    editAuthor: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      return await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.born }
      );
    },

    addBook: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      const found = await Author.findOne({ name: args.authorName });

      console.log(found);
      if (!found) {
        found = await new Author({
          name: args.authorName,
        }).save();
      }

      const newBook = new Book({
        title: args.title,
        published: args.published,
        authorName: found.id,
        genres: args.genres,
      });

      const added = await newBook.save();
      console.log(added);
      return added;
    },
  },
};

module.exports = resolvers;
