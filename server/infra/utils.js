const createInitials = function (text) {
    if (!text) return "";
    if (text.length <= 2) return text;
    let parts = text.split(" ");
    let first = parts[0].charAt(0);
    let last = parts[parts.length - 1].charAt(0);
    return (first + last).toUpperCase();
};

const getLastGitRevision = function() {
    let revision = "";
    const rev = fs.readFileSync('.git/HEAD').toString().trim();
    if (rev.indexOf(':') === -1) {
        revision = rev;
    } else {
        revision = fs.readFileSync('.git/' + rev.substring(5)).toString().trim();
    }
    return revision;
}

module.exports = {
    createInitials,
    getLastGitRevision
};