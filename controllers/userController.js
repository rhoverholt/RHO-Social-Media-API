const { User, Thought } = require("../models");

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },

  // Get a user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate("thoughts")
      .populate("friends")
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create a user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Delete a user
  //   **BONUS**: Remove a user's associated thoughts when deleted.
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No course with that ID" })
          : User.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: "User and thoughts deleted!" }))
      .catch((err) => res.status(500).json(err));
  },

  // Update a user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No course with this id!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: "No user found with ID: " + userId })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove friend from a user
  removeFriend(req, res) {
    console.log(req.params.userId, req.params.friendId);
    User.findOne({ _id: req.params.userId }).then((user) => {
      let newFriends = [];

      // this is gross, but I couldn't get the usual way to work and ran out of time.
      for (friend of user.friends) {
        if (friend != req.params.friendId) newFriends.push(friend);
      }

      User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: { friends: newFriends } },
        { runValidators: true, new: true }
      )
        .then((user) =>
          !user
            ? res.status(404).json({ message: "No user found with that ID :(" })
            : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    });
  },
};
