const { v4: uuidv4 } = require('uuid');
const mongoId = require('apollo-server-mongo-id-scalar');
const { UserInputError, AuthenticationError } = require('apollo-server-errors');
const jwt = require('jsonwebtoken');
const resolvers = {
  Query: {
    allGenre: async (parent, args, { dataSources, currentUser }) => {
      let { Book, Author } = dataSources;

      const Books = await Book.find({});
      let genre = [];

      Books.forEach((book) => {
        book.genres.forEach((item) => {
          if (!genre.includes(item)) {
            genre = [...genre, item];
          }
        });
      });
      return genre;
    },

    me: async (parent, args, { dataSources, currentUser }) => {
      let { Book, Author } = dataSources;

      return currentUser;
    },
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
    allBooks: async (parent, args, { currentUser, dataSources }) => {
      let { Book, Author } = dataSources;

      /* if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }
 */ console.log(args);

      if (!args.authorName && !args.genre) {
        return await Book.find({});
      }

      if (!args.genre) {
        const author = await Author.findOne({ name: args.author });

        return await Book.find({ author: author.id });
      }

      if (!args.author) {
        console.log('hi');
        const genre = args.genre;
        let fou = await Book.find({});

        let res = fou.filter((item) => item.include(args.genre));
        console.log(res);
        return res;
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
      let author = await Author.findById(parent.author.toString());
      return author.id;
    },
    authorDetails: async (parent, args, { dataSources }) => {
      let { Book, Author } = dataSources;

      let author = await Author.findById(parent.author.toString());
      return author;
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
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
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
    editAuthor: async (parent, args, { currentUser, dataSources }) => {
      let { Book, Author } = dataSources;
      if (!currentUser) {
        throw new AuthenticationError('not authenticated');
      }

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

    addBook: async (parent, args, { currentUser, dataSources }) => {
      let { Book, Author } = dataSources;

      if (!currentUser) {
        console.log('ohe hoe');
        throw new AuthenticationError('not authenticated');
      }
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
        console.log(added);
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
