import React from 'react';
import Styles from './DefaultHeader.module.scss';
import Link from 'next/link';
export default function DefaultHeader() {
  return (
    <div className={Styles.header}>
      <Link href={'/'}>Home</Link>
    </div>
  );
}
