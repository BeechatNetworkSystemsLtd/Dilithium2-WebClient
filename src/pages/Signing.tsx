import { useState, useEffect } from 'react';
import TabLayout from '@components/Layout/TabLayout';
import Field from '~/components/Field';
import Button from '~/components/Button';
// @ts-ignore
import { dilithiumGenKeyPair, dilithiumSign } from '@beechatnetwork/lib-dqx';
import { Buffer } from 'buffer/index.js';
import { sha256 } from 'js-sha256';

const Signing = () => {
  const [keys, setKeys] = useState<{ publicKey: string; secretKey: string }>({
    publicKey: '',
    secretKey: '',
  });
  const [text, setText] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const si_publicKey = sessionStorage.getItem('si_publicKey');
    const si_secretKey = sessionStorage.getItem('si_secretKey');
    const si_text = sessionStorage.getItem('si_text');
    const si_signature = sessionStorage.getItem('si_signature');
    if (si_publicKey && si_secretKey)
      setKeys({
        publicKey: si_publicKey,
        secretKey: si_secretKey,
      });
    if (si_text && si_signature) {
      setText(si_text);
      setSignature(si_signature);
    }
  }, []);

  const handlePublicKey = (val: string) => {
    setKeys({ ...keys, publicKey: val });
    sessionStorage.setItem('si_publicKey', val);
  };

  const handleSecretKey = (val: string) => {
    setKeys({ ...keys, secretKey: val });
    sessionStorage.setItem('si_secretKey', val);
  };

  const generateKeys = async () => {
    const data = await dilithiumGenKeyPair({
      randomBytes: (size = 2) => Buffer.alloc(size),
    })
      .then((res: object) => {
        setError('');
        return res;
      })
      .catch((err: object) => {
        setError(err.toString());
      });
    sessionStorage.setItem('si_publicKey', data.publicKey.toString('hex'));
    sessionStorage.setItem('si_secretKey', data.secretKey.toString('hex'));
    setKeys({
      publicKey: data.publicKey.toString('hex'),
      secretKey: data.secretKey.toString('hex'),
    });
  };

  const sign = async () => {
    const b_secretKey = Buffer.from(keys.secretKey, 'hex');
    const b_challenge = Buffer.from(sha256(text), 'hex');

    const data = await dilithiumSign({
      secretKey: b_secretKey,
      challenge: b_challenge,
    })
      .then((res: boolean) => {
        setError('');
        return res;
      })
      .catch((err: object) => {
        setError(err.toString());
      });

    sessionStorage.setItem('si_text', text);
    sessionStorage.setItem('si_signature', data.toString('hex'));

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
              value={keys.publicKey}
              onChange={handlePublicKey}
            />
            <Field
              label='Secret Key'
              name='secret_key'
              rows={2}
              placeholder='Secret Key'
              value={keys.secretKey}
              onChange={handleSecretKey}
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
          <Button
            label='Sign'
            onClick={() => sign()}
            disabled={text.length === 0}
          />
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
