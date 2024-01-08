const database = require("../models");

const { createOneUserData } = require("../util/validatorData");

const User = database.User;
const Book = database.Book;
const LibraryTransaction = database.LibraryTransaction;

//get all tthe user
exports.getAllUsers = async (req, res, next) => {
  try {
    // Using Sequelize's findAll method on the User model,we dont need to write the sql script
    const users = await User.findAll();

    const simplifiedUsersBody = users.map(({ id, name }) => ({ id, name }));

    const response = {
      response: [
        {
          name: "Getting user list with ids and names",
          originalRequest: {
            method: req.method,
            header: [],
            url: {
              raw: req.originalUrl,
              host: [req.hostname],
              port: req.app.get("port"),
              path: req.url.split("/").filter(Boolean),
            },
          },
          status: "OK",
          code: 200,
          _postman_previewlanguage: "json",
          header: null,
          cookie: [],
          body: JSON.stringify(simplifiedUsersBody),
        },
      ],
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

// get one User
exports.getOneUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: Book,
          as: "borrowedBooks",
          through: {
            model: LibraryTransaction,
            attributes: ["status", "score"],
          },
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "Kullanıcı Bulunamadı !" });
    }

    console.log("user", user);

    let userResponse;

    if (user.borrowedBooks && user.borrowedBooks.length > 0) {
      const presentBooks = user.borrowedBooks.filter(
        (book) => book.LibraryTransaction.status === "borrowed"
      );
      const pastBooks = user.borrowedBooks.filter(
        (book) => book.LibraryTransaction.status === "returned"
      );

      userResponse = {
        id: user.id,
        name: user.name,
        books: {
          past: pastBooks.map((book) => ({
            name: book.name,
            userScore: book.LibraryTransaction.score,
          })),
          present: presentBooks.map((book) => ({ name: book.name })),
        },
      };
    } else {
      userResponse = {
        id: user.id,
        name: user.name,
        books: {
          past: [],
          present: [],
        },
      };
    }

    //response tosend
    const response = {
      name: `Getting a user with ${
        user.borrowedBooks && user.borrowedBooks.length > 0
          ? "his past and current"
          : "no"
      } borrow history`,
      originalRequest: {
        method: req.method,
        header: req.headers,
        url: {
          raw: req.originalUrl,
          host: [req.hostname],
          port: req.app.get("port"),
          path: req.url.split("/").filter(Boolean),
        },
      },
      status: "OK",
      code: 200,
      _postman_previewlanguage: "json",
      header: res.getHeaders(),
      cookie: req.cookies,
      body: userResponse,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Kullanıcı getirirken Hata oluştu", error);
    return res.status(500).json(error);
  }
};

// create one User
exports.createOneUser = async (req, res) => {
  console.log("dataa", req);

  try {
    const USER_MODEL = {
      name: req.body.name,
    };

    const { valid, allErrors } = createOneUserData(USER_MODEL);

    if (!valid) {
      return res.status(400).json({
        allErrors,
      });
    }

    try {
      const user = User.create(USER_MODEL);

      return res.status(201).json({
        user: "kullınıcı barılı oluşturuludu",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  } catch (error) {
    console.error("Kullanıcı oluştururken hata oluştu", error);
    return res.status(500).json(error);
  }
};
