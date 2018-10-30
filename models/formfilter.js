function checkPhoneNum(str) {
    return /^((1[358][0-9])|(14[57])|(17[0678])|(19[7]))\d{8}$/.test(str);
}
function checkEmail(str) {
    return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(str);
}

module.exports = {
    checkPhoneNum,
    checkEmail
}