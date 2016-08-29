import SDK from 'aws-sdk';
import { charset } from './presets';

export class JadcryptKMS {
  constructor(options = {}, AWS = SDK) {
    this.kms = new AWS.KMS(options);
  }

  encrypt(plain, keyId, context, callback) {
    this.encryptRaw(Buffer.from(plain, charset), keyId, context, (err, encrypted) => {
      if (err) {
        callback(err);
      } else {
        callback(null, encrypted.toString('hex'));
      }
    });
  }

  encryptRaw(plain, keyId, context, callback) {
    if (typeof context === 'function') {
      callback = context; // eslint-disable-line no-param-reassign
      context = {};       // eslint-disable-line no-param-reassign
    }
    if (!Buffer.isBuffer(plain)) {
      throw new Error('plain is not a Buffer');
    }
    if (typeof callback !== 'function') {
      throw new Error('No callback provided to encryptRaw()');
    }

    const params = {
      KeyId: keyId,
      Plaintext: plain,
      EncryptionContext: context
    };
    this.kms.encrypt(params, (err, data) => {
      if (err) {
        callback(err);
      } else {
        callback(null, data.CiphertextBlob);
      }
    });
  }

  decrypt(encrypted, context, callback) {
    this.decryptRaw(Buffer.from(encrypted, 'hex'), context, callback, (err, plain) => {
      if (err) {
        callback(err);
      } else {
        callback(null, plain.toString(charset));
      }
    });
  }

  decryptRaw(encrypted, context, callback) {
    if (typeof context === 'function') {
      callback = context; // eslint-disable-line no-param-reassign
      context = {};       // eslint-disable-line no-param-reassign
    }
    if (!Buffer.isBuffer(encrypted)) {
      throw new Error('encrypted is not a Buffer');
    }
    if (typeof callback !== 'function') {
      throw new Error('No callback provided to decryptRaw()');
    }

    const params = {
      CiphertextBlob: encrypted,
      EncryptionContext: context
    };
    this.kms.decrypt(params, (err, data) => {
      if (err) {
        callback(err);
      } else {
        callback(null, data.Plaintext);
      }
    });
  }
}
