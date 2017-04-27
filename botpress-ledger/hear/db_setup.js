module.exports = function(bp){

  // Creation of the table in the database
  var knex = bp.db.get().then(knex=>{
    knex.schema.createTableIfNotExists("categories_type",table=>{
      table.increments('id').primary();
      table.string("name").unique(); // change for name
      table.timestamps();
    })
    .then(res=>bp.logger.info("Initial Table categorie_type"))
    .catch(err=>{bp.logger.info(err)})
    knex.schema.createTableIfNotExists('big_book',table=>{
      table.increments().primary();
      table.string("descriptor");
      table.float("amount",2);
      table.date("date");
      table.integer('categorie_id').unsigned();
      table.foreign('categorie_id').references('categorie_type.id')
    })
    .then(res=>{bp.logger.info("Initial Table big_book")})
    .catch(err=>{bp.logger.info(err)})
  })


  // Alter Table
  bp.db.get()
  .then(knex=>{
    knex.schema.alterTable("categories_type",table=>{
    })
    .then(()=>{bp.logger.info("Alter Table categorie_type")})
    .catch(err=>{bp.logger.info(err)})
    knex.schema.alterTable("big_book",table=>{
      // Nothing for now
    })
    .then(res=>{bp.logger.info("ALTER TABLE big_book")})
    .catch(err=>{bp.logger.info(err)})
  })
}
