import { Button, Result } from 'antd';
import React from 'react';
import { history, useIntl } from 'umi';

const NoFoundPage: React.FC = () => {
  const intl = useIntl();
  return (
    <Result
      status="404"
      title="404 Not Found"
      subTitle={intl.formatMessage({ id: 'pages.404.subTitle' })}
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          {intl.formatMessage({ id: 'pages.404.backHome' })}
        </Button>
      }
    />
  );
};

export default NoFoundPage;
