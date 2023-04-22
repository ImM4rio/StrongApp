import { Session } from "meteor/session"

Template.misMarcas.onRendered(() => {
    console.log(this)
    this.$(".message .close")
        .on("click", function() {
        $(this)
            .closest(".message")
            .transition("fade")    
    })

    this.$(".ui.search").search({
        minCharacters: 2,
        cache: true,
        searchDelay: 1000,
        maxResults: 3,
        apiSettings: {
          url: "/search/exercises/?keyword={query}",
          onResponse(apiResponse) {
            const response = {
              results: []
            }
    
            $.each(apiResponse.exercise, function(index, item) {
                switch ($(".selectDisciplina").val()) {
                    case "W":
                        if(item.type === "Weightlifting"){
                            response.results.push({
                                id: item._id,
                                title: item.name
                            })
                        }
                        break

                    case "G":
                        if(item.type === "Gimnastics"){
                            response.results.push({
                                id: item._id,
                                title: item.name
                            })
                        }
                        break
                    case "H":
                        if(item.type === "Heroe"){
                            response.results.push({
                                id: item._id,
                                title: item.name,
                                counter: item.counter
                            })
                        }
                        break

                    default:
                        response.results.push({
                            id:item._id,
                            title: item.name
                        })
                        break
                }

            })
            return response
            }
          },
          onSelect(exercise){
            if(exercise?.counter){
                if(exercise.counter === "For Time"){
                    $(".resultHeroe").text("Tiempo")
                    $(".forTime").show()
                    $(".totalReps").hide()
                    $(".marcaHeroe").show()

                }else if(exercise.counter === ("AMRAP" || "EMOM")){
                    $(".resultHeroe").text("Repeticiones")
                    $(".totalReps").show()
                    $(".forTime").hide()
                    $(".marcaHeroe").show()
                }
            }
        }
    })

    this.$(".ui.search.buscar").search({
        minCharacters: 2,
        cache: true,
        searchDelay: 1000,
        maxResults: 3,
        apiSettings: {
          url: "/search/exercises/?keyword={query}",
          onResponse(apiResponse) {
            const response = {
              results: []
            }
    
            $.each(apiResponse.exercise, function(index, item) {
                response.results.push({
                    id: item._id,
                    title: item.name
                })
            })
                
                return response
            }
        },
        onSelect(exercise){
            Session.set("exercise", exercise.title)
            
        }
    })
    
})


Template.misMarcas.helpers({
    getExercises() {
        let id
        if(this.targetUser){
            id = this.targetUser?._id
        }else{
            id = Meteor.user()?._id

        }
        if(Session.get("exercise")){
            const exercises = UsersExercises.find({name: Session.get("exercise"), userID: id}).fetch()
            exercises.forEach(ex => {
                ex.date = ex.date.toLocaleDateString('es-ES')
            })
            return exercises
        
        }
        
        const exercises = UsersExercises.find({userID: id}).fetch()

        exercises.sort((a, b) => {
            return b.date - a.date
        })

        exercises.forEach(ex => {
            ex.date = ex.date.toLocaleDateString('es-ES')
        })

        return exercises

    },
    getType(exercise) {
        if(exercise.type === "Gimnastics"){
            return "Reps"
        }else if(exercise.type === "Weightlifting"){
            return "Kg"
        }else if(exercise.type === "Heroe" && exercise.counter === "AMRAP"){
            return "Reps"
        }
    },
    equals(a, b) {
        return a === b
    },
    addData() {
        return Meteor.userId() === this.targetUser?._id
    },
    hasTelegramUser(){
          return Meteor.users.find({_id: Meteor.user()?._id, "profile.telegram": { $exists: true }}).count()
    }
})

