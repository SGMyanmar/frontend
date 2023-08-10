export default function decrypt(encryptedText:string, key:number) {
    var decryptedText = "";
    for (var i = 0; i < encryptedText.length; i++) {
        var char = encryptedText.charAt(i);
        if (char.match(/[A-Z]/)) {
            var decryptedCharCode = (char.charCodeAt(0) - key - 'A'.charCodeAt(0) + 26) % 26 + '0'.charCodeAt(0);
            decryptedText += String.fromCharCode(decryptedCharCode);
        } else if (char.match(/[a-z]/)) {
            var decryptedCharCode = (char.charCodeAt(0) - key - 'a'.charCodeAt(0) + 26) % 26 + '0'.charCodeAt(0);
            decryptedText += String.fromCharCode(decryptedCharCode);
        } else if (char.match(/\d/)) {
            var decryptedDigit = (parseInt(char) - key + 10) % 10;
            decryptedText += decryptedDigit.toString();
        } else {
            decryptedText += char;
        }
    }
    return decryptedText;
}