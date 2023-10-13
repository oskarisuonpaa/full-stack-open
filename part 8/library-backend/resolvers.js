const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const Book = require("./models/Book");
const Author = require("./models/Author");
const User = require("./models/User");
const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => await Book.find({}).countDocuments(),
    authorCount: async () => await Author.find({}).countDocuments(),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author });
        return await Book.find({ author: author._id, genres: args.genre });
      } else if (args.author) {
        const author = await Author.findOne({ name: args.author });
        return await Book.find({ author: author._id });
      } else if (args.genre) {
        return await Book.find({ genres: args.genre });
      }
      return await Book.find({});
    },
    allAuthors: async () => await Author.find({}),
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        try {
          author = await Author.create({ name: args.author });
        } catch (error) {
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.author,
              error: "author's name must be atleast four characters long",
            },
          });
        }
      }

      try {
        const book = await Book.create({
          ...args,
          author: author._id,
        });

        pubsub.publish("BOOK_ADDED", { bookAdded: book });

        author.books.push(book._id);
        await author.save();

        return book;
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error: "title must be atleast five characters long",
          },
        });
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      return await Author.findOneAndUpdate(
        { name: args.name },
        { born: args.setBornTo },
        { new: true }
      );
    },
    createUser: async (root, { username, favoriteGenre }) => {
      try {
        return await User.create({ username, favoriteGenre });
      } catch (error) {
        throw new GraphQLError("Saving author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: username,
            error: "username must be atleast three characters long",
          },
        });
      }
    },
    login: async (root, { username, password }) => {
      const user = await User.findOne({ username });

      if (!user || password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
  Book: {
    title: ({ title }) => title,
    published: ({ published }) => published,
    author: async ({ author }) => await Author.findById(author),
    id: ({ id }) => id,
    genres: ({ genres }) => genres,
  },
  Author: {
    name: ({ name }) => name,
    born: ({ born }) => born,
    id: ({ id }) => id,
    bookCount: async ({ books }) => books.length,
  },
};

module.exports = resolvers;
