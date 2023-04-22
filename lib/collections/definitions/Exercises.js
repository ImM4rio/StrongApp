import SimpleSchema from "simpl-schema"

Exercises = new Mongo.Collection("Exercises")

Exercises.schema = new SimpleSchema({
  _id: {
    type: Mongo.ObjectID,
    optional: false
  },
  name: {
    type: String,
    optional: false
  },
  description: {
    type: String,
    optional: true
  },
  type: {
    type: String,
    optional: false
  }
})

if (Meteor.isClient) {
    // Exercises.before.update(() =>{})
  
    // Exercises.after.insert(() => {})
  }
  
  // Add custom permission rules if needed
  if (Meteor.isServer) {
    Exercises.allow({
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