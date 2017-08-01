/*
* @Author: bin
* @Date:   2017-07-13 10:45:47
* @Last Modified by:   bin
* @Last Modified time: 2017-07-13 10:55:09
*/

'use strict';
// 解析URL参数
// @example ?id=12345&a=b
// @return Object {id: 12345,a: b}
export function urlParse() {
	let url = window.location.search;
	let obj = {};
	let reg = /[?&][^?&]+=[^?&]+/g;
	let arr = url.match(reg);
	// ['?id=12345','&a=b']
	if (arr) {
		arr.forEach((item) => {
			let tempArr = item.substring(1).split('=');
			let key = decodeURIComponent(tempArr[0]);
			let value = decodeURIComponent(tempArr[1]);
			obj[key] = value;
		});
	}
	return obj;
};
