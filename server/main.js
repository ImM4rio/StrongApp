import { Meteor } from "meteor/meteor";
import { Roles } from "meteor/alanning:roles"; 
import {check} from "meteor/check";
import { fetch, Headers } from 'meteor/fetch';
import imagesCollection from "../lib/collections/definitions/imagesCollection"
const TelegramBot = require("node-telegram-bot-api")

const telegramBot = () =>{
  bot.onText(/\/marcas (.+)/, Meteor.bindEnvironment((msg, match)=> {

    let user =  msg.from.username
    let userRegExp = new RegExp(`^${user}$`, "i")
    let chatId = msg.chat.id;
    let resp = match[1]; // the captured "whatever"
    let regex = new RegExp(`^${resp}$`, "i")
    

      let userID = Meteor.users.find({"profile.telegram":  {$regex: userRegExp}}).fetch()[0]?._id

      if(user){

        try{
          if(UsersExercises.find({userID: userID, name: {$regex: regex}}).count() > 0) {
            let exercise = UsersExercises.find({userID: userID, name: {$regex: regex}}).fetch()
            exercise.sort((a, b) => {
              return b.date - a.date
            })
            resp = `Tu último registro de ${exercise[0].name} es ${exercise[0].result} !`
            bot.sendMessage(chatId, resp);
          }else{
            bot.sendMessage(chatId, "No hay registro para ese ejercicio")
          }
        }catch(error){
          return error
        }
        
      }else{
        bot.sendMessage(chatId, "El usuario no está registrado, accede ya www.strongApp.com !")
      }
  }));

}

const token = "5682063471:AAFi8YQmf7bCfRr4QdCYMld7NV_p048ofRQ"
var bot = new TelegramBot(token, {polling: true})



Meteor.startup(() => {

  const roles = ["admin", "user"]
  
  roles.forEach( (role) => {
    Roles.createRole(role, {unlessExists: true})

  })

  telegramBot()
});

Meteor.methods( {
  "insertUser" (user) {
    Roles.addUsersToRoles(Accounts.createUser(user), "user")

    return true
  
  },
  "insertExercise" (name, result, type) {

    check(name, String)
    check(result, String)
    check(type, String)

    if(!Meteor.user() || !Roles.userIsInRole(Meteor.user()._id, "user")){
      return false       
    }

    exercise = {
      name: name,
      result,
      type,
      userID: this.userId,
      date: new Date()
    }

    UsersExercises.insert(exercise)
    return true

  },
  "deleteExercise" (id) {

    check(id, String)

    if(!Meteor.user() || !Roles.userIsInRole(Meteor.user()._id, "user")){
      return false       
    }

    UsersExercises.remove({_id: id})
    return true
  },
  async getData(name) {
    
    check(name, String)

    if(!Meteor.user() || !Roles.userIsInRole(Meteor.user()._id, "user")){
      return false
    }

    try{
      const response = await fetch(`https://nominatim.openstreetmap.org/search.php?q=${name}&format=jsonv2`, {
        method: 'GET', 
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        redirect: 'follow',
        referrerPolicy: 'no-referrer' 
      })
      const data = await response.json()
      return data

    }catch(error){
      throw new Meteor.Error("bad", "Error en la consulta a la api nominatim de openstreetmap")
    }
  },
  addFriend(userID) {
    
    check(userID, String)

    if(!Meteor.user() || !Roles.userIsInRole(Meteor.user()._id, "user")){
      return false
    }

    try{
      if(Meteor.users.find({_id: Meteor.user()._id}, {fields: {"profile.friends": 1}}).fetch()[0].profile.friends.some(item => item === userID)){
        throw new Meteor.Error("bad", "Error al añadir amigo")
      }

      Meteor.users.update({_id: Meteor.user()._id}, { $push: {"profile.friends": userID}} )
      return true

    }catch(error){
      throw new Meteor.Error("bad", "Error al añadir amigo")
    }

  },
  deleteFriend(friendId) {

    check(friendId, String)

    if(!Meteor.user() || !Roles.userIsInRole(Meteor.user()._id, "user")){
      return false
    }

    try{
      Meteor.users.update({_id: Meteor.user()._id}, {$pull: {"profile.friends": friendId}})
      return true
      
    }catch(error) {
      return error

    }

  },
  updateProfile(userId, first, second, description, box) {
    
    check([userId, first, second, description, box], [String])

    
    if(!Meteor.user() || Meteor.user()._id !== userId || !Roles.userIsInRole(Meteor.user()._id, "user")){
      return false
    }

    let user = Meteor.users.findOne({_id: userId})

    if(first !== ""){
      user.profile.name.first = first
    }
    
    if(second !== ""){
      user.profile.name.second = second
    }

    if(description !== ""){
      user.profile.description = description
    }

    if(box !== ""){
      user.profile.box = box
    }


    try{
      Meteor.users.update({_id: userId}, {$set: {profile: user.profile}})
      return true

    }catch(error){
      return error
    }
    
  },
  updateAvatar(userId, id, extension) {
    check([userId, id, extension], [String])

    if(!Meteor.user() || !Roles.userIsInRole(Meteor.user()._id, "user")){
      return false
    }

    const link = `/uploads/avatar/${id}.${extension}`
    console.log(link)
    
    const lastImage = Meteor.users.find({_id: Meteor.user()._id}, {fields: {"profile.avatar": 1}}).fetch()[0].profile.avatar
    const idLastImage = lastImage.split(".")[0].split("/")[3]
    imagesCollection.remove({_id: idLastImage})
    
    try{      
      Meteor.users.update({_id: userId}, {$set: {"profile.avatar": link}})
      
      return true

    }catch(error){
      return error
    }
  },
  sendMail(from, content, name) {

    check([from, content, name], [String])
 
    const subject = `email enviado desde StrongApp por ${name} (${Meteor.user()?.username})`
    try{
      Email.send({
        to: "strongappweb@outlook.es",
        from: "sandbox9b5ba4bc81744c24b06466edf42e4e7e.mailgun.org",
        subject: subject,
        text: content
      })
      return true

    }catch(error){
      return error
    }
  },
  saveTelegramUser(userId, usuario) {

    check([userId, usuario], [String])

    if(!Meteor.user() || !Roles.userIsInRole(Meteor.user()._id, "user")){
      return false
    }

    try{
      Meteor.users.update({_id: userId}, {$set: {"profile.telegram": usuario}})
      return true

    }catch(error) {
      return error
    }
  }
})

