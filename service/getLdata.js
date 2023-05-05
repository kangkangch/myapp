export function getLdata(url) {
	console.log(1111);
	let items = [];
	uni.$u.http.get(url, {}).then(res => {
		console.log(res);
		items = res.data;
	});
	if (items == undefined) return [];
	return items;
}