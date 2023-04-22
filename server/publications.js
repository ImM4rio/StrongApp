Meteor.publish("getExercises", function() {
    return Exercises.find()
})

Meteor.publish("getUserExercises", function() {
    return UsersExercises.find()
})

Meteor.publish("getUserID", function (id){
    return Meteor.users.find({_id: id})
})

Meteor.publish("getUser", function() {
    return Meteor.users.find()
})

