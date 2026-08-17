const jwt  = require('jsonwebtoken');

let privatekey= 'private.key'

let token = jwt.sign({
    data: 'very importat data'
}, 'secret', {expiresIn:'10s'});

console.log(token);

let decoded = jwt.verify(token, 'secret');

console.log(decoded);

// jwt.sign({foo:'bar'}, privatekey,{algorithm: 'RS256'}, function(err,token){
//     console.log(err);
// });
