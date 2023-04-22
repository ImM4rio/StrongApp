import SimpleSchema from "simpl-schema"

UsersExercises = new Mongo.Collection("UsersExercises")

UsersExercises.schema = new SimpleSchema({
  _id: {
    type: String,
    optional: false
  },
  name: {
    type: toString,
    optional: false
  },
  result: {
    type: String,
    optional: false
  },
  type: {
    type: String,
    optional: false
  },
  userID: {
    type: String,
    optional: false
  },
  date: {
    type: Date,
    optional: false
  }

})

if (Meteor.isClient) {
    // UsersExercises.before.update(() =>{})
  
    //UsersExercises.after.insert(() => {})
  }
  
  // Add custom permission rules if needed
  if (Meteor.isServer) {
    UsersExercises.allow({
      insert() {
        return true
      },
      update() {
        return true
      },
      remove() {
        return true
      }
    })
  }