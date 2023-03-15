"use strict"

const repoesToSearch = 10;
const searchForm = document.forms.searchForm;
const headers = ["Автор", "Название", "Дата обновления", "Язык программирования"]

/** Функция возвращает первые 10 наиболее релевантных введенной пользователем подстроке репозиториев. */
async function findRepos(str) {
    const queryString = encodeURIComponent(str);
    const response = await fetch(`https://api.github.com/search/repositories?q=${queryString}&sort=updated&order=desc&per_page=${repoesToSearch}`);
    const data = await response.json();

    return data.items;
}

/** Функция создаёт сообщение об ошибке валидации или некорректном параметре поиска, а также создаёт спиннер на время загрузки. */
function createElem(str) {
    const message = document.createElement("div");
    message.className = str;
    message.textContent =
        str === "empty"
            ? "Не найдено ни одного подходящего репозитория"
            : str === "error"
                ? "Поле поиска не должно быть пустым"
                : "";

    searchForm.after(message);
}

/** Функция удаляет HTML-элемент с заданным классом. */
function removeElem(str) {
    const message = document.querySelector(`.${str}`);
    if (message) message.remove();
}

/** Функция создаёт заголовок таблицы. */
function createTableHeader(headers) {
    const tableHeader = document.createElement("tr");

    headers.forEach(header => {
        const headerItem = document.createElement("th");
        headerItem.textContent = header;

        tableHeader.append(headerItem);
    });

    return tableHeader;
}

/** Функция создаёт ячейку таблицы со ссылкой. */
function createLinkTableCell(name, url) {
    const cell = document.createElement("td");

    const link = document.createElement("a");
    link.textContent = name;
    link.href = url;
    link.target = "blank";

    cell.append(link);
    return cell;
}

/** Функция создаёт ячейку таблицы с датой. */
function createDateTableCell(date) {
    const createdDate = new Date(date);

    let createdDay = createdDate.getDate();
    let createdMonth = createdDate.getMonth() + 1;
    const createdYear = createdDate.getFullYear();

    if (createdDay < 10) createdDay = "0" + createdDay;
    if (createdMonth < 10) createdMonth = "0" + createdMonth;

    const cell = document.createElement("td");
    cell.textContent = `${createdDay}.${createdMonth}.${createdYear}`;

    return cell;
}

/** Функция создаёт ячейку таблицы с текстом. */
function createTextTableCell(text) {
    const cell = document.createElement("td");

    cell.textContent = text ? text : "Проект пуст"

    return cell;
}

/** Функция создаёт строку таблицы. */
function createTableRow(repoName, repoUrl, ownerName, ownerUrl, createdDate, repoLanguage) {
    const tableRow = document.createElement("tr");

    const repoCell = createLinkTableCell(repoName, repoUrl);
    const ownerCell = createLinkTableCell(ownerName, ownerUrl);
    const dateCell = createDateTableCell(createdDate);
    const languageCell = createTextTableCell(repoLanguage);

    tableRow.append(ownerCell);
    tableRow.append(repoCell);
    tableRow.append(dateCell);
    tableRow.append(languageCell);
    return tableRow;
}

/** Функция создаёт таблицу с результатами поиска репозиториев. */
function createResultTable(arr) {
    const table = document.createElement("table");
    table.className = "table";

    const tableHeader = createTableHeader(headers);
    table.append(tableHeader);

    const sortedArr = arr.sort((a, b) => {
        const date1 = new Date(a.updated_at);
        const date2 = new Date(b.updated_at);

        return date2.getTime() - date1.getTime();
    })

    sortedArr.forEach(repoItem => {
        const tableRow = createTableRow(
            repoItem.name,
            repoItem.html_url,
            repoItem.owner.login,
            repoItem.owner.html_url,
            repoItem.updated_at,
            repoItem.language
        )
        table.append(tableRow);
    })

    searchForm.after(table);
}

/** Функция очищает результаты прошлого запроса. */
function clearTrash() {
    searchForm.repo.value = "";
    removeElem("empty");
    removeElem("error");
    removeElem("table");
}

searchForm.repo.addEventListener("input", () => removeElem("error"));

searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const repoName = searchForm.repo.value.trim();
    clearTrash();

    if (!repoName) {
        createElem("error");
        return;
    }

    createElem("spinner");
    const repoArr = await findRepos(repoName);
    removeElem("spinner");

    if (!repoArr.length) {
        createElem("empty");
        return;
    }

    createResultTable(repoArr);
});
