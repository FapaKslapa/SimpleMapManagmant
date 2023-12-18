/** 
Funzione per salvare i dati sulla cache remota
@param dict => dizionario da salvare 
@param key => chiave da utilizzare per salvare il dizionario
@return message => scrive in console il risultato della chiamata fetch
*/
export function salvaDati(dict, key) {
  fetch("https://ws.progettimolinari.it/cache/set", {
    method: "Post",
    headers: {
      "content-type": "application/json",
      key: "93bb2bf0-9b41-4066-971f-1ecbf8ce02fd",
    },
    body: JSON.stringify({
      key: key,
      value: JSON.stringify(dict),
    }),
  })
    .then((element) => element.json())
    .then((element) => console.log(element))
    .catch((error) => console.error(error));
}
/** 
Funzione per recuperare i dati dalla cache remota
@param key => chiave da utilizzare per recuperare il dizionario
@return promise => restituisce il dizionario se non compaiono errori, altrimenti restitusice l'error
*/
export function recuperaDati(chiave) {
  return new Promise((resolve, reject) => {
    fetch("https://ws.progettimolinari.it/cache/get", {
      method: "Post",
      headers: {
        "content-type": "application/json",
        key: "93bb2bf0-9b41-4066-971f-1ecbf8ce02fd",
      },
      body: JSON.stringify({ key: chiave }),
    })
      .then((element) => {
        resolve(element.json());
      })
      .catch((error) => reject(error));
  });
}
