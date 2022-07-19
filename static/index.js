/* eslint-disable max-depth */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
/* eslint-disable-next-line max-depth */

function validateOraberar() {
  const ar = document.getElementById('arID').value;
  if (ar < 1) {
    document.getElementById('submitUjPalya').disabled = true;
    document.getElementById('ar').removeAttribute('hidden');
    return false;
  }
  document.getElementById('ar').setAttribute('hidden', 'hidden');
  return true;
}

function validateIMG() {
  const name = document.getElementById('kep').value.split('.');

  if (name[name.length - 1] !== 'jpg' && name[name.length - 1] !== 'png' && name[name.length - 1] !== 'jpeg') {
    document.getElementById('submitImage').disabled = true;
    document.getElementById('kephiba').removeAttribute('hidden');
    return false;
  }
  document.getElementById('kephiba').setAttribute('hidden', 'hidden');
  return true;
}

function submitUjPalyaAvalibe() {
  const palya = document.getElementById('palyatipus').value;
  const ar = document.getElementById('arID').value;
  const cim = document.getElementById('cim').value;
  const leiras = document.getElementById('leiras').value;
  if (palya === '' || ar <= 0 || cim === '' || leiras === '' || validateOraberar() === false) {
    document.getElementById('submitUjPalya').disabled = true;
  } else {
    document.getElementById('submitUjPalya').disabled = false;
  }
}

function submitImageAvalibe() {
  const name = document.getElementById('kep').value;

  if (name === '' || validateIMG() === false) {
    document.getElementById('submitImage').disabled = true;
  } else {
    document.getElementById('submitImage').disabled = false;
  }
}

function submitFoglalasAvalibe() {
  const palyaid = document.getElementById('palyavalaszto').value;
  const ido = document.getElementById('ido').value;

  if (palyaid === '' || ido === '') {
    document.getElementById('submitFoglalas').disabled = true;
  } else {
    document.getElementById('submitFoglalas').disabled = false;
    document.getElementById('foglalasok').innerText = '';
    displayReservations();
  }
}

function detailsOnload(role) {
  showSlides(1);
  loggedIn(role);
  const roleTmp = parseInt(role, 10);
  if (roleTmp > -1) {
    if (roleTmp === 0) {
      document.getElementById('kepfeltoltes-id').removeAttribute('hidden');
    } else {
      document.getElementById('kepfeltoltes-id').setAttribute('hidden', 'hidden');
    }
  } else {
    document.getElementById('kepfeltoltes-id').setAttribute('hidden', 'hidden');
  }
}

function showSlides(n) {
  let i;
  const slides = document.getElementsByClassName('slide');
  if (slides.length > 0) {
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }

    for (i = 0; i < slides.length; i += 1) {
      slides[i].style.display = 'none';
    }

    slides[slideIndex - 1].style.display = 'block';
  }
}

let slideIndex = 1;

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

async function deleteReservationFromList(reservationID) {
  console.log(reservationID);
  const reservationToDel = document.getElementById(`reservation-${reservationID}`);
  try {
    const result = await fetch(`/message/${reservationID}/message/${reservationID}`, {
      method: 'DELETE',
    });
    if (result.status === 204) {
      reservationToDel.remove();
      console.log('Sikeres torles');
      document.getElementById('reservationsMessage').innerText = 'Sikeres torles!';
    } else {
      console.log('Error!');
      document.getElementById('reservationsMessage').innerText = 'Sikertelen torles! Problema a szerver oldalon.';
    }
  } catch (err) {
    console.log('Error!');
    document.getElementById('reservationsMessage').innerText = 'Sikertelen torles!';
  }
}

let isDisplayed = 0;

