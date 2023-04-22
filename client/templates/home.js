import { Meteor } from "meteor/meteor"
import { ReactiveVar } from 'meteor/reactive-var';
import imagesCollection from "../../lib/collections/definitions/imagesCollection"

Template.home.onRendered(() => {
  $(".message .close")
    .on("click", function() {
      $(this)
        .closest(".message")
        .transition("fade")    
  })
})

Template.home.onCreated(() => {
  this.currentUpload = new ReactiveVar(false);
});

Template.home.helpers({
  hasTelegramUser(){
    return Meteor.users.find({_id: Meteor.user()._id, "profile.telegram": { $exists: true }}).count()
  }
})

Template.home.events({

  "click .open-sidebar" (event, template) {
    event.preventDefault()

    template.$(".ui.sidebar").sidebar("toggle");

  },

  "click .registrarseBtn" (event, template) {    
    event.preventDefault()

    template.$(".formularioRegistroLogin").toggle()
    template.$(".formularioRegistro").toggle()
    template.$(".mainText").toggle()
    template.$("#mainButtons").toggle()

  },

  "click .salirRegistroForm" (event, template) {
    event.preventDefault()

    template.$(".formularioRegistroLogin").toggle()
    template.$(".formularioRegistro").toggle()
    template.$(".mainText").toggle()
    template.$("#mainButtons").toggle()
  
  },
  "click .loginBtn" (event, template) {
    event.preventDefault()

    template.$(".formularioRegistroLogin").toggle()
    template.$(".formularioLogIn").toggle()
    template.$(".mainText").toggle()
    template.$("#mainButtons").toggle()
  
  },
  "click .logoutBtn" (event){
    event.preventDefault()

    Meteor.logout()
  },
  "click .salirLoginForm" (event, template) {
    event.preventDefault()

    template.$(".formularioRegistroLogin").toggle()
    template.$(".formularioLogIn").toggle()
    template.$(".mainText").toggle()
    template.$("#mainButtons").toggle()
  
  },
  "click .registrarseBtnForm" (event, template) {
    event.preventDefault()

    let user = {}

    if( $(".registroPSW").val() !== $(".registroPSW2").val()) {
      $(".registroPSW2").popup({
        content: "Las contraseñas no coinciden"
      }).popup("show")
      return false
    }

    if( $(".registroEmail").val() === "" || $(".registroPSW").val() === "" || $(".registroTel").val() === "" || $(".registroNombre").val() === ""){
      $(".registrarseBtnForm").css("border-color", "red")
      $(".registrarseBtnForm").popup({
        content: "Debe rellenar los campos marcados por un asterisco"
      }).popup("show")
      return false
    }

    if($("#fileInput").get(0).files && $("#fileInput").get(0).files[0]){
      const upload = imagesCollection.insert({
        file: $("#fileInput").get(0).files[0],
        chunkSize: 'dynamic',
      }, false);

      upload.on('start', function () {
        currentUpload.set(this)
      });

      upload.on('end', function (error, fileObj) {
        if (error) {
          alert(`Error during upload: ${error}`)
        } else {
          user = {
            username: $(".registroEmail").val(),
            email: $(".registroEmail").val(),
            password: $(".registroPSW").val(),
            phone: $(".registroTel").val(),
            profile: {
              avatar: `/uploads/avatar/${fileObj._id}.${fileObj.extension}`,
              name: 
                {
                    first: $(".registroNombre").val(),
                    second: $(".registroApellidos").val()
                },
              description: $(".descripcionTextA").val(),
              box: $(".boxAsociadoTxt").val(),
              friends: []
            }
          }
          Meteor.call("insertUser", user, (error, result) => {
            if(error){
              $(".ui.negative.default.message>.header").text(error)
              $(".ui.negative.default.message").removeClass("hidden")
              $(".ui.negative.default.message").fadeIn().delay(3000).fadeOut()
            }else if(result) {
              $(".ui.success.default.message>.header").text("Registro añadido con éxito")
              $(".ui.success.default.message").removeClass("hidden")
              $(".ui.success.default.message").fadeIn().delay(3000).fadeOut()
              template.$(".formularioRegistroLogin").toggle()
              template.$(".formularioLogIn").toggle()
              template.$(".mainText").toggle()
              template.$("#mainButtons").toggle()
            }
          })
        }
        currentUpload.set(false);
      });
      upload.start();

    }else{
          user = {
        username: $(".registroEmail").val(),
        email: $(".registroEmail").val(),
        password: $(".registroPSW").val(),
        phone: $(".registroTel").val(),
        profile: {
          avatar: "/avatar.png",
          name: 
            {
                first: $(".registroNombre").val(),
                second: $(".registroApellidos").val()
            },
          description: $(".descripcionTextA").val(),
          box: $(".boxAsociadoTxt").val(),
          friends: []
        }
      }
      Meteor.call("insertUser", user, (err, result) => {
        if(err){
          $(".ui.negative.default.message>.header").text(err)
          $(".ui.negative.default.message").removeClass("hidden")
          $(".ui.negative.default.message").fadeIn().delay(3000).fadeOut()
        }else if(result) {
          $(".ui.success.default.message>.header").text("Registro añadido con éxito")
          $(".ui.success.default.message").removeClass("hidden")
          $(".ui.success.default.message").fadeIn().delay(3000).fadeOut()
          template.$(".formularioRegistroLogin").toggle()
          template.$(".formularioLogIn").toggle()
          template.$(".mainText").toggle()
          template.$("#mainButtons").toggle()
        }
      })
      
    }

  },
  "click .logInFormBtn" (event) {
    event.preventDefault()

   const email = $(".logEmail").val()
   const password = $(".logPSW").val()

    Meteor.loginWithPassword(email, password, (error) => {
      if(error) {
        $(".ui.negative.default.message>.header").text("Usuario o contraseña incorrectos")
        $(".ui.negative.default.message").show()
      
      }else{
        location.reload()

      }
    })

  },
  "click .wide.field.vertical.animated.button" (event, template) {
    event.preventDefault()

    let email = template.$(".emailFormEm").val()
    let name = template.$(".nameFormTxt").val()
    let message = template.$(".textareaForm").val()

    Meteor.call("sendMail", email, message, name, (error, result) => {
      if(error){
        $(".ui.negative.message>.header").text(error)
        $(".ui.negative.message").removeClass("hidden")
        $(".ui.negative.message").fadeIn().delay(3000).fadeOut()
      }else{
        $(".ui.success.message>.header").text("Mensaje enviado, nos pondremos en contacto!")
        $(".ui.success.message").removeClass("hidden")
        $(".ui.success.message").fadeIn().delay(3000).fadeOut()

        $(".contactForm").form("clear")   
        window.scrollTo(0, 0);     
      }
    })

    
  },
  "click div.logout" (event) {
    event.preventDefault()
    Meteor.logout()
  },
  "click a.registrarseA" (event) {
    event.preventDefault()
    window.scrollTo(0, 0)     

  },
  "click .telegramBtn" (event) {
    event.preventDefault()
    $(".telegramBtn").hide()
    $(".usuarioTelegramDiv").show()
  },
  "click div.usuarioTelegramDiv>button" (event) {
    event.preventDefault()
    let telegramUser = $(".usuarioTelegramTxt").val()
    let userId = Meteor.user()._id

    Meteor.call("saveTelegramUser", userId, telegramUser, (error, result) => {
      if(error){
        $(".ui.negative.default.message>.header").text(error)
        $(".ui.negative.default.message").removeClass("hidden")
        $(".ui.negative.default.message").fadeIn().delay(3000).fadeOut()
      }else if(result) {
        window.scrollTo(0, 0)  
        $(".ui.success.default.message>.header").text("Ya puedes ir a telegram")
        $(".ui.success.default.message").removeClass("hidden")
        $(".ui.success.default.message").fadeIn().delay(3000).fadeOut()
        setTimeout(()=>{window.location.href = "https://telegram.me/StrongAppBot"}, 2000)
      }
    })
  },
  "click .telegram.plane" (event) {
    window.location.href = "https://telegram.me/StrongAppBot"

  }
  

})






