import React from 'react';
import { renderRoutes } from 'react-router-config';
import Helmet from 'react-helmet';

import Bootstrap from '../../content/bootstrap/AppGlobals';

import config from './../foundation/config';

type Props = { route: Object };

export default ({ route }: Props) => (
  <div className={styles.App}>
    <Helmet {...config.app} />
    <Bootstrap />
    {/* child routes won't render without this */}
    {renderRoutes(route.routes)}
  </div>
);
