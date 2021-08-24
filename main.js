const axios = require('axios');
const { exception } = require('console');
const fs = require('fs');
const http = require('http');

async function getDataFromProveedoresServer() {
    const respP = await axios.get('https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json');
    console.log(respP.data);
    return respP.data;
}

async function getDataFromClientesServer() {
    const respC = await axios.get('https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json');
    console.log(respC.data);
    return respC.data;
}

async function htmlWrite(json, tipo) {
    try {
        const data = fs.readFileSync('index.html', 'utf8');
        let topSection = data.substring(0, data.indexOf('<h1>'));
        topSection += "<h1 align='center'> Listado de " + tipo + "</h1> \n <table class='table table-striped'> \n <tr";
        for (let index = 0; index < json.length; index++) {
            if (tipo === 'clientes') {
                const id = json[index]['idCliente'];
                const nombre = json[index]['NombreCompania'];
                const contacto = json[index]['NombreContacto'];
                let respuesta = `\n<tr>\n<th scope='row'>${id}</th>\n<td>${nombre}</td>\n<td>${contacto}</td>\n`;
                topSection += respuesta;
            } else {
                const id = json[index]['idproveedor'];
                const nombre = json[index]['nombrecompania'];
                const contacto = json[index]['nombrecontacto'];
                let respuesta = `\n<tr>\n<th scope='row'>${id}</th>\n<td>${nombre}</td>\n<td>${contacto}</td>\n`;
                topSection += respuesta;
            }
        }
        let bottomSection = data.substring(0, data.indexOf('</html>'));
        topSection += bottomSection;
        return topSection;
    } catch (err) {
        console.error(err);
    }
}

http
    .createServer(async function(req, res) {
        console.log('req', req.url);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        if (req.url == "/api/clientes") {
            const json = await getDataFromClientesServer();
            var rta = await htmlWrite(json, "clientes");
        } else if (req.url == "/api/proveedores") {
            const json = await getDataFromProveedoresServer();
            var rta = await htmlWrite(json, "proveedores");
        }
        res.end(rta);
    })
    .listen(8081);