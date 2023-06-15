(() => {
  const fromSelect = document.getElementById('select-from');
  const toSelect = document.getElementById('select-to');
  const numberConver = document.getElementById('conversion-amount')
  const total = document.getElementById('total')
  const selects = document.querySelectorAll('.currency-converter__select');
  const reversBtn = document.querySelector('currency-converter__btn');
  const formattedDate = document.getElementById('today');
  const tableApp = document.getElementById('table-body');
  const DEFAULT = 'Default';
  let timerId;

  // Получение данных API
  async function getData() {
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    return await response.json();
  }

  // Вызвана из HTML, получает данные с API, если они есть отправляет на перебор + ставит актуальную дату.
  async function api() {
    const serverData = await getData();
    if (serverData) {
      const currencyData = serverData.Valute;
      enumerationObjects(currencyData);
      today(formattedDate);
    }
  }

  // Перебор данных с API
  async function enumerationObjects(objsData) {
    Object.keys(objsData).forEach(key => {
      const innerObj = objsData[key];
      createOption(innerObj, fromSelect);
      createOption(innerObj, toSelect);
      createTableDesktop(innerObj, tableApp)
    });
    defaultSelect(toSelect);
    defaultSelect(fromSelect);
  };

  // Заполнение селектора и создание элементов на основе данных API
  function createOption(innerObj, container) {
    const elementOption = document.createElement('option');
    const elementSpan = document.createElement('span');

    elementOption.textContent = `${innerObj.Name} `;
    elementOption.value = innerObj.CharCode;
    elementSpan.textContent = innerObj.CharCode;

    elementOption.append(elementSpan);
    container.append(elementOption);
  }

  // Получаем дату с 0 если меньше 2 знаков
  function today(container) {
    const todayDate = new Date();
    const month = (todayDate.getMonth() + 1).toString().padStart(2, "0");
    const day = todayDate.getDate().toString().padStart(2, "0");
    container.textContent = `${day}.${month}.${todayDate.getFullYear()}`;
  }

  // Создание таблицы на десктоп.
  function createTableDesktop(innerObj, container) {
    const tr = document.createElement('tr');
    const tdCode = document.createElement('td');
    const img = document.createElement('img');
    const tdUnit = document.createElement('td');
    const tdCurrency = document.createElement('td');
    const tdRate = document.createElement('td');

    tr.classList.add('table__tr');
    tdCode.classList.add('table__td');
    img.classList.add('table__img')
    tdCurrency.classList.add('table__td');
    tdRate.classList.add('table__td');

    img.src = `img/${innerObj.CharCode}.svg`;
    img.alt = `Флаг страны ${innerObj.CharCode}`;

    tdCode.textContent = innerObj.CharCode;
    tdUnit.textContent = innerObj.Nominal;
    tdCurrency.textContent = innerObj.Name;
    tdRate.textContent = innerObj.Value;
    tdCode.prepend(img)
    tr.append(tdCode, tdUnit, tdCurrency, tdRate)
    container.append(tr);
  }

  // Кастомный селект
  function defaultSelect(select) {
    const choices = new Choices(select, {
      searchEnabled: true,
    });

    const ariaLabel = select.getAttribute('aria-label');
    select.closest('.choices').setAttribute('aria-label', ariaLabel);
    return choices;
  };

  // Конвертация суммы
  function conversion(value, fromValue, toValue, container) {
    container.textContent = fx(+value).from(fromValue).to(toValue);
  }

  // Событие с проверкой для отправки данных на конвертацию + задержка в 0.5s
  numberConver.addEventListener('input', () => {
    if (fromSelect.value !== DEFAULT && toSelect.value !== DEFAULT) {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        conversion(numberConver.value, fromSelect.value, toSelect.value, total);
      }, 500);
    }
  });

  // Доп проверка на селекторы если инпут введен раньше выбора
  selects.forEach(select => {
    select.addEventListener('change', () => {
      if (fromSelect.value !== DEFAULT && toSelect.value !== DEFAULT && numberConver.value) {
        conversion(numberConver.value, fromSelect.value, toSelect.value, total)
      }
    })
  })

  // reversBtn.addEventListener('click', () => {
  // })


  window.api = api;
})();
