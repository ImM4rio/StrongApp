Template.perfil.onRendered(() => {

    $(".message .close.icon")
        .on("click", function() {
            $(this)
            .closest(".message")
            .transition("fade")    
    })
})

Template.perfil.events({
    "click .open-sidebar" (event, template) {
        event.preventDefault()

        template.$(".ui.sidebar").sidebar("toggle");
    
    },
    "click .ajustesBtn" (event, template) {
        event.preventDefault()

        $(".usuarioCard").toggle()
        $(".centered.profileImage").hide()

        
        $(".ajustesForm").toggle()

    },
    "click .modificarPerfilBtn" (event, template) {
        event.preventDefault()

        const first = template.$(".firstNameTxt").val()
        const second = template.$(".secondNameTxt").val()
        const description = template.$(".descriptionTxt").val()
        const box = template.$(".boxTxt").val()
        const userId = Meteor.user()._id 

        try{
            Meteor.call("updateProfile", userId, first, second, description, box, (error, result) => {
                if(error) {
                    $(".ui.negative.message>.header").text(error)
                    $(".ui.negative.message").removeClass("hidden")
                    $(".ui.negative.message").fadeIn().delay(3000).fadeOut()
                
                }else if(result){
                    $(".ui.success.message>.header").text("Perfil modificado con éxito")
                    $(".ui.success.message").removeClass("hidden")
                    $(".ui.success.message").fadeIn().delay(3000).fadeOut()
            
                }
            })
        }catch(error){

        }

        template.$(".ajustesForm").toggle()
        $(".usuarioCard").toggle()
        $(".centered.profileImage").show()
        
    },
    "click .buscarAmigosBtn" (event) {
        event.preventDefault()

        console.log("buscando")
    },
    "click .descartarBtn" (event){
        event.preventDefault()

        $(".ajustesForm").trigger("reset")

        $(".usuarioCard").toggle()
        $(".centered.profileImage").show()
        $(".ajustesForm").toggle()
    },
    "click div.logout" (event) {
      event.preventDefault()
      Meteor.logout()
    },
    "click .telegram.plane" (event) {
      event.preventDefault()
      window.location.href = "https://telegram.me/StrongAppBot"
    }
})

Template.perfil.helpers({
    user() {
        return Meteor.user()
    },
    getRandom() {
        //Get Random object form Exercises and userExercises
        let exercises = Exercises.find().fetch()
        let userExercises = UsersExercises.find().fetch()
      
        // Comparing both to avoid repeat movements
        let challenge = exercises.filter(e => !userExercises.some(uE => uE.name === e.name))
        challenge.sort(() => 0.5 - Math.random())
        challenge = challenge.slice(0, 3)
        
        return challenge

    },
    hasTelegramUser(){
        return Meteor.users.find({_id: Meteor.user()._id, "profile.telegram": { $exists: true }}).count()
    }

})
