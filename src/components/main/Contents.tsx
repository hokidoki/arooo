import { Min_Content } from '@/types/type';
import Styles from './Contents.module.scss';
import Link from 'next/link';
import React, {
  MouseEvent,
  MouseEventHandler,
  ReactNode,
  useCallback,
} from 'react';
import LikeButton from './LikeButton';

interface Props extends Min_Content {
  buttonOnClick: MouseEventHandler;
}

function Content({ id, title, likes, buttonOnClick }: Props) {
  const preButtonClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => (
      e.preventDefault(), buttonOnClick(e)
    ),
    [buttonOnClick]
  );
  return (
    <li className={Styles.list}>
      <Link className={Styles.link} href={`/content/${id}`} prefetch={false}>
        <div className={Styles.title}>Title : {title}</div>
        <LikeButton onClick={preButtonClick}>{likes}</LikeButton>
      </Link>
    </li>
  );
}

function Contents({ children }: { children: ReactNode }) {
  return <ul className={Styles.lists}>{children}</ul>;
}

Contents.Content = Content;

export default Contents;
