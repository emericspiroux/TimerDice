export default (time: number) => {
	return new Promise((s) => {
		setTimeout(s, time);
	});
};
