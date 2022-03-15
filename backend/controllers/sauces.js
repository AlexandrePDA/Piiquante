const Sauces = require("../models/sauces");
const fs = require("fs");

// créer une sauce
exports.createSauces = (req, res, next) => {
  const sauces = new Sauces({
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauces
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Like and Dislike
// Like and Dislike
exports.likeSauce = async (req, res) => {
  const { like, userId } = req.body;

  if (like == undefined || !userId) {
    return res.status(400).json({
      message: 'no like or userID found',
    });
  }

  try {
    const sauce = await Sauces.findOne({ _id: req.params.id });
    console.log(sauce);

    if (sauce.usersLiked.includes(req.body.userId)) {
      await Sauces.updateOne(
        { _id: req.params.id },
        { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
      );
      return res.status(200).json({ message: 'Like supprimé !' });
    }

    if (sauce.usersDisliked.includes(req.body.userId)) {
      await Sauces.updateOne(
        { _id: req.params.id },
        {
          $pull: { usersDisliked: req.body.userId },
          $inc: { dislikes: -1 },
        }
      );
      return res.status(200).json({ message: 'Dislike supprimé !' });
    }

    if (req.body.like === 1) {
      // J'aime
      await Sauces.updateOne(
        { _id: req.params.id },
        { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 } }
      );
      return res.status(200).json({ message: 'Like ajouté !' });
    }

    if (req.body.like === -1) {
      // Je n'aime pas
      await Sauces.updateOne(
        { _id: req.params.id },
        { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }
      );
      return res.status(200).json({ message: 'Dislike ajouté !' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }

  return res.status(400).json({
    message: 'Bad Request',
  });
};

// modifier une sauce
exports.modifySauces = (req, res, next) => {
  const saucesObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauces.updateOne(
    { _id: req.params.id },
    { ...saucesObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// supprimer une sauce
exports.deleteSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauces) => {
      const filename = sauces.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// afficher une seule sauce
exports.getOneSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

// afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauces.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

