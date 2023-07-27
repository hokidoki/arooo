import { Content } from '@/types/type';
import React, { MouseEvent } from 'react';
import LikeButton from './LikeButton';
import Styles from './Contents.module.scss';
import { useLike } from '@/hooks/useContents';
interface Props extends Content {
  buttonOnClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export default function DetailContent({
  buttonOnClick,
  likes,
  content,
}: Props) {
  return (
    <div className={Styles.detailContent}>
      <p className={Styles.content}>{content}</p>
      <LikeButton onClick={buttonOnClick}>{likes}</LikeButton>
    </div>
  );
}
