import { useState } from 'react';
import TabLayout from '@components/Layout/TabLayout';
import Field from '~/components/Field';
import Button from '~/components/Button';
import { dilithiumGenKeyPair, dilithiumSign } from '@beechatnetwork/lib-dqx';
import { Buffer } from 'buffer/index.js';

const Signing = () => {
  const [keys, setKeys] = useState<{ publicKey: string; secretKey: string }>({
    publicKey: '',
    secretKey: '',
  });
  const [text, setText] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [error, setError] = useState<string>('');

  const generateKeys = async () => {
    const data = await dilithiumGenKeyPair({
      randomBytes: (size = 1) => Buffer.alloc(size),
    })
      .then((res: any) => {
        setError('');
        return res;
      })
      .catch((err: any) => {
        setError(err.toString());
      });
    setKeys({
      publicKey: data.publicKey.toString('hex'),
      secretKey: data.secretKey.toString('hex'),
    });
  };

  const sign = async () => {
    const b_secretKey = Buffer.from(keys.secretKey, 'hex');
    const b_challenge = Buffer.from(text, 'hex');

    let data = await dilithiumSign({
      secretKey: b_secretKey,
      challenge: b_challenge,
    })
      .then((res: any) => {
        setError('');
        return res;
      })
      .catch((err: any) => {
        setError('Text must be 32 bytes long.');
      });

    setSignature(data.toString('hex'));
  };

  return (
    <TabLayout>
      <div className='flex flex-col gap-10 mt-10'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-row w-full gap-4'>
            <Field
              label='Public Key'
              name='public_key'
              rows={2}
              placeholder='Public Key'
              readOnly={true}
              value={keys.publicKey}
            />
            <Field
              label='Secret Key'
              name='secret_key'
              rows={2}
              placeholder='Secret Key'
              readOnly={true}
              value={keys.secretKey}
            />
          </div>
          <Button label='Generate Keys' onClick={() => generateKeys()} />
        </div>

        <hr className='border-black/30 ' />

        <div className='flex flex-col gap-4 pb-8'>
          <Field
            label='Text'
            description='Text must be 32 bytes long. ex: 0e4222c411e8e688403c2cc2a3aadb9bcdd0947cf082b30b268fc91bc7dafaca'
            name='text'
            placeholder='Input text to generate Signature'
            value={text}
            onChange={setText}
            rows={3}
          />
          <Field
            label='Signature'
            name='signature'
            rows={7}
            placeholder='Signature'
            value={signature}
            readOnly={true}
          />
          <Button label='Sign' onClick={() => sign()} />
          {error && (
            <span className='pl-4 border border-l-8 border-gray-500'>
              {error}
            </span>
          )}
        </div>
      </div>
    </TabLayout>
  );
};

export default Signing;
