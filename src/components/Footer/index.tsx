import { useIntl } from 'umi';
// import { GithubOutlined } from '@ant-design/icons';
// import { DefaultFooter } from '@ant-design/pro-layout';
import { Layout } from 'antd';
const { Footer } = Layout; // Header, Content,

export default () => {
  const intl = useIntl();

  const currentYear = new Date().getFullYear();

  return (
    <Footer style={{ textAlign: 'center' }}>
      {intl.formatMessage({ id: 'app.name' })} @{currentYear} Crafted with ❤ by{' '}
      <a href="http://d1.fan" target="_blank" rel="noreferrer">
        xjzsq{' '}
      </a>
      , Powered by{' '}
      <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
        {' '}
        React{' '}
      </a>
    </Footer>
  );
};
