export const creaForm = (controllo) => {
  if (!controllo) {
    return `
      <div class="form-floating">
        <input type="number" id="Latitudine" name="Latitudine" value="" class="form-control border-dark"
          required>
        <label for="Latitudine">Latitudine</label>
      </div>
      <br>
      <div class="form-floating">
        <input type="number" id="Longitudine" name="Longitudine" value="" class="form-control border-dark"
          required>
        <label for="Longitudine">Longitudine</label>
      </div>
      <br>
      <div class="form-floating">
        <input type="text" id="Nome" name="Nome" value="" class="form-control border-dark" required>
        <label for="Nome">Nome puntatore</label>
      </div>
      <br>
          `
  } else {
    return `
      <div class="form-floating">
        <input type="text" id="indirizzo" name="indirizzo" value="" class="form-control border-dark"
          required>
        <label for="indirizzo">Indirizzo completo</label>
      </div>
      <br>
      <div class="form-floating">
        <input type="text" id="Nome" name="Nome" value="" class="form-control border-dark" required>
        <label for="Nome">Nome puntatore</label>
      </div>
      <br>
    `
  }
}