function getUserBranchYearAndFile(email) {
    // Example email: 2024ucs0101@iitjammu.ac.in
    const match = email.match(/^(\d{4})u([a-z]{2})\d{4}@iitjammu\.ac\.in$/i);
    if (!match) return null;

    const admissionYear = parseInt(match[1], 10);
    const branchCode = match[2].toLowerCase();
    const currentYear = new Date().getFullYear();
    const yearOfStudy = currentYear - admissionYear + 1;

    // Map branch code to branch name and file prefix
    const branchMap = {
        cs: 'cs', // CSE
        ce: 'ce', // CE
        ee: 'ee', // EE
        me: 'me', // ME
        mt: 'mt', // MT
        ma: 'ma', // MA
        // add more as needed
    };

    const filePrefix = branchMap[branchCode];
    if (!filePrefix) return null;

    const jsonFile = `${filePrefix}${yearOfStudy}.json`;
    return {
        branch: filePrefix.toUpperCase(),
        year: yearOfStudy,
        jsonFile
    };
}

module.exports = { getUserBranchYearAndFile }; 