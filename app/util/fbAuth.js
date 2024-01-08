module.exports = (req, res, next) => {
 

  if (req.headers["content-type"] === "application/json") {
    //if the header is neccessary;
    next();
  } else {
    return res.status(403).json({ Hata: "İziniz Yok,  İşlem yapamasınız !!" });
  }
};
