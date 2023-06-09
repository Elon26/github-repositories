<h1>Страница поиска репозиториев Github</h1>
<br>
<p>Описание функционала:</p>
<ul>
    <li>Функционал содержит форму для ввода подстроки, по которой будет осуществлён поиск.</li>
    <li>При вводе пустого значения, выводится сообщение об ошибке.</li>
    <li>При вводе непустого значения, строка используется, как Query-параметр q поискового запроса (название репозитория).</li>    
    <li>Также при помощи Query-параметров задано запрашивать самые новые репозитории, удовлетворяющие подстроке поиска, в количестве 10 ед. Помимо этого, задан внутренний функционал сортировки полученного массива по сроку последнего обновления.</li>
    <li>В качестве результата выполнения запроса осуществляется отрисовка таблицы с 4-мя столбцами:
        <ul>
            <li>Автор. Содержит ссылку на главную страницу автора репозитория.</li>
            <li>Название. Содержит ссылку на страницу найденного репозитория.</li>
            <li>Дата обновления. Содержит объект даты последнего обновления репозитория, преобразованный в текст.</li>
            <li>Язык программирования. Содержит текст языка программирования, обозначенного в репозитории, как наиболее употребимый.</li>
        </ul>
    </li>
    <li>При выполнении каждого нового запроса, результаты предыдущего очищаются.</li>
    <li>Также в целях повышения комфорта использования добавлен спиннер (loader) на время выполнения fetch-запроса.</li>
</ul>
