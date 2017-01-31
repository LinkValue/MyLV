const express = require('express')
const path = require('path')

const app = express()

app.set('port', (process.env.PORT || 5050))

app.use(express.static(path.join(__dirname, '/dist')))

app.all('/*', (req, res) => res.sendFile(path.join(__dirname, '/dist/index.html')))

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})