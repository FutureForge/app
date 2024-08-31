'use client'
import React, { useState } from 'react'
import Head from 'next/head'
import Header from '@/modules/components/header'

export default function Home() {
  return (
    <div className="h-screen md:px-14">
      <Head>
        <title>MintMingle, marketplace for NFTs</title>
        {/* <meta
          name="description"
          content="A community driven token that comes with additional warm gesture, rewards and credit back hampers."
        /> */}
      </Head>

      <div className="h-screen">
        <Header />
      </div>
    </div>
  )
}
