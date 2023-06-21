(() => {
  const mainPage = document.getElementById('page');
  const fromSelect = document.getElementById('select-from');
  const toSelect = document.getElementById('select-to');
  const conversionAmount = document.getElementById('conversion-amount');
  const total = document.getElementById('total');
  const selects = document.querySelectorAll('.currency-converter__select');
  const formattedDate = document.getElementById('today');
  const tableApp = document.getElementById('table-body');
  const reverseBtn = document.getElementById('reverse-btn');
  const closeBtn = document.querySelector('.currency-converter__btn-close');
  const loading = document.getElementById('loading');
  const strips = document.querySelectorAll('.spinner__strip');
  const screenWidth = window.matchMedia("(max-width: 1024px)");
  const screenWidthMobileBtn = window.matchMedia("(max-width: 576px)");
  const defaultValue = 'Default';
  let timerId;

  // Получение данных API
  async function getData() {
    const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
    return await response.json();
  }

  // Вызвана из HTML, получает данные с API, если они есть отправляет по функциям, ставит актуальную дату и снимаем загрузочный экран.
  async function api() {
    const serverData = await getData();
    if (serverData) {
      const currencyData = serverData.Valute;
      goToCreateSelect(currencyData, selects);
      goToCreateChoices(fromSelect, toSelect);
      goToCreateTable(currencyData, tableApp);
      formatDate(serverData.Date, formattedDate);
      setTimeout(() => {
        hideLoader();
      }, 2000);
    }
  }

  // Убираем загрузочный экран
  function hideLoader() {
    document.body.classList.remove('stop-scroll');
    mainPage.classList.remove('hidden');
    loading.classList.remove('spinner--loading');
    strips.forEach(strip => {
      strip.classList.add('spinner__strip--none')
    })
  }

  // Получаем дату с 0 если меньше 2 знаков
  function formatDate(date, container) {
    const newDate = date.split('T')[0].split('-').reverse().join('.')
    container.textContent = newDate;
  }

  function goToCreateSelect(objsData, container) {
    container.forEach(select => createOption(select, 'RUB', 'Российский рубль'));

    for (const key in objsData) {
      const innerObj = objsData[key];
      container.forEach(select => createOption(select, innerObj.CharCode, innerObj.Name));
    }
  }

  // Заполнение селектора и создание элементов на основе данных API
  function createOption(container, CharCode, Name) {
    const elementOption = document.createElement('option');
    const elementSpan = document.createElement('span');
    const wrapperText = document.createElement('span');

    elementOption.value = CharCode;
    wrapperText.textContent = Name;
    elementSpan.textContent = CharCode;

    elementOption.classList.add('currency-converter__option');
    wrapperText.classList.add('currency-converter__name');
    elementSpan.classList.add('currency-converter__code')

    elementOption.append(wrapperText, elementSpan);
    container.append(elementOption);
  }

  function goToCreateChoices(from, to) {
    const choicesOne = createChoices(from, 'one');
    const choicesTwo = createChoices(to, 'two');

    if (screen.width < 577) {
      closeBtnMobile();
    }

    reverseBtn.addEventListener('click', () => {
      conversionAmount.value = '';
      total.textContent = '';

      const selectOne = choicesOne.getValue();
      const selectTwo = choicesTwo.getValue();

      choicesOne.setValue([{
        value: selectTwo.value,
        label: selectTwo.label,
      }])
      choicesTwo.setValue([{
        value: selectOne.value,
        label: selectOne.label,
      }])
    })
  }

  function goToCreateTable(objsData, container) {
    if (screen.width > 1024) {
      for (const key in objsData) {
        const innerObj = objsData[key];
        createTable(innerObj, container, 'desktop');
      }
    } else {
      for (const key in objsData) {
        const innerObj = objsData[key];
        createTable(innerObj, container, 'mobile');
      }
    }

    screenWidth.addEventListener('change', (e) => {
      if (e.matches) {
        container.innerHTML = '';
        for (const key in objsData) {
          const innerObj = objsData[key];
          createTable(innerObj, container, 'mobile');
        }
      } else {
        container.innerHTML = '';
        for (const key in objsData) {
          const innerObj = objsData[key];
          createTable(innerObj, container, 'desktop');
        }
      }
    })
  }

  // Создание таблицы
  function createTable(innerObj, container, format) {
    if (format === 'desktop') {
      const tr = document.createElement('tr');
      const tdCode = document.createElement('td');
      const img = document.createElement('img');
      const tdUnit = document.createElement('td');
      const tdCurrency = document.createElement('td');
      const tdRate = document.createElement('td');

      tr.classList.add('table__tr');
      tdCode.classList.add('table__td');
      img.classList.add('table__img');
      tdUnit.classList.add('table__td');
      tdCurrency.classList.add('table__td');
      tdRate.classList.add('table__td');

      img.src = `img/flags/${innerObj.CharCode}.svg`;
      img.alt = `Флаг страны ${innerObj.CharCode}`;

      tdCode.textContent = innerObj.CharCode;
      tdUnit.textContent = innerObj.Nominal;
      tdCurrency.textContent = innerObj.Name;
      tdRate.textContent = innerObj.Value;
      tdCode.prepend(img)
      tr.append(tdCode, tdUnit, tdCurrency, tdRate)
      container.append(tr);
    } else {
      const trOne = document.createElement('tr');
      const trTwo = document.createElement('tr');
      const trThree = document.createElement('tr');
      const trFour = document.createElement('tr');

      const tdNoteCode = document.createElement('td');
      const tdCode = document.createElement('td');
      const img = document.createElement('img');
      const tdNoteUnit = document.createElement('td');
      const tdUnit = document.createElement('td');
      const tdNoteCurrency = document.createElement('td');
      const tdCurrency = document.createElement('td');
      const tdNoteRate = document.createElement('td');
      const tdRate = document.createElement('td');

      trOne.classList.add('table__tr-mobile');
      trTwo.classList.add('table__tr-mobile');
      trThree.classList.add('table__tr-mobile');
      trFour.classList.add('table__tr-mobile');

      tdNoteCode.classList.add('table__td-mobile');
      tdCode.classList.add('table__td-mobile', 'table__td-mobile--code');
      img.classList.add('table__img');
      tdNoteUnit.classList.add('table__td-mobile');
      tdUnit.classList.add('table__td-mobile', 'table__td-mobile--unit');
      tdNoteCurrency.classList.add('table__td-mobile');
      tdCurrency.classList.add('table__td-mobile', 'table__td-mobile--currency');
      tdNoteRate.classList.add('table__td-mobile');
      tdRate.classList.add('table__td-mobile', 'table__td-mobile--rate');

      tdNoteCode.textContent = 'Код';
      tdNoteUnit.textContent = 'Единица';
      tdNoteCurrency.textContent = 'Валюта';
      tdNoteRate.textContent = 'Курс базовой валюты';

      tdCode.textContent = innerObj.CharCode;
      tdUnit.textContent = innerObj.Nominal;
      tdCurrency.textContent = innerObj.Name;
      tdRate.textContent = innerObj.Value;

      img.src = `img/flags/${innerObj.CharCode}.svg`;
      img.alt = `Флаг страны ${innerObj.CharCode}`;

      tdCode.prepend(img);
      trOne.append(tdNoteCode, tdCode);
      trTwo.append(tdNoteUnit, tdUnit);
      trThree.append(tdNoteCurrency, tdCurrency);
      trFour.append(tdNoteRate, tdRate);
      container.append(trOne, trTwo, trThree, trFour);
    }
  }

  // Кастомный селект
  function createChoices(select, num) {
    const choices = new Choices(select, {
      searchEnabled: true,
      position: 'down',
      searchResultLimit: 44,
      allowHTML: true,
      itemSelectText: '',
      searchPlaceholderValue: 'Что будем искать?',
      loadingText: 'Поиск...',
      noResultsText: 'Валюта не найдена',
      placeholder: true,
      placeholderValue: 'Выберите валюту',
      classNames: {
        listDropdown: `choices__list--dropdown-${num}`,
      }
    });

    const ariaLabel = select.getAttribute('aria-label');
    select.closest('.choices').setAttribute('aria-label', ariaLabel);

    return choices;
  };

  // Конвертация суммы
  function conversion(value, fromValue, toValue, container) {
    const num = fx(+value).from(fromValue).to(toValue);
    container.textContent = +num.toFixed(4);
  }

  // Событие на кнопку закрыть
  function closeBtnMobile() {
    selects.forEach(e => e.addEventListener('hideDropdown', () => {
      closeBtn.classList.add('currency-converter__btn-close--hidden');
    })
    )
    const choices = document.querySelectorAll('.choices');
    choices.forEach(select => {
      select.addEventListener('click', () => {
        closeBtn.classList.remove('currency-converter__btn-close--hidden');
        closeBtn.addEventListener('click', () => {
          closeBtn.classList.add('currency-converter__btn-close--hidden');
        })
      })
    })
  }

  // добавление события на кнопку
  screenWidthMobileBtn.addEventListener('change', (e) => {
    if (e.matches) {
      closeBtnMobile();
    }
  })

  // Событие с проверкой для отправки данных на конвертацию + задержка в 0.5s
  conversionAmount.addEventListener('input', () => {
    if (fromSelect.value !== defaultValue && toSelect.value !== defaultValue) {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        conversion(conversionAmount.value, fromSelect.value, toSelect.value, total);
      }, 500);
    }
  });

  // Пропкуск буквы e и E для числового ввода
  conversionAmount.addEventListener('keypress', (e) => {
    if (e.key === 'e' || e.key === 'E') e.preventDefault()
  })

  // Доп проверка на селекторы если инпут введен раньше выбора
  selects.forEach(select => {
    select.addEventListener('change', () => {
      if (fromSelect.value !== defaultValue && toSelect.value !== defaultValue && conversionAmount.value) {
        conversion(conversionAmount.value, fromSelect.value, toSelect.value, total)
      }
    })
  })

  window.api = api;
})();
