import TabLayout from '@components/Layout/TabLayout';
import Field from '~/components/Field';
import Button from '~/components/Button';

const Verification = () => {
  return (
    <TabLayout>
      <div className='flex flex-col gap-10 pb-8 mt-10'>
        <div className='flex flex-col gap-4'>
          <Field
            label='Public Key'
            name='public_key'
            placeholder='Input public key to verify Signature'
          />
          <Field
            label='Signature'
            name='signature'
            placeholder='Input Signature to verify'
          />
          <Field
            label='Text'
            name='text'
            placeholder='Input text to verify Signature'
          />
        </div>
        <Button label='Verify' />
      </div>
    </TabLayout>
  );
};

export default Verification;
