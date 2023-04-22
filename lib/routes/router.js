Router.route("/", function() {
    const self = this
    document.title = "StrongApp"
    this.render('home')

})

Router.route("/home", function() {
    const self = this
    document.title = "StrongApp"
    this.render('home')
        let exercises = Meteor.subscribe("getExercises")
        let usersExercises = Meteor.subscribe("getUserExercises")
    
    Tracker.autorun(() => {
        if(exercises.ready() && usersExercises.ready()){
            self.render("home")
        }
    })

})

Router.route("/perfil", function () {
    const self = this
    document.title = "Perfil"

    let exercisesSubs = Meteor.subscribe("getExercises")
    let usersExercisesSubs = Meteor.subscribe("getUserExercises")

    Tracker.autorun(() => {
        if(exercisesSubs.ready() && usersExercisesSubs.ready()){
            let exercises = Exercises.find()
            let usersExercises = UsersExercises.find()
            self.render('perfil', {
                data: {
                    exercises,
                    usersExercises
                }
            })  
        }else{
            console.log()
        }
    })
})

Router.route("/contacto", function () {
    const self = this
    document.title = "Contacto"
    this.render("contacto")
})

Router.route("/comunidad", function () {
    const self = this
    document.title = "Comunidad"

    let userSub = Meteor.subscribe("getUser")
    Tracker.autorun(() => {
        if(userSub.ready()){
            let user = Meteor.users.findOne({_id: Meteor.user()._id})
            self.render("comunidad", {
                data: {
                    user
                }
            })
        }
    })
})

Router.route("/marcas/:_id", function () {

    const self = this
     document.title = "Mis Marcas"

    let usersSubs = Meteor.subscribe("getUserID", self.params._id)
    let exercisesSubs = Meteor.subscribe("getExercises")
    let usersExercisesSubs = Meteor.subscribe("getUserExercises")

    Tracker.autorun(() => {
        if(usersSubs.ready() && exercisesSubs.ready() && usersExercisesSubs.ready()){
            let targetUser = Meteor.users.findOne({_id: self.params._id})
            let exercises = Exercises.find()
            let usersExercises = UsersExercises.find()
            self.render('misMarcas', {
                data: {
                    targetUser,
                    exercises,
                    usersExercises
                }
            })

            
        }else{
            console.log()
        }
    })
})