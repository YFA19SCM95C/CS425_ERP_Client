import * as React from "react";
import * as style from './index.scss';
import noAccessImg from './no-access.png';

export const Login: React.FC = () => {
  return (
    <div className={style.container}>
      <div>
        <img src={noAccessImg} width="200" />
        <p>{`Sorry! You don't have permissions`}</p>
      </div>
    </div>
  );
};
