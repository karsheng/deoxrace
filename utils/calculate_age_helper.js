module.exports = dateOfBirth => {
	const ageDifMs = Date.now() - dateOfBirth;
	const ageDate = new Date(ageDifMs);
	return Math.abs(ageDate.getUTCFullYear() - 1970);
};
