const { v4: uuidv4 } = require('uuid');
const mongoId = require('apollo-server-mongo-id-scalar');
const { UserInputError } = require('apollo-server-errors');
const jwt = require('jsonwebtoken');
const resolvers = {
  Query: {
    book: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      return await Book.find({ name: args.name });
    },
    bookCount: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      if (args.author) {
        const author = await Author.find({ name: args.author });
        return await Book.count({ author: author.id });
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
        const author = await Author.find({ name: args.author });

        return await Book.find({ author: author.id });
      }
      if (!args.author) {
        return await Book.find({ genre: args.genre });
      }

      const author = await Author.find({ name: args.author });

      return await Book.find({
        author: author.id,
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
    authorDetails: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      return Author.find({ id: parent.author });
    },
  },
  Author: {
    books: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      return Book.find({ author: parent.id });
    },
  },
  Mutation: {
    createUser: async (parent, args, { dataSources }) => {
      let { Book, Author, User } = dataSources;

      const user = new User({ username: args.username });
      try {
        return await user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    login: async (parent, args, { dataSources }) => {
      let { Book, Author, User } = dataSources;

      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== process.env.SECRET) {
        throw new UserInputError('wrong credentials');
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    editAuthor: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;
      try {
        return await Author.findOneAndUpdate(
          { name: args.name },
          { born: args.born },
          {
            new: true,
          }
        );
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },

    addBook: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      try {
        let found = await Author.findOne({ name: args.author });

        console.log(found);
        if (!found) {
          found = await new Author({
            name: args.author,
          }).save();
        }

        const newBook = new Book({
          title: args.title,
          published: args.published,
          author: found.id,
          genres: args.genres,
        });

        const added = await newBook.save();
        return added;
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
  },
};

module.exports = { resolvers, MONGOID: mongoId };
