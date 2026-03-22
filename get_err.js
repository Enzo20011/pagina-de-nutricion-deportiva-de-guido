const fs = require('fs');
fetch('http://localhost:3008/sobre-mi')
  .then(res => res.text())
  .then(text => fs.writeFileSync('error_log.html', text))
  .catch(console.error);
