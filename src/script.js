//import delle funzioni create in moduli separati
import { setLayers, setCenter, setZoom, addMarker, initOverlay, creaVector } from "./map.js";
import { validazioneForm } from "./validazioneForm.js";
import { salvaDati, recuperaDati } from "./cache.js";
import { zoomMappa, setCentro } from "./zoomMappa.js";

//dichiarazione e valorizzazione delle variabili e delle costanti
const container = document.getElementById('popup');
const latitudine = document.getElementById("Latitudine");
const longitudine = document.getElementById("Longitudine");
const nome = document.getElementById("Nome");
const button = document.getElementById("Aggiungi");
const darkMode = document.getElementById("darkMode");
const form = document.getElementById("form");
const divMarcatori = document.getElementById("puntatori");
const header = `
  <tr>
    <td>Nome</td>
    <td>Elimina</td>
    </tr>
  `;
const templatePuntatore = `
<tr>
  <td><p class="text-truncate">%NOME</p></td>
  <td>%BUTTON</td>
  </tr>
`;
const Chiave = "mappe";
const centroRoma = [12.4963655, 41.9027835];//coordinate Roma
const map = new ol.Map({
  target: document.querySelector('.map'),
  /*view: new ol.View({
    center: centroRoma,
    minZoom: 0,
    maxZoom: 15,
  })*/
});
let feature = [];
let totalLayer = [];
let marker = [];

//recupero i dati alla prima esecuzione dalla cache remota
recuperaDati(Chiave)
  .then((data) => {
    setLayers(map, darkMode.checked);
    marker = JSON.parse(data.result);
    marker.forEach(element => {
      const tmp = addMarker(map, { lonlat: [element.Longitudine, element.Latitudine], name: element.Nome });
      feature.push(tmp[0]);
      totalLayer.push(tmp[1]);
    })
    if (marker.length === 0) {
      setCenter(map, centroRoma);//setto il centro della mappa
      setZoom(map, 10);//Setto lo zoom 
    } else {
      setZoom(map, zoomMappa(centroRoma, marker));//Setto lo zoom 
      setCenter(map, setCentro(centroRoma, marker));//Setto il centro della mappa
    }
    //richiamo del render per visualizzare i puntatori inseriti
    render(marker, divMarcatori, feature, totalLayer, map, centroRoma);
  })
  .catch((error) => {
    console.log("Errore", error)
  });
initOverlay(map);




darkMode.addEventListener('change', e => {
  //gestione della darkmode della finestra
  if (darkMode.checked) {
    form.setAttribute("data-bs-theme", "dark");
    button.innerHTML = '<img width="30" height="30" src = "icon/place-dark.svg" alt = "Invia" >'
  } else {
    form.setAttribute("data-bs-theme", "white");
    button.innerHTML = '<img width="30" height="30" src = "icon/place-white.svg" alt = "Invia" >'
  }
  setLayers(map, darkMode.checked);
  initOverlay(map);
  for (let i = 0; i < marker.length; i++) {
    const tmp = addMarker(map, { lonlat: [marker[i].Longitudine, marker[i].Latitudine], name: marker[i].Nome }, feature, totalLayer);
    feature.push(tmp[0]);
    totalLayer.push(tmp[1]);
  }
  initOverlay(map);
  render(marker, divMarcatori, feature, totalLayer, map, centroRoma);
});


button.onclick = () => {
  //pressione del button invia
  if (validazioneForm(latitudine.value, longitudine.value, nome.value, latitudine, longitudine, nome, marker)) {
    //se la form è stata composta correttamente
    //creo il puntatore nella mappa e valorizzo gli array
    const tmp = addMarker(map, { lonlat: [longitudine.value, latitudine.value], name: nome.value }, feature, totalLayer);
    feature.push(tmp[0]);
    totalLayer.push(tmp[1]);
    container.classList.remove("displayNone");
    marker.push({
      Latitudine: latitudine.value,
      Longitudine: longitudine.value,
      Nome: nome.value
    })
    initOverlay(map);
    render(marker, divMarcatori, feature, totalLayer, map, centroRoma);
    setZoom(map, zoomMappa(centroRoma, marker));//Setto lo zoom 
    setCenter(map, setCentro(centroRoma, marker));//Setto lo zoom 
    longitudine.value = "";
    latitudine.value = "";
    nome.value = "";
  }
};

/** 
Funzione di render per far visualizzare il table dei puntatori
@param array
@param div
@param feature
@param totalLayer
@param map => oggetto contenente la mappa
@param roma => coordinate di Roma
*/
const render = (array, div, feature, totalLayer, map, roma) => {
  let html = header;
  if (array != []) {
    let numeroID = 0;
    array.forEach((element) => {
      html += templatePuntatore.replace("%NOME", element.Nome)
        .replace("%BUTTON", "<button type='button' class='btn btn-danger buttonElimina' id='" + numeroID + "'>Elimina </button>");
      numeroID++;
    });
    div.innerHTML = html;
    //verifico la pressione del button
    for (let i = 0; i < numeroID; i++) {
      const btnTemp = document.getElementById(i);
      btnTemp.onclick = () => {
        numeroID--;
        map.removeLayer(totalLayer[i]);
        array.splice(i, 1);
        feature.splice(i, 1);
        totalLayer.splice(i, 1);
        if (marker.length === 0) {
          setCenter(map, roma);//setto il centro della mappa
          setZoom(map, 10);//Setto lo zoom 
        } else {
          setZoom(map, zoomMappa(roma, marker));//Setto lo zoom 
          setCenter(map, setCentro(roma, marker));//setto il centro della mappa
        }
        render(array, div, feature, totalLayer, map, centroRoma);//richiamo la funzione per aggiornare la pagina e rimanere in attesa di prossimi button elimina premuti
      }
    }
    salvaDati(marker, Chiave);//salvo i dati modificati sulla cache remota
  }
}