const encoding = 'hex';
const charset = 'utf8';

function contextToString(context) {
  return Object.entries(context).map(entry => entry.join(':')).join('|');
}

function dummyEncrypt(plain, context = {}, callback) {
  const plainHex = plain.toString(encoding);
  const contextHex = Buffer.from(contextToString(context), charset).toString(encoding);
  callback(null, { CiphertextBlob: Buffer.from(`${plainHex}:${contextHex}`, charset) });
}

function dummyDecrypt(enrypted, context = {}, callback) {
  const [plainHex, contextHex] = enrypted.toString(charset).split(':');
  const contextVerify = Buffer.from(contextToString(context), charset).toString(encoding);
  if (contextHex !== contextVerify) {
    callback(new Error());
  } else {
    callback(null, { Plaintext: Buffer.from(plainHex, encoding) });
  }
}

export class KMSMock {
  encrypt(params, callback) {
    dummyEncrypt(params.Plaintext, params.EncryptionContext, callback);
  }
  decrypt(params, callback) {
    dummyDecrypt(params.CiphertextBlob, params.EncryptionContext, callback);
  }
}
