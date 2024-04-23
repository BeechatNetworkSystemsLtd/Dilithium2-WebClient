import TabLayout from '@components/Layout/TabLayout';
import Field from '~/components/Field';
import Button from '~/components/Button';

const Signing = () => {
  return (
    <TabLayout>
      <div className='flex flex-col gap-10 mt-10'>
        <div className='flex flex-col gap-4'>
          <Button label='Generate Keys' />
          <div className='flex flex-row w-full gap-4'>
            <Field
              label='Public Key'
              name='public_key'
              rows={2}
              placeholder='Public Key'
            />
            <Field
              label='Secret Key'
              name='secret_key'
              rows={2}
              placeholder='Secret Key'
            />
          </div>
        </div>

        <hr className='border-black/30 ' />

        <div className='flex flex-col gap-4 pb-8'>
          <Field
            label='Text'
            name='text'
            placeholder='Input text to generate Signature'
          />
          <Field
            label='Signature'
            name='signature'
            rows={7}
            placeholder='Signature'
          />
          <Button label='Sign' />
        </div>
      </div>
    </TabLayout>
  );
};

export default Signing;
