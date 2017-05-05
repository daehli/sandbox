module.exports = function(bp){

  const getList = (callback) => {
    callback = callback || function() {}
    bp.db.get()
    .then(knex=>{
      return knex("categories_type").select()
    })
    .map(row=>{
      return row
    })
    .then(data=>{
      data = data || []
      callback(null,data)
    })
    .catch((err)=>{
      callback(err)
    })
  }

  const getIdCategory = (id,callback)=>{
    callback = callback || function() {}
    bp.db.get()
    .then(knex=>{
      return knex("categories_type").select().where("id",id)
    })
    .map(row=>{
      return row
    })
    .then(data=>{
      data = data || []
      callback(null,data)
    })
    .catch((err)=>{
      callback(err)
    })
  }

  const addRegister = (obj,callback) =>{
    obj = obj || {}
    bp.db.get()
    .then(knex=>{
      if (obj.image_url === undefined){
        obj.image_url = null
      }
      return knex.insert(
        {
          descriptor:obj.descriptor,
          amount:obj.amount,
          date:obj.date,
          image_url:obj.image_url,
          categorie_id:obj.categorie_id
        }).into("big_book")
    })
    .map(row=>{
      return row
    })
    .then(thx=>{
      thx = thx || []
      callback(null,thx)
    })
    .catch(err=>{
      callback(err)
    })
  }

  return {
    addRegister:addRegister,
    getList:getList,
    getIdCategory:getIdCategory

  }


}
