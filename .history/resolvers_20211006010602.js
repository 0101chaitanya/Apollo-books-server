const resolvers = {
  Query: {
    bookCount: (parent, args, { books, authors }) => {
      if (args.name) {
        return books.filter((book) => book.authorName === args.name).length;
      }
      return books.length;
    },
    authorCount: (parent, args, { books, authors }) => authors.length,
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
    allAuthors: (parent, args, { books, authors }) => {
      console.log(authors);
      return authors;
    },
  },
  Book: {
    authorDetails: (parent, args, { books, authors }) => {
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

      //books = books.filter((book) => book.authorName === author.name);
      console.log(typeof args.born);
      if (!author) {
        return null;
      }

      const newauthor = {
        ...author,
        //books,
        born: args.born,
      };

      authors = [...authors.map((a) => (a.name === args.name ? newauthor : a))];
      console.log(authors);

      return (author = authors.find((a) => a.name === args.name));
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
      console.log(newBook);
      return newBook;
    },
  },
};

module.exports = resolvers;
