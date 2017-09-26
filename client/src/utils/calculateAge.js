export default dateOfBirth => {
	const ageDifMs = Date.now() - new Date(dateOfBirth);
	const ageDate = new Date(ageDifMs);
	return Math.abs(ageDate.getUTCFullYear() - 1970);
};
