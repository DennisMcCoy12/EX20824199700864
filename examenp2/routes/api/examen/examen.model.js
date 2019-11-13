var ObjectId = require('mongodb').ObjectId;
var IndexVerified = false;

function mangasModel(db)
{
    let mangaModel = {};
    var mangasCollection = db.collection("manga");

    if ( !IndexVerified) {
        mangasCollection.indexExists("codigo_1", (err, rslt)=>{
        if(!rslt){
            mangasCollection.createIndex(
            { "codigo": 1 },
            { unique: true, name:"codigo_1"},
            (err, rslt)=>{
                console.log(err);
                console.log(rslt);
            });
        }
        });
    }

    mangaModel.getAllMangas = (handler)=>
    {
        mangasCollection.find({}).toArray(
          (err, docs)=>{
            if(err)
            {
              console.log(err);
              return handler(err, null);
            }
            return handler(null, docs);
          }
        );
    }

    mangaModel.saveNewManga = (newManga, handler)=>
    {
        mangasCollection.insertOne(newManga, (err, result)=>
        {
          if(err)
          {
            console.log(err);
            return handler(err, null);
          }
          return handler(null, result);
        });
    }

    mangaModel.updateManga = (updateFields, mangaId, handler)=>{
        let mangaFilter = {"_id": new ObjectId(mangaId)};
        let updateObject = {
          "$set": {
                    "estado": updateFields.estado,
                    "dateModified":new Date().getTime()
                }
    };
    mangasCollection.updateOne(
        mangaFilter,
        updateObject,
        (err, rslt)=>{
          if(err){
            console.log(err);
            return handler(err, null);
          }
          return handler(null, rslt);
        }
      );
    };

    mangaModel.deleteMangas = (id, handler)=>
    {
      var query = {"_id": new ObjectId(id)};
      mangasCollection.deleteOne(query, (err, rslt)=>{
          if(err)
          {
            console.log(err);
            return handler(err, null);
          }
          return handler(null, rslt);
      })
    }

    return mangaModel;
}
module.exports = mangasModel;