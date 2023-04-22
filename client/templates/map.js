Template.map.onCreated(() => {

})

  
Template.map.onRendered(() => {
  Meteor.call('getData', Meteor.user().profile.box, (error, result) => {
    if (error) {
    console.log(error)
    } else {
      result = result[0]

      let map = L.map('map').setView([result.lat, result.lon], 12);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
      
      let marker = L.marker([result.lat, result.lon]).addTo(map);
      marker.bindPopup(`<b>Box</b>: ${result.display_name.split(",")[0]}`).openPopup()

  
    }
  });
  
});

Template.map.events({

});

Template.map.helpers({
  
});