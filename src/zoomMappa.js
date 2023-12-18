/** 
Funzione per calcolare il massimo in un array
@param array
@return valore => valore massimo nell'array
*/
const calcolaMassimo = (array) => {
  return Math.max(...array);
}
/** 
Funzione per calcolare il minimo in un array
@param array
@return valore => valore minimo nell'array
*/
const calcolaMinimo = (array) => {
  return Math.min(...array);
}

/** 
Funzione che divide un array di dizionari in un array di array contenente i valori presenti nei singoli dizionari
@param arrayDizionari => array contenente i dizionari da dividere
@return [array1, array2, array3] => ritorna un array di array
*/
const dividiDizionario = (arrayDizionari) => {
  //array che conterranno i valori nei dizionari
  const nome = [];
  const latitudine = [];
  const longitudine = [];
  if (arrayDizionari.length > 0) {//se l'array di dizionari ha almeno un valore
    for (let i = 0; i < arrayDizionari.length; i++) {
      const dizionarioTemp = arrayDizionari[i];//recupero il dizionario in posizione i
      const lunghezza = Object.keys(dizionarioTemp).length;//recupero la sua lunghezza
      if (lunghezza == 3) {//se ha tre valori
        //inserisco i valori nei rispettivi array
        nome.push(dizionarioTemp.Nome);
        latitudine.push(dizionarioTemp.Latitudine);
        longitudine.push(dizionarioTemp.Longitudine);
      } else //altrimenti stampa in console un messaggio di errore
        console.error("Il dizionario in posizione " + i + " non ha tre elementi");
    }
  } else {//se l'array è vuoto restituisce un errore
    console.error("Il dizionario inserito è vuoto");
  }
  return [nome, latitudine, longitudine];//restituisco un array di array
}

/** 
Funzione per convertire i gradi in radianti
@param gradi => gradi da convertire
@return radianti => gradi * (Math.PI / 180)
*/
const convertiInRadianti = (gradi) => {
  return gradi * (Math.PI / 180);
}

/** 
Funzione per convertire i radianti in gradi
@param raf => radianti da convertire
@return gradi => radianti * (180 / Math.PI)
*/
const convertiInGradi = (rad) => {
  return rad * (180 / Math.PI);
}

/** 
Funzione per calcolare la latitudine e longitudine a metà tra due punti
@param lat1 => latitudine 1
@param lon1 => longitudine 1
@param lat2 => latitudine 2
@param lon2 => longitudine 2
@return array => contiene il punto a metà tra i due punti [longitudine, latitudine]
*/
export const calcolaMetà = (lat1, lon1, lat2, lon2) => {
  lat1 = convertiInRadianti(lat1);
  lat2 = convertiInRadianti(lat2);
  lon1 = convertiInRadianti(lon1);
  lon2 = convertiInRadianti(lon2);

  const latMedia = (lat1 + lat2) / 2;
  const lonMedia = (lon1 + lon2) / 2;
  const latMediaGrad = convertiInGradi(latMedia);
  const lonMediaGrad = convertiInGradi(lonMedia);
  return [lonMediaGrad, latMediaGrad];
}

/** 
Funzione per calcolare la distanza tra due punti
@param punto1 => array longitudine e latitudine punto 1
@param punto2 => array longitudine e latitudine punto 2
@return distanza tra i due punti
*/

const calcolaDistanza = (punto1, punto2) => {
  //puntoX[0] = longitudine
  //puntoX[1] = latitudine
  const cateto1 = punto1[0] - punto2[0];
  const cateto2 = punto1[1] - punto2[1];
  return Math.sqrt((cateto1 ** 2) + (cateto2 ** 2));
}


/** 
Funzione per calcolare il valore di zoom della mappa
@param dizionarioMarcatori => dizionario con tutti i marcatori inseriti
@return valZoom => restituisce il valore dello zoom da applicare alla mappa
*/
export const zoomMappa = (centroRoma, dizionarioMarcatori) => {
  let distanzaMax = 0;
  dizionarioMarcatori.forEach(marcatore => {
    const distanzaTemp = calcolaDistanza([marcatore.Longitudine, marcatore.Latitudine], centroRoma);
    if (distanzaTemp > distanzaMax) {
      distanzaMax = distanzaTemp;
    }
  });
  const zoom = Math.abs(10 - (Math.log(distanzaMax) * 1.75));
  return zoom;
}

/** 
Funzione per centrare il punto rispetto a roma
@param centroRoma => coordinate longitudine e latitudine del centro di Roma
@param dizionarioMarcatori => array che contiene i marcatori inseriti
@return arrray => longitudine e latitudine centrale
*/
export const setCentro = (centroRoma, dizionarioMarcatori) => {
  let centro = -1;
  if (dizionarioMarcatori.length > 0) {//se l'array di dizionari è pieno
    const dizionarioDiviso = dividiDizionario(dizionarioMarcatori);//creazione dell'array contenente i valori delle chiavi dei dizionari
    //se i dizionari sono stati divisi correttamente
    if (dizionarioDiviso[0].length > 1 && dizionarioDiviso[1].length > 1 && dizionarioDiviso[2].length > 1) {
      const latitudineMax = calcolaMassimo(dizionarioDiviso[1]);
      const longitudineMax = calcolaMassimo(dizionarioDiviso[2]);
      const latitudineMin = calcolaMinimo(dizionarioDiviso[1]);
      const longitudineMin = calcolaMinimo(dizionarioDiviso[2]);
      //calcolo della latitudine e longitudine che separano i due punti 
      centro = calcolaMetà(latitudineMax, longitudineMax, latitudineMin, longitudineMin);
    } else if (dizionarioDiviso[0].length == 1 && dizionarioDiviso[1].length == 1
      && dizionarioDiviso[2].length == 1) {
      dizionarioDiviso[0].push("Roma");
      dizionarioDiviso[1].push(String(centroRoma[1]));
      dizionarioDiviso[2].push(String(centroRoma[0]));
      const latitudineMax = calcolaMassimo(dizionarioDiviso[1]);
      const longitudineMax = calcolaMassimo(dizionarioDiviso[2]);
      const latitudineMin = calcolaMinimo(dizionarioDiviso[1]);
      const longitudineMin = calcolaMinimo(dizionarioDiviso[2]);
      centro = calcolaMetà(latitudineMax, longitudineMax, latitudineMin, longitudineMin);
    }
    return centro;
  }
}