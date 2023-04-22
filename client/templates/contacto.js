Template.contacto.onRendered(() => {
  $(".message .close")
    .on("click", function() {
      $(this)
        .closest(".message")
        .transition("fade")    
  })
})

Template.contacto.helpers({
  hasTelegramUser(){
    return Meteor.users.find({_id: Meteor.user()._id, "profile.telegram": { $exists: true }}).count()
  }
})

Template.contacto.events({
  'click .open-sidebar' (event, template) {
    template.$('.ui.sidebar').sidebar('toggle');
  
  },
  "click div.logout" (event) {
    event.preventDefault()
    Meteor.logout()
  },
  "click div.wide.vertical.animated.button" (event, template) {
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
  "click .telegram.plane" (event) {
    event.preventDefault()
    window.location.href = "https://telegram.me/StrongAppBot"
  }

})