Template.misMarcas.events({
    "click .open-sidebar" (event, template) {
      template.$(".ui.sidebar").sidebar("toggle");
    
    },
    "click .buscarBtn" (event, template) {
        event.preventDefault()

        template.$(event.currentTarget).toggleClass('active');
        if(template.$(event.currentTarget).hasClass('active')){
            template.$(event.currentTarget).text("X");
        }
        else {
            template.$(event.currentTarget).text("Buscar");
        }

        if( template.$(event.currentTarget).hasClass("active") ) {
            $(".buscarLbl").show()
        
        }else{
            $(".buscarLbl").hide()
        }
    },
    "click .anadirBtn" (event, template) {
        event.preventDefault()


        if($(".selectDisciplina").val()){
            $(".selectDisciplina").css("border-color", "black")
            template.$(event.currentTarget).toggleClass('active');
            if(template.$(event.currentTarget).hasClass('active')){
                template.$(event.currentTarget).text("X");
            }
            else {
                template.$(event.currentTarget).text("Añadir");
            }
     
            template.$(".marcasFormDiv").toggle()

        }else{
            $(".selectDisciplina")
                .css("border-color", "red")
                .popup({
                    content: "Selecciona una disciplina",
                    position: 'top right',
                    delay: {
                        show: 300,
                        hide: 800
                    }
                }).popup('toggle')
        }

    },
    "change .selectDisciplina" ( event, template ) {
        event.preventDefault()

        switch ( $(".selectDisciplina").val() ) {
            case "W":
                $(".gimnasticosIcon").hide()
                $(".heroeIcon").hide()
                $(".halteroIcon").show()

                $(".pesoForm").toggle()
                $(".repeticionesForm").hide()
                $(".tiempoForm").hide()
                break;
        
            case "G":
                $(".gimnasticosIcon").show()
                $(".heroeIcon").hide()
                $(".halteroIcon").hide()

                $(".repeticionesForm").toggle()
                $(".tiempoForm").hide()
                $(".pesoForm").hide()
                break;
        
            case "H":
                $(".gimnasticosIcon").hide()
                $(".halteroIcon").hide()
                $(".heroeIcon").show()

                $(".tiempoForm").toggle()
                $(".pesoForm").hide()
                $(".repeticionesForm").hide()
                break;
        
            default:
                break;
        }
    },
    "click .anadirFormBtn" (event, template) {
        let movement = ""
        let type = ""

        if($("form.marcasForm :visible:input:empty")[1].value === "" || $("form.marcasForm :visible:input:empty")[0].value === ""){
            $(".marcasForm")
                .popup({
                    content: "Todos son campos obligatorios",
                    position: 'top right',
                    delay: {
                        show: 300,
                        hide: 800
                    }
            }).popup('toggle')
            return false
        }

        switch ($(".selectDisciplina").val()) {

            case "W":
                movement = $(".nombreHalteroTxt").val()
                const weight = $(".pesoN").val()
                type = "Weightlifting"

                Meteor.call('insertExercise', movement, weight, type, (err, resutl) => {
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

                break
            
            case "G":    
                movement = $(".nombreGimnasticTxt").val()
                const reps = $(".repsN").val()
                type = "Gimnastics"

                Meteor.call('insertExercise', movement, reps, type, (err, resutl) => {
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
                break

            case "H":
                movement = $(".nombreHeroeTxt").val()
                const resultado = $(".forTime").val() ? $(".forTime").val() : $(".totalReps").val()
                type = "Heroe"

                Meteor.call('insertExercise', movement, resultado, type, (err, resutl) => {
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
                break

            default:
                break
        }
        template.$(".marcasFormDiv").toggle()
        $(".anadirBtn").text("Añadir")
        
    },
    "click .deleteExercise" (event, template) {
        event.preventDefault()

        const id = template.$(event.currentTarget).data("id")
        
        Meteor.call('deleteExercise', id, (err, result) => {
            if(err) {
                $(".ui.negative.message>.header").text(err)
                $(".ui.negative.message").removeClass("hidden")
                $(".ui.negative.message").fadeIn().delay(3000).fadeOut()
            
            }else if(result){
                $(".ui.success.message>.header").text("Registro borrado con éxito")
                $(".ui.success.message").removeClass("hidden")
                $(".ui.success.message").fadeIn().delay(3000).fadeOut()
        
            }
        })
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

Template.misMarcas.onDestroyed(() => {
    Session.set("exercise", null)
})