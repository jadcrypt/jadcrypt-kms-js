import SDK from 'aws-sdk';
import { charset, encoding } from './presets';

export class JadcryptKMS {
  constructor(options = {}, KMS = SDK.KMS) {
    this.kms = new KMS(options);
    this.encoding = options.encoding ? options.encoding : encoding;
  }

  encrypt(plain, keyId, context, callback) {
    if (typeof context === 'function') {
      callback = context; // eslint-disable-line no-param-reassign
      context = {};       // eslint-disable-line no-param-reassign
    }

    this.encryptRaw(Buffer.from(plain, charset), keyId, context, (err, encrypted) => {
      if (err) {
        callback(err);
      } else {
        callback(null, encrypted.toString(this.encoding));
      }
    });
  }

  encryptRaw(plain, keyId, context, callback) {
    if (typeof context === 'function') {
      callback = context; // eslint-disable-line no-param-reassign
      context = {};       // eslint-disable-line no-param-reassign
    }
    if (!Buffer.isBuffer(plain)) {
      throw new Error('plain is no a Buffer');
    }
    if (typeof callback !== 'function') {
      throw new Error('callback is not a valid function');
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
    if (typeof context === 'function') {
      callback = context; // eslint-disable-line no-param-reassign
      context = {};       // eslint-disable-line no-param-reassign
    }

    this.decryptRaw(Buffer.from(encrypted, this.encoding), context, (err, plain) => {
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
      throw new Error('callback is not a valid function');
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
