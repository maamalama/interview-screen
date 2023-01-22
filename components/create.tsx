import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react';
import useIsMountedRef from '../utils/useIsMountedRef';
import Image from 'next/image'
import { useRouter } from 'next/router';

const Create = () => {
  const router = useRouter();
  const isMountedRef = useIsMountedRef();
  const form = useForm({
    mode: 'onChange',
  });
  const {
    register,
    handleSubmit,
    setValue,
  } = form;

  useEffect(() => {
    setValue('type', 'text');
  }, [isMountedRef, setValue]);

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append('type', data.type);
    formData.append('text', data.text);
    formData.append('image', data.image[0]);
    const res = await  fetch('/api/component', {
      method: 'POST',
      body: formData,
    });
    console.log(res)
    if(res.status === 201) {
      router.reload();
    }
    else {
      alert(`Error: ${res.status} ${res.statusText}`);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Component type</label>
      <label htmlFor="radio-text">
        <input type="radio" {...register('type')} value={'text'} id={'radio-text'}/>
        text
      </label>
      <label htmlFor="radio-image">
        <input type="radio" {...register('type')} value={'image'} id={'radio-image'}/>
        image
      </label>

      {form.watch('type') === 'text' ?
          <div>
            <label>Text</label>
            <input style={{marginLeft: '5px'}} type="text" {...register('text')} />
          </div>
        :
        <>
          <div>
            <label htmlFor='link'>Image</label>
            <input
              {...register('image')}
              type='file'
              style={{marginLeft: '5px'}}
              multiple={false}
              accept={'image/*'}
            />
          </div>
        </>}
      <br/>
      <button type='submit'>
        Create
      </button>
    </form>
  );
}

export default Create;