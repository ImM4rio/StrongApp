Template.retos.events({
    "click .retoBtn" (event, template) {
        event.preventDefault()

        template.$(".retoForm").toggle()
        template.$(".anadirReto").show()
        if(template.$(".retoForm").data("type") === "Weightlifting"){
            template.$(".pesoN").show()
            template.$(".repsN").hide()
            template.$(".forTime").hide()
        }

        if(template.$(".retoForm").data("type") === "Gimnastics"){
            template.$(".repsN").show()
            template.$(".pesoN").hide()
            template.$(".forTime").hide()
        }

        if(template.$(".retoForm").data("counter") === "For Time" || template.$(".retoForm").data("counter") === "EMOM"){
            template.$(".forTime").show()
            template.$(".repsN").hide()
            template.$(".pesoN").hide()

        }else if(template.$(".retoForm").data("counter") === "AMRAP"){
            template.$(".repsN").show()
            template.$(".pesoN").hide()
            template.$(".forTime").hide()
        }
    },
    "click .anadirReto" (event, template) {
        event.preventDefault()
        const movement = this.name
        const type = this.type
        let result

        if(type === "Weightlifting"){
            result = template.$(".pesoN").val()
        }else if(type === "Gimnastics"){
            result = template.$(".repsN").val()
        }else if(type === "Heroe" && (this.counter === "For Time" || this.counter === "EMOM")){
            result = template.$(".forTime").val()
        }else if(type === "Heroe" && this.counter === "AMRAP"){
            result = template.$(".repsN").val()
        }

            Meteor.call('insertExercise', movement, result, type, (err, resutl) => {
                if(err) {
                    $(".ui.negative.message>.header").text(err)
                    $(".ui.negative.message").removeClass("hidden")
                    $(".ui.negative.message").fadeIn().delay(3000).fadeOut()

                }else if(resutl){
                    $(".ui.success.message>.header").text("Registro añadido con éxito")
                    $(".ui.success.message").removeClass("hidden")
                    $(".ui.success.message").fadeIn().delay(3000).fadeOut()
                
                }
            })

    }
})

Template.retos.helpers({
    getIcon(type) {
        if(type === "Gimnastics"){
            return "/icono_gimnasticos.jpg"

        }else if(type === "Weightlifting"){
            return "/icono_haltero.jpg"

        }else{
            return "/icono_heroe.jpg"
        }
    }
})