Template.comunidad.onCreated(()=> {})
Template.comunidad.onRendered(() => {

  this.$(".message .close")
    .on("click", function() {
      $(this)
        .closest(".message")
        .removeClass(".visible")    
  })
  
  this.$(".ui.search").search({
    minCharacters: 2,
    cache: true,
    searchDelay: 1000,
    maxResults: 5,
    apiSettings: {
      url: "/search/friends/?keyword={query}",
      onResponse(apiResponse) {
        const response = {
          results: []
        }

        $.each(apiResponse.friend, function(index, item) {
          if(Meteor.user()._id !== item._id && !Meteor.user().profile.friends.some((id) => id === item._id)){
            response.results.push({
              id: item._id,
              title: item.username,
              profile: item.profile
            })
          }
        })
        return response
        }
      },
      onSelect(user){
        Meteor.call("addFriend", user.id, (error, result) => {
          if (error) {
            $(".ui.negative.message>.header").text(error)
            $(".ui.negative.message").removeClass("hidden")
            $(".ui.negative.message").fadeIn().delay(3000).fadeOut()
          }else{
            $(".ui.success.message>.header").text("Amigo añadido con éxito")
            $(".ui.success.message").removeClass("hidden")
            $(".ui.success.message").fadeIn().delay(2000).fadeOut()
            $(".prompt").val("")
        }
      })

    }
  })
})

Template.comunidad.events({
    'click .open-sidebar' (event, template) {
      template.$('.ui.sidebar').sidebar('toggle');
    
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

Template.comunidad.helpers({
  getFriends() {
    let friends = []
    Meteor.user()?.profile?.friends.forEach((userID) => {
      Meteor.users.find({_id: userID}).forEach((friend) => {
        friends.push(friend)
      })
    })
    return friends
  },   
  hasTelegramUser(){
    return Meteor.users.find({_id: Meteor.user()._id, "profile.telegram": { $exists: true }}).count() 
  }
})