import { useState, useEffect } from 'react';
import TabLayout from '@components/Layout/TabLayout';
import Field from '~/components/Field';
import Button from '~/components/Button';
// @ts-ignore
import { dilithiumVerifySig } from '@beechatnetwork/lib-dqx';
import { Buffer } from 'buffer/index.js';
import { sha256 } from 'js-sha256';

const Verification = () => {
  const [publicKey, setPublicKey] = useState<string>('');
  const [signature, setSignature] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<boolean | null>(null);

  useEffect(() => {
    const ve_publicKey = sessionStorage.getItem('ve_publicKey');
    const ve_signature = sessionStorage.getItem('ve_signature');
    const ve_text = sessionStorage.getItem('ve_text');
    const ve_result = sessionStorage.getItem('ve_result');
    if (ve_publicKey) setPublicKey(ve_publicKey);
    if (ve_signature) setSignature(ve_signature);
    if (ve_text) setText(ve_text);
    if (ve_result)
      setResult(
        ve_result === 'true' ? true : ve_result === 'false' ? false : null
      );
  }, []);

  const handlePublicKey = (val: string) => {
    console.log('val :>> ', val);
    setPublicKey(val);
    sessionStorage.setItem('ve_publicKey', val);
  };
  const handleSignature = (val: string) => {
    setSignature(val);
    sessionStorage.setItem('ve_signature', val);
  };
  const handleText = (val: string) => {
    setText(val);
    sessionStorage.setItem('ve_text', val);
  };
  const handleResult = (res: boolean | null) => {
    setResult(res);
    sessionStorage.setItem('ve_result', `${res}`);
  };
  const handleError = (err: string) => {
    setError(err);
    sessionStorage.setItem('ve_error', err);
  };

  const verifySig = async () => {
    const b_publicKey = Buffer.from(publicKey, 'hex');
    const b_challenge = Buffer.from(sha256(text), 'hex');
    const b_signature = Buffer.from(signature, 'hex');

    dilithiumVerifySig({
      publicKey: b_publicKey,
      challenge: b_challenge,
      signature: b_signature,
    })
      .then((res: boolean) => {
        handleError('');
        handleResult(res);
        return res;
      })
      .catch((err: object) => {
        handleResult(null);
        handleError(err.toString());
      });
  };

  return (
    <TabLayout>
      <div className='flex flex-col gap-10 pb-8 mt-10'>
        {result !== null && (
          <span
            className={`pl-4 border border-l-8 ${
              result ? 'border-green-500' : 'border-gray-500'
            }`}
          >
            {result
              ? 'Successfully verified your signature'
              : 'Failed to verify your signature'}
          </span>
        )}
        <div className='flex flex-col gap-4'>
          <Field
            label='Public Key'
            name='public_key'
            placeholder='Input public key to verify Signature'
            value={publicKey}
            onChange={handlePublicKey}
          />
          <Field
            label='Signature'
            name='signature'
            placeholder='Input Signature to verify'
            value={signature}
            onChange={handleSignature}
          />
          <Field
            label='Text'
            description='Text must be 32 bytes long. ex: 0e4222c411e8e688403c2cc2a3aadb9bcdd0947cf082b30b268fc91bc7dafaca'
            name='text'
            placeholder='Input text to verify Signature'
            value={text}
            onChange={handleText}
          />
        </div>
        <Button
          label='Verify'
          onClick={() => {
            verifySig();
          }}
        />
        {error && (
          <span className='pl-4 border border-l-8 border-gray-500'>
            {error}
          </span>
        )}
      </div>
    </TabLayout>
  );
};

export default Verification;
