'use client';
import Loading from '@/components/Loading';
import dynamic from 'next/dynamic';
import React from 'react';

const SignInForm = dynamic(() => import('./form'), {
  ssr: false,
  loading: () => <Loading />,
});

function SignIn() {
  return <SignInForm/>;
}

export default SignIn;
