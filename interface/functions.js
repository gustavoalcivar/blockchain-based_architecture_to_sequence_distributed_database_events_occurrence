const countInstances = (string, Word) => string.split(Word).length - 1;

const getPosition = (string, subString, index) => string.split(subString, index).join(subString).length;

const xmlToJson = (xml) => {
    let xmlFinal = '';
    for(let i = 0; i < xml.length; i += 2) {
        xmlFinal += xml[i];
    }
    xmlFinal = xmlFinal.substring(xmlFinal.indexOf('>') + 1, xmlFinal.indexOf(`</${xmlFinal.substring(xmlFinal.indexOf('<') + 1, xmlFinal.indexOf('>'))}>`));
    result = {};
    for(let i = 1; i <= countInstances(xmlFinal, '<'); i += 2)
    {
        let inicio = getPosition(xmlFinal, '<', i);
        let final = getPosition(xmlFinal, '>', i);
        let nodo = xmlFinal.substring(inicio + 1, final);
        let valor = xmlFinal.substring(final + 1, xmlFinal.indexOf(`</${nodo}>`));
        result[nodo] = valor;
    }
    return result;
}

module.exports = { xmlToJson }