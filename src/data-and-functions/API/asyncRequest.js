import {headerWithToken} from '../constants/URLS.js';


export default async function (url, body, method, header, token) {
    let res;
    if (token) {
        headerWithToken.Authorization += token;
        res = fetch(url, {
            method: method,
            headers: headerWithToken,
            body: JSON.stringify(body)
        });
    } else if (header) {
        res = fetch(url, {
            method: method,
            headers: header,
            body: JSON.stringify(body)
        });
    } else if (!method) {
        res = fetch(url);
    } else {
        console.log('ошибка: ничего не подошло');
    }
    return res;
}
