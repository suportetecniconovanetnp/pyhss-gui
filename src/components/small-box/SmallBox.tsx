import React from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowCircleRight, faBoxArchive} from '@fortawesome/free-solid-svg-icons';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';

export interface SmallBoxProps {
  type: 'info' | 'success' | 'warning' | 'danger';
  icon?: IconDefinition;
  count: number;
  title: string;
  navigateTo: string;
}

const SmallBox = ({
  type = 'info',
  icon = faBoxArchive,
  count,
  title,
  navigateTo
}: SmallBoxProps) => {
  const [t] = useTranslation();

  return (
    <div className={`small-box bg-${type}`}>
      <div className="inner">
        <h3>{count}</h3>
        <p>{title}</p>
      </div>
      <div className="icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <Link to={navigateTo} className="small-box-footer">
        <span className="mr-2">{t<string>('generic.moreInfo')}</span>
        <FontAwesomeIcon icon={faArrowCircleRight} />
      </Link>
    </div>
  );
};

export default SmallBox;
