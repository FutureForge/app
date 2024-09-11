'use client'
import React, { useState } from 'react'
import Head from 'next/head'
import { Header } from '@/modules/components/header'


export default function Home() {
  return (
    <main className="md:px-14">
      <Head>
        <title>MintMingle, Marketplace for NFTs</title>
      </Head>

      <div>
        <Header/>
      </div>
    </main>
  )
}
