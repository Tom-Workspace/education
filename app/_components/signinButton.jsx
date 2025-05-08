"use client";
import React from 'react';
import { signIn } from "next-auth/react";

const SignInButton = () => {
  return (
    <button type="button" onClick={() => signIn('google', {redirect: true, callbackUrl: '/home'})}>
      Sign in with Google
    </button>
  );
};

export default SignInButton;
