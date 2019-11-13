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

    return mangaModel;
}
module.exports = mangasModel;