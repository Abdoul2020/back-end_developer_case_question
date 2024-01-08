const database = require("../models");

const Book = database.Book;
const User = database.User;
const LibraryTransaction = database.LibraryTransaction;

exports.borrowBook = async (req, res) => {
  const userId = req.params.userId;
  const bookId = req.params.bookId;

  try {
    // Check if the user and book exist
    const user = await User.findByPk(userId);
    const book = await Book.findByPk(bookId);

    console.log("userr", user);
    console.log("bookk", book);

    if (!user || !book) {
      return res.status(404).json({ error: "Kullanıcı yada Kitap bulnumuyor" });
    }

    // Check if the user already borrowed the book
    const existingTransaction = await LibraryTransaction.findOne({
      where: {
        userId: user.id,
        bookId: book.id,
        status: "borrowed",
      },
    });

    if (existingTransaction) {
      return res.status(400).json({ error: "Kullanıcı bir kitap Ödünç almış" });
    }

    // Create a new transaction to represent the borrowing
    const newTransaction = await LibraryTransaction.create({
      userId: user.id,
      bookId: book.id,
      status: "borrowed",
    });

    // Construct the response
    const response = {
      name: "Borrow Book",
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
        message: `Book "${book.name}"User borrowed a book succesfully "${user.name}"`,
        transactionId: newTransaction.id,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(`kitap ödünç alma hatası ${userId}:`, error);
    res.status(500).json({ error: "Server Hatası" });
  }
};

// return and score the book

exports.return_scoreBook = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookId = req.params.bookId;
    const { score } = req.body;

    // Check if the user and book exist
    const user = await User.findByPk(userId);
    const book = await Book.findByPk(bookId);

    if (!user || !book) {
      return res
        .status(404)
        .json({ error: "Kullanıcı yada Kitap Bulunamadı!!" });
    }

    // Check if the user has borrowed the book
    const transaction = await LibraryTransaction.findOne({
      where: {
        userId: user.id,
        bookId: book.id,
        status: "borrowed",
      },
    });

    if (!transaction) {
      return res.status(400).json({ error: "Kullanıcı Kitap Ödünç almadı" });
    }

    // Update the transaction status to 'returned' and set the score
    await transaction.update({
      status: "returned",
      score: score || null,
    });

    // Construct the response
    const response = {
      name: "User returning a book with his score",
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
        message: `Book "${book.name}" has been returned and scored by "${user.name}"`,
        transactionId: transaction.id,
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(`Error returning and scoring book ${bookId}:`, error);
    res.status(500).json({ error: "Server Error" });
  }
};
