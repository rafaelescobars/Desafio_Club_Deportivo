const url = require('url');
const http = require('http');
const fs = require('fs');

//Crear una ruta que reciba el nombre y precio de un nuevo deporte, lo persista en un archivo JSON.
http.createServer((req, res) => {

    if (req.url == '/') {
      res.setHeader('content-type', 'text/html')
      fs.readFile('index.html', 'utf8', (err, data) => {
        res.write(data)
        res.end()
      })
    }

    if (req.url.startsWith('/agregar')) {
      const {
        nombre,
        precio
      } = url.parse(req.url, true).query
      const deporte = {
        nombre,
        precio
      }
      let data = JSON.parse(fs.readFileSync('Deportes.json', 'utf8'))
      let deportes = data.deportes
      deportes.push(deporte)
      fs.writeFileSync('Deportes.json', JSON.stringify(data))
      res.end('Deporte agregado con éxito.')
    }

    if (req.url.startsWith('/deportes')) {
      fs.readFile('Deportes.json', 'utf8', (err, data) => {
        res.write(data)
        res.end()
      })
    }

    if (req.url.startsWith('/editar')) {
      const {
        nombre,
        precio
      } = url.parse(req.url, true).query
      fs.readFile('Deportes.json', 'utf8', (err, data) => {
        let dataJson = JSON.parse(data)
        deportes = dataJson.deportes

        const deportesEditado = deportes.map(deporte => {
          if (deporte.nombre == nombre) {
            return {
              nombre,
              precio
            }
          } else {
            return deporte
          }
        })

        dataJson.deportes = deportesEditado

        fs.writeFileSync('Deportes.json', JSON.stringify(dataJson))
        res.end('Deporte editado con éxito.')

      })
    }

    if (req.url.startsWith('/eliminar')) {
      const {
        nombre
      } = url.parse(req.url, true).query
      fs.readFile('Deportes.json', 'utf8', (err, data) => {
        const dataJson = JSON.parse(data)
        const deportes = dataJson.deportes

        const deportesEditado = deportes.filter(deporte => deporte.nombre != nombre)

        dataJson.deportes = deportesEditado

        fs.writeFileSync('Deportes.json', JSON.stringify(dataJson))
        res.end('Deporte eliminado con éxito.')

      })
    }


  })
  .listen(3000, () => console.log('Escuchando el puerto 3000'))