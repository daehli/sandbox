module.exports = function(bp){

  // Creation of the table in the database
  var knex = bp.db.get().then(knex=>{
    knex.schema.createTableIfNotExists("categories_type",table=>{
      table.increments('id').primary()
      table.string("name") // change for name
      table.timestamps()
      table.integer('owner').unsigned()
      table.foreign('owner').references('user.id')
      table.unique("name","owner")
    })
    .then(res=>bp.logger.info("Initial Table categorie_type"))
    .catch(err=>{ bp.logger.info(err) })
    knex.schema.createTableIfNotExists('big_book',table=>{
      table.increments().primary()
      table.string("descriptor")
      table.float("amount",2)
      table.date("date")
      table.binary("image_url")
      table.integer('categorie_id').unsigned()
      table.foreign('categorie_id').references('categories_type.id')
      table.integer('owner').unsigned()
      table.foreign('owner').references('user.id')
    })
    .then(res=>{ bp.logger.info("Initial Table big_book") })
    .catch(err=>{ bp.logger.info(err) })
  })


  // Alter Table
  bp.db.get()
  .then(knex=>{
    knex.schema.alterTable("categories_type",table=>{
    })
    .then(()=>{ bp.logger.info("Alter Table categorie_type") })
    .catch(err=>{ bp.logger.info(err) })
    knex.schema.alterTable("big_book",table=>{
    })
    .then(res=>{ bp.logger.info("ALTER TABLE big_book") })
    .catch(err=>{ bp.logger.info(err) })
  })
}
