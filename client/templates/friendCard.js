Template.friendCard.onRendered(() => {
    this.$(".message .close")
        .on("click", function() {
        $(this)
            .closest(".message")
            .removeClass(".visible")    
    })
})

Template.friendCard.helpers({
    getNFriends() {
        return this.profile.friends.length
    }
})

Template.friendCard.events({
    "click a.box" (event, template) {
        event.preventDefault()
        Meteor.call("getData", this.profile.box, (error, result) => {
            if (error) {
            console.log(error)
            } else {
              result = result[0]

              let container = L.DomUtil.get("map");
              if(container != null){
                container._leaflet_id = null;
              }

            let map = L.map("map").setView([result.lat, result.lon], 12);
              L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
              }).addTo(map);
              
              marker = L.marker([result.lat, result.lon]).addTo(map);
              marker.bindPopup(`<b>Box</b>: ${result.display_name.split(",")[0]}`).openPopup()
        
            }
        });
    },
    "click .small.link.icon.power.off" (event, template) {
        event.preventDefault()
   
        const id = template.data._id

        Meteor.call("deleteFriend", id, (error, resutl) => {
            if(error) {
                $(".ui.negative.message>.header").text(error)
                $(".ui.negative.message").removeClass("hidden")
                $(".ui.negative.message").fadeIn().delay(3000).fadeOut()
            }else{
                $(".ui.success.message>.header").text("Amigo borrado con éxito")
                $(".ui.success.message").removeClass("hidden")
                $(".ui.success.message").fadeIn().delay(3000).fadeOut()
            }
        })
    }
})