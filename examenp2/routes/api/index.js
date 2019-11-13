var express = require('express');
var router = express.Router();

var passport = require('passport');
var passportJWT = require('passport-jwt');
var ExtractJWT = passportJWT.ExtractJwt;
var JWTStrategy = passportJWT.Strategy;

function initApiRouter(db){

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'unexamendelsegundoparcial201903'
    },
    (payload, next)=>{
      var user = payload;
      return next(null, user);
    }
  )
);


//Rutas de Cada Entidad
var securityApiRoutes = require('./security/index')(db);

//localhost:3000/api/sec/
router.use('/sec', securityApiRoutes);


//localhost:3000/api/exa


return router;
}// end initApiRouter;

//module.exports = router;
module.exports = initApiRouter;
