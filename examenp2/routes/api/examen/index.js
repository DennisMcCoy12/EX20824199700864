var express = require('express');
var router = express.Router();

function initMangaApi(db)
{

    var exaModel = require('./examen.model')(db);

    router.get('/all', function(req, res){
        exaModel.getAllMangas((err, mangas)=>{
          if(err){
            res.status(404).json([]);
          } else {
            res.status(200).json(mangas);
          }
        });
      });

      router.post('/new', function(req, res)
        {
            if (req.user.roles.findIndex((o)=>{return o=="public"}) == -1) 
            {
            return res.status(401).json({"error":"Sin privilegio"});
            }

            var newMan = Object.assign(
            {},
            req.body,
            { 
                "Nombre":req.body.nombre,
                "Autor":req.body.autor,
                "PaisOrigen":req.body.paisOrigen,
                "NumeroTomos": parseInt(req.body.numTomos),
                "Estado": req.body.estado,
                "KeyWords": req.body.keywords.split("/", 3),
                "Categorias":req.body.categorias.split("/", 3),
                "createdBy": req.user
            }
            );
            exaModel.saveNewManga(newMan, (err, rslt)=>{
            if(err){
                res.status(500).json(err);
            }else{
                res.status(200).json(rslt);
            }
            });
        });

    router.put('/update/:manid',
        function(req, res)
        {
        var manIdToModify = req.params.manid;
        var estadoAct= req.body.estado;
        if(estadoAct!=="Ongoing" || estadoAct!=="Completed" || 
        estadoAct!=="Hiatsu" || estadoAct!=="Dicontinued"){
            estadoAct="Undefined";
        }
        exaModel.updateManga(
            {estado:estadoAct}, manIdToModify,
            (err, rsult)=>{
            if(err){
                res.status(500).json(err);
            }else{
                res.status(200).json(rsult);
            }
            }
            );
        }
        );


    return router;
}

module.exports = initMangaApi;