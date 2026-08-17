const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync('B4c0/\/', salt);
const hash2 = bcrypt.hashSync("bacon",10);

// bcrypt.compare('B4c0/\/', hash)
// .then(result =>{console.log(result);
// })

console.log(bcrypt.compareSync('bacon', hash2));
