export default datetime => {
	const date = new Date(datetime);
	const hours = date.getHours();
	const minutes = date.getMinutes();

	return formatTime(hours) + ':' + formatTime(minutes);

	function formatTime(i) {
		if (i < 10) {
			i = '0' + i;
		}
		return i;
	}
};
