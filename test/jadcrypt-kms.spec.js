import { expect } from 'chai';
import { JadcryptKMS } from '../lib/jadcrypt-kms';
import { KMSMock } from './kms-mock';

const jadcrypt = new JadcryptKMS({}, KMSMock);

describe('JadcryptKMS', () => {
  describe('#encrypt', () => {
    it('should be decrypted to same value', () => {
      jadcrypt.encrypt('Hello World!', 'abc', (err, encrypted) => {
        jadcrypt.decrypt(encrypted, (err, decrypted) => {
          expect(decrypted).to.equal('Hello World!');
        })
      });
    })
  })
});
