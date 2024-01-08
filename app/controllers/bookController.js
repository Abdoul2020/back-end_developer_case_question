const database = require("../models");
const { Sequelize } = require("sequelize");
const { createOneBookData } = require("../util/validatorData");

const Book = database.Book;
const User = database.User;
const LibraryTransaction = database.LibraryTransaction;

//get all tthe user
exports.getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.findAll();

    const simplifiedBooksBody = books.map(({ id, name }) => ({ id, name }));

    const response = {
      name: "Getting book list",
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
      body: JSON.stringify(simplifiedBooksBody),
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

//getting One Book
exports.getOneBook = async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await Book.findByPk(bookId, {
      include: [
        {
          model: User,
          as: "borrowedBy",
          attributes: ["id", "name"],
          through: {
            model: LibraryTransaction,
            attributes: [],
          },
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.fn(
              "AVG",
              Sequelize.col("borrowedBy->LibraryTransaction.score")
            ),
            "averageUserScore",
          ],
        ],
      },
      group: ["Book.id", "borrowedBy.id"],
    });

    if (!book) {
      return res.status(404).json({ error: "Kitap Bulunamdı" });
    }
    console.log("booksss", book.toJSON());

    const averageUserScore =
      book.get("averageUserScore") !== null
        ? parseFloat(book.get("averageUserScore")).toFixed(2)
        : -1;

    const response = {
      name: ` ${
        averageUserScore !== -1
          ? "Getting a book with its average user score"
          : "Getting a book which is not scored yet"
      }`,
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
      body: {
        id: book.id,
        name: book.name,
        averageUserScore: averageUserScore,
        borrowedBy: book.borrowedBy, // This will be an empty array if no users have borrowed the book
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Srver 500 hatassı" });
  }
};

//create Book
exports.createOneBook = async (req, res) => {
  try {
    const USER_MODEL = {
      name: req.body.name,
    };

    console.log("USER", USER_MODEL);

    const { valid, allErrors } = createOneBookData(USER_MODEL);

    if (!valid) {
      return res.status(400).json({
        allErrors,
      });
    }

    try {
      const book = await Book.create(USER_MODEL);
      return res.status(201).json({
        book: "Kitap barılı oluşturuludu",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  } catch (error) {
    console.error("Kullanıcı oluştururken hata oluştu", error);
    res.status(500).json({ error: "server HATA: 500" });
  }
};
