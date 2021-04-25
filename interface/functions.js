const countInstances = (string, Word) => string.split(Word).length - 1;

const getPosition = (string, subString, index) => string.split(subString, index).join(subString).length;

const xmlToJson = (xml) => {
    let xmlFinal = '';
    for(let i = 0; i < xml.length; i += 2) {
        xmlFinal += xml[i];
    }
    let result = {};
    let result0 = {};
    let result1 = {};
    let continuar = true;
    let valor1 = '';
    let nodo1 = '';
    let inicio0 = xmlFinal.indexOf('<');
    let final0 = xmlFinal.indexOf('>');
    let nodo0 = xmlFinal.substring(inicio0 + 1, final0);
    let valor0 = xmlFinal.substring(final0 + 1, xmlFinal.indexOf(`</${nodo0}>`));
    for(let i = 1; i <= countInstances(valor0, '<'); i += 2) {
        let inicio = getPosition(valor0, '<', i);
        let final = getPosition(valor0, '>', i);
        let nodo = valor0.substring(inicio + 1, final);
        let valor = valor0.substring(final + 1, valor0.indexOf(`</${nodo}>`));
        if(valor.indexOf('<') > -1 && valor.indexOf('>') > -1 && valor.indexOf('</') > -1) {
            if(continuar) {
                continuar = false;
                valor1 = valor;
                nodo1 = nodo;
            }
        } else {
            if(nodo === '___database___' || nodo === '___table___' || nodo === '___transaction___'||
            nodo === '___client_host___' || nodo === '___database_host___' || nodo === '___database_user___' ||
            nodo === '___database_time___' || nodo === '___application_time___' || nodo === '___application_user___')
            result[nodo.replace('___', '').replace('___', '')] = valor;
            else result0[nodo] = valor;
        }
    }
    result[nodo0] = result0;
    for(let i = 1; i <= countInstances(valor1, '<'); i += 2) {
        let inicio = getPosition(valor1, '<', i);
        let final = getPosition(valor1, '>', i);
        let nodo = valor1.substring(inicio + 1, final);
        let valor = valor1.substring(final + 1, valor1.indexOf(`</${nodo}>`));
        result1[nodo] = valor;
    }
    if(nodo1 !== '') result[nodo1] = result1;
    return result;
}

module.exports = { xmlToJson }