async function displayList(palyaID, role) {
  if (isDisplayed === 0) {
    try {
      const result = await fetch(`/message/${parseInt(palyaID, 10)}/message/${parseInt(palyaID, 10)}`);
      const reservations = await result.json();
      if (result.status !== 500) {
        for (let i = 0; i < reservations.a.length; i += 1) {
          const dateTime = reservations.a[i].idopont.split('T');
          const time = dateTime[1].split(':');
          let idopont = dateTime[1];
          if (time[0] === '23') {
            idopont = idopont.concat(`-00:${time[1]}`);
          } else {
            const tmp = parseInt(time[0], 10) + 1;
            idopont = idopont.concat(`-${tmp}:${time[1]}`);
          }
          if (reservations.userID === reservations.a[i].felhasznaloID
            || parseInt(role, 10) === 0) {
            const li = document.createElement('li');

            let att = document.createAttribute('id');
            att.value = `reservation-${reservations.a[i].foglalasID}`;
            li.setAttributeNode(att);
            li.innerText = `Datum: ${dateTime[0]}, Idopont: ${idopont}, FelhasznaloID: ${reservations.a[i].felhasznaloID} `;

            const button = document.createElement('input');
            att = document.createAttribute('type');
            att.value = 'button';
            button.setAttributeNode(att);

            att = document.createAttribute('onclick');
            att.value = `deleteReservationFromList(${reservations.a[i].foglalasID})`;
            button.setAttributeNode(att);

            att = document.createAttribute('value');
            att.value = 'Torles';
            button.setAttributeNode(att);

            li.appendChild(button);

            document.getElementById(`reservations-${palyaID}`).appendChild(li);
            document.getElementById(`reservations-${palyaID}`).appendChild(document.createElement('br'));
          }
        }
        isDisplayed = 1;
      } else {
        document.getElementById('reservationsMessage').innerText = 'Sikertelen megjelenites! Problema a szerver oldalon.';
      }
    } catch (err) {
      console.log(err);
      document.getElementById('reservationsMessage').innerText = 'Sikertelen megjelenites!';
    }
  }
}

async function displayReservations() {
  const palyaID = document.getElementById('palyavalaszto').value;
  if (palyaID) {
    const ido = document.getElementById('ido').value.split('T');
    try {
      const result = await fetch(`/message/${parseInt(palyaID, 10)}/message/${parseInt(palyaID, 10)}`);
      const reservations = await result.json();
      console.log(reservations);
      if (result.status !== 500) {
        for (let i = 0; i < reservations.a.length; i += 1) {
          const dateTime = reservations.a[i].idopont.split('T');
          const time = dateTime[1].split(':');
          let idopont = dateTime[1];
          if (time[0] === '23') {
            idopont = idopont.concat(`-00:${time[1]}`);
          } else {
            const tmp = parseInt(time[0], 10) + 1;
            idopont = idopont.concat(`-${tmp}:${time[1]}`);
          }

          if (ido[0] === dateTime[0]) {
            const li = document.createElement('li');

            const att = document.createAttribute('id');
            att.value = `reservation-${reservations.a[i].foglalasID}`;
            li.setAttributeNode(att);
            li.innerText = `Datum: ${dateTime[0]}, Idopont: ${idopont}`;

            document.getElementById('foglalasok').appendChild(li);
            document.getElementById('foglalasok').appendChild(document.createElement('br'));
          }
        }
      } else {
        document.getElementById('foglalasListaHiba').innerText = 'Sikertelen megjelenites! Problema a szerver oldalon.';
      }
    } catch (err) {
      console.log(err);
      document.getElementById('foglalasListaHibae').innerText = 'Sikertelen megjelenites!';
    }
  }
}

function loggedIn(role) {
  isDisplayed = 0;
  const roleTmp = parseInt(role, 10);
  if (roleTmp > -1) {
    document.getElementById('logout-id').removeAttribute('hidden');
    document.getElementById('name-id').removeAttribute('hidden');
    document.getElementById('login-id').setAttribute('hidden', 'hidden');
    document.getElementById('foglalas-id').removeAttribute('hidden');
    if (roleTmp === 0) {
      document.getElementById('feltoltes-id').removeAttribute('hidden');
      document.getElementById('kepfeltoltes-id').removeAttribute('hidden');
    } else {
      document.getElementById('feltoltes-id').setAttribute('hidden', 'hidden');
      document.getElementById('kepfeltoltes-id').setAttribute('hidden', 'hidden');
    }
  } else {
    document.getElementById('logout-id').setAttribute('hidden', 'hidden');
    document.getElementById('name-id').setAttribute('hidden', 'hidden');
    document.getElementById('login-id').removeAttribute('hidden');
    document.getElementById('foglalas-id').setAttribute('hidden', 'hidden');
    document.getElementById('feltoltes-id').setAttribute('hidden', 'hidden');
    document.getElementById('kepfeltoltes-id').setAttribute('hidden', 'hidden');
  }
}
