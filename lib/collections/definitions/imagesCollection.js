import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';


const imagesCollection = new FilesCollection({
  collectionName: 'images',
  allowClientCode: false,
  storagePath: "../../../../../public/uploads/avatar",
  onBeforeUpload(file) {
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';
  }
});

if (Meteor.isClient) {
  Meteor.subscribe('files.images.all');
}

if(Meteor.isServer) {
  Meteor.publish('files.images.all', function () {
    return imagesCollection.find().cursor
})
}

export default imagesCollection;