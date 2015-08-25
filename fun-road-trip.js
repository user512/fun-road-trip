

Chats = new Mongo.Collection('chats');

if (Meteor.isClient) {
  Meteor.subscribe("chats");  // This is to subscribe the server side data

  Template.body.helpers({
    chats: function() {
        return Chats.find();
    }
  });

  Template.body.events({
    'submit .new-chat': function(event) {
      event.preventDefault();
      var title = event.target.title.value;
      if (title[0].value !== null){
        Meteor.call("addChat", title);
      }
      event.target.title.value = "";
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.publish("chats", function(){
    return Chats.find({  //This is Mongo DB query
      $or: [
        { private: {$ne: true} },  //$ne means not equal in MongoDB
        { owner: this.userId }
      ]
    });
  });
}


Meteor.methods({
  addChat: function(title){
    Chats.insert(
    {
        title: title,
        createdAt: new Date(),
        owner: Meteor.userId()
    }
    );
  },

  updateChat: function(id, checked) {
    Chats.update(id, {$set: {checked: checked}});
  },

  deleteChat: function(id){
    Chats.remove(id);
  },

  setPrivate: function(id, private){
    var task = Chats.findOne(id);

    if (task.owner !== Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }
    Chats.update(id, {$set: {private: private}});
  }
});