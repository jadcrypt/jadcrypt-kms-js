import yargs from 'yargs';
import { JadcryptKMS } from './jadcrypt-kms';

function log(message) {
  return function callback(err, data) {
    if (err) {
      console.error(err); // eslint-disable-line no-console
    } else {
      console.info(`${message}\n${data}`); // eslint-disable-line no-console
    }
  };
}

function context(values = []) {
  return values.reduce((c, parameter) => {
    const [key, value] = parameter.split(':');
    return Object.assign(c, { [key]: value });
  }, {});
}

function encrypt(argv) {
  const jadcrypt = new JadcryptKMS({ region: argv.region });
  jadcrypt.encrypt(argv.plain, argv.keyId, context(argv.context), log('Encrypted data:'));
}

function decrypt(argv) {
  const jadcrypt = new JadcryptKMS({ region: argv.region });
  jadcrypt.decrypt(argv.encrypted, context(argv.context), log('Decrypted data:'));
}

const compose = (...fns) => initial => fns.reduceRight((result, fn) => fn(result), initial);

const usageOpts = (command, data) => builder =>
  builder.usage(`Usage: $0 [options] ${command} ${data}`);

const regionOpts = builder =>
  builder.alias('r', 'region').string('r').describe('r', 'AWS region id');

const keyIdOpts = builder =>
  builder.alias('k', 'key-id').string('k').describe('k', 'KMS key arn');

const contextOpts = builder =>
  builder.alias('c', 'context').string('c').describe('c', 'context parameter');

const demand = keys => builder =>
  builder.demand(keys);

const allOpts = compose(
  usageOpts('<command>', '<data>'), regionOpts, keyIdOpts, contextOpts, demand(['r'])
);

const encryptOpts = compose(
  usageOpts('encrypt', '<plain>'), regionOpts, keyIdOpts, contextOpts, demand(['r', 'k'])
);

const decryptOpts = compose(
  usageOpts('decrypt', '<encrypted>'), regionOpts, contextOpts, demand(['r'])
);

// eslint-disable-next-line no-unused-expressions
allOpts(yargs.version().help())
  .command('encrypt <plain>', 'encrypt plain text', encryptOpts, encrypt)
  .command('decrypt <encrypted>', 'decrypt encrypted hex', decryptOpts, decrypt)
  .demand(1)
  .argv;
