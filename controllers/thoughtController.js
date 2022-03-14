const { User, Thought } = require("../models");

// TODO: Create an aggregate function to get the number of students overall
// const headCount = async () =>
//   Student.aggregate()
//     // Your code here
//     .then((numberOfStudents) => numberOfStudents);

// TODO: Create a function that executes the aggregate method on the Student model and will calculate the overall grade by using the $avg operator
// const grade = async (studentId) =>
//   Student.aggregate([
//     {
//       $unwind: '$assignments',
//     },
//     {
//       // Your code here
//     },
//   ]);

module.exports = {
  // Get all students
  getThoughts(req, res) {
    Thought.find()
      .then(async (thoughts) => {
        //   const studentObj = {
        //     thoughts,
        //     headCount: await headCount(),
        //   };
        //   return res.json(studentObj);
        return res.json(thoughts);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single student
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .lean()
      .then(async (thought) =>
        !student
          ? res.status(404).json({ message: "No student with that ID" })
          : res.json(
              //{
              thought
              // grade: await grade(req.params.studentId),
              //}
            )
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // create a new student
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },

  // Update a thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No course with this id!" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a thought  //and remove them from the course
  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No such student exists" })
          : //     : Course.findOneAndUpdate(
            //         { students: req.params.studentId },
            //         { $pull: { students: req.params.studentId } },
            //         { new: true }
            //       )
            // )
            // .then((course) =>
            //   !course
            // ? res.status(404).json({
            //     message: 'Thought deleted, but no courses found',
            //   })
            res.json({ message: "Thought successfully deleted" })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add a reaction to a thought
  addReaction(req, res) {
    console.log("You are adding a reaction");
    console.log(req.body);
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "No thought found with that ID :(" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove reaction from a thought
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reaction: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: "No student found with that ID :(" })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
