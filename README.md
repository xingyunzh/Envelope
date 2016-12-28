# Camps

Cheat Sheet:

show collections

db.ideas.drop();
db.user.find({"age":22});
db.user.find({"age":{$gt:22}});

db.user.save({name:"ok", age:50});
db.user.update({age:25},{$set:{name:'ok2'}},false/upsert, true/multi);

db.users.remove({_id:"xxxxx"});