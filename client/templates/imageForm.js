import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import imagesCollection from "../../lib/collections/definitions/imagesCollection"

Template.imageForm.onCreated(function () {
  this.currentUpload = new ReactiveVar(false);
});

Template.imageForm.helpers({
  currentUpload() {
    return Template.instance().currentUpload.get();
  }
});

Template.imageForm.events({
  'change #fileInput'(event, template) {
    event.preventDefault()
    if (event.currentTarget.files && event.currentTarget.files[0]) {

      const upload = imagesCollection.insert({
        file: event.currentTarget.files[0],
        chunkSize: 'dynamic',
      }, false);

      upload.on('start', function () {
        template.currentUpload.set(this);
      });

      upload.on('end', function (error, fileObj) {
        if (error) {
          alert(`Error during upload: ${error}`);
        } else {
            Meteor.call("updateAvatar", Meteor.user()._id, fileObj._id, fileObj.extension, (error, result) => {
                if(error){
                    $(".ui.negative.message>.header").text(error)
                    $(".ui.negative.message").removeClass("hidden")
                    $(".ui.negative.message").fadeIn().delay(3000).fadeOut()
                  }else{
                    $(".ui.success.message>.header").text("Se ha cambiado con éxito la imagen de perfil")
                    $(".ui.success.message").removeClass("hidden")
                    $(".ui.success.message").fadeIn().delay(3000).fadeOut()
                  }
            })
        }
        template.currentUpload.set(false);
    });

      upload.start();
    }
  }
});