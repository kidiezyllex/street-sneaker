'use client';
import Loading from '@/components/Loading';
import dynamic from 'next/dynamic';
import React from 'react';

const SignUpForm = dynamic(() => import('./form'), {
  ssr: false,
  loading: () => <Loading />,
});

function SignUp() {
  return <SignUpForm />;
}

export default SignUp;
