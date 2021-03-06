const router = require('express').Router();
const path = require('path');
const db = require('../models');


// router.get("/api/transaction", (req, res) => {
//   Transaction.find({})
//     .sort({ date: -1 })
//     .then(dbTransaction => {
//       res.json(dbTransaction);
//     })
//     .catch(err => {
//       res.status(400).json(err);
//     });
// });

//Matches getLastWorkout()
router.get("/api/workouts", (req, res) => {
// Used https://docs.mongodb.com/manual/reference/operator/aggregation/addFields/
    db.Workout.aggregate([
    { $addFields: {
        totalDuration: {
// Used https://docs.mongodb.com/manual/reference/operator/aggregation/sum/
            $sum: '$exercises.duration'
        }
        }}
    ])
    .then(workout => {
      res.json(workout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});


// router.post("/api/transaction", ({ body }, res) => {
//   Transaction.create(body)
//     .then(dbTransaction => {
//       res.json(dbTransaction);
//     })
//     .catch(err => {
//       res.status(400).json(err);
//     });
// });


// Matches createWorkout()
router.post("/api/workouts", ({ body}, res) => {
  db.Workout.create(body)
    .then(newWorkout => {
      res.json(newWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});


// Matches getWorkoutsInRange()
// router.get("/api/workouts/range", (req, res) => {
//     db.Workout.find({}).sort({day:-1}).limit(7)
//         .then(dbWorkoutRange => {
//             res.json(dbWorkoutRange);
//         })
//         .catch(err => {
//             res.status(400).json(err);
//         });
// });


// Used https://docs.mongodb.com/manual/reference/operator/aggregation/addFields/
// Extremely helpful, followed format in scores.aggregate example

router.get("/api/workouts/range", (req, res) => {
    db.Workout.aggregate( [
        {
          $addFields:{
            totalDuration: { $sum: '$exercises.duration'}
        }
      }
// Used https://mongoosejs.com/docs/api.html#aggregate_Aggregate to research .sort
    ] ).sort( {
        _id: -1
// Also used https://mongoosejs.com/docs/api.html#aggregate_Aggregate to research .limit, interesting that it can save your app from running out of memory
    }).limit(8)
    .then(dbWorkout => {
        res.json(dbWorkout);
    })
    .catch(err => {
        res.status(400).json(err)
    });
});


// Matches addExercise()
router.put("/api/workouts/:id", (req, res) => {
    db.Workout.findByIdAndUpdate({_id: req.params.id}, {$push: {exercises: req.body}}, {new: true}
        )
        .then(dbAmmendWorkout => {
            res.json(dbAmmendWorkout);
        })
        .catch(err => {
            res.status(400).json(err);
        });
});





module.exports = router;

