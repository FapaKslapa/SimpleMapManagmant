/** 
Funzione per validare la form con i dati inseriti, se non è corretto cambia il colore del bordo dell'input corrispondente all'errore
@param latitudine => valore
@param longitudine => valore
@param nome => valore
@param inLatitudine => oggetto input latitudine 
@param inLongitudine => oggetto input longitudine
@param inNome => oggetto input nome
@param array => array di input
@return boolean => true se la form è corretta, false se c'è stato qualche errore assieme al cambio di colore dell'input errato
*/
export const validazioneForm = (latitudine, longitudine, nome, inLatitudine, inLongitudine, inNome, array) => {
  //condizioni
  const condizioneLatitudine = latitudine < 90 && latitudine > 0;
  const condizioneLongitudine = longitudine < 180 && longitudine > 0;
  const condizioneNome = nome.length > 0;
  const puntoPresente = presente(longitudine, latitudine, nome, array);
  //verifica delle condizioni
  if (condizioneLatitudine && condizioneLongitudine && condizioneNome && !puntoPresente) {
    if (inNome.classList.contains("border-danger")) {//verifico la presenza di una classe
      //cambio della classe 
      inNome.classList.remove("border-danger");
      inNome.classList.remove("border-3");
      inNome.classList.add("border-dark");
    }
    if (inLatitudine.classList.contains("border-danger")) {//verifico la presenza di una classe
      //cambio della classe 
      inLatitudine.classList.remove("border-danger");
      inLatitudine.classList.remove("border-3");
      inLatitudine.classList.add("border-dark");
    }
    if (inLongitudine.classList.contains("border-danger")) {//verifico la presenza di una classe
      //cambio della classe 
      inLongitudine.classList.remove("border-danger");
      inLongitudine.classList.remove("border-3");
      inLongitudine.classList.add("border-dark");
    }
    return true;
  } else {
    //se non va bene il nome o il punto è presente
    if (!condizioneNome || puntoPresente) {
      if (inNome.classList.contains("border-dark")) {//verifico la presenza di una classe
        inNome.classList.remove("border-dark");
        inNome.classList.add("border-danger");
        inNome.classList.add("border-3");
      }
    }

    //se non va bene la latitudine o il punto è presente
    if (!condizioneLatitudine || puntoPresente) {
      if (inLatitudine.classList.contains("border-dark")) {//verifico la presenza di una classe
        inLatitudine.classList.remove("border-dark");
        inLatitudine.classList.add("border-danger");
        inLatitudine.classList.add("border-3");
      }
    }

    //se non va bene la longitudine o il punto è presente
    if (!condizioneLongitudine || puntoPresente) {
      if (inLongitudine.classList.contains("border-dark")) {//verifico la presenza di una classe
        inLongitudine.classList.remove("border-dark");
        inLongitudine.classList.add("border-danger");
        inLongitudine.classList.add("border-3");
      }
    }
    return false;
  }
}

/** 
Funzione che verifica se esiste già un punto prima di inserirlo nell'array
@param longitudine => longitudine del punto da inserire
@param latitudine => latitudine del punto da inserire
@param array => array di punti inseriti
*/
const presente = (longitudine, latitudine, array) => {
  //ricerca degli stessi valori
  for (let i = 0; i < array.length; i++) {
    const dizTemp = array[i];
    const latitudineEquals = latitudine == dizTemp.Latitudine;
    const longitudineEquals = longitudine ==
      dizTemp.Longitudine;
    if (latitudineEquals && longitudineEquals)
      //se trova il punto restituisce true
      return true;
  }
  //se non trova nulla restituisce false
  return false;
}