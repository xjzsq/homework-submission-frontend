import { forwardRef, useImperativeHandle, useState } from 'react';
import { message, Modal, Image, Button, Input, Space, Typography, Row, Col } from 'antd';
import { useIntl, useRequest } from 'umi';
import { checkToken } from '@/services/user/api';
import copy from 'copy-to-clipboard';
const { Text, Link } = Typography;

interface IProps {
  username: string;
  success: () => void;
}

interface IRefProps {
  setQrcode: (value: string) => void;
}

const ConnectToAuthModal = forwardRef<IRefProps | undefined, IProps>((props, ref) => {
  const intl = useIntl();
  const [qrcode, setQrcode] = useState('');
  const [token, setToken] = useState('');
  const [authStatus, setAuthStatus] = useState<'' | 'error' | 'warning' | undefined>('');

  const { loading: tokenSubmitting, run: doCheckToken } = useRequest(checkToken, {
    manual: true,
    onSuccess: (data: boolean) => {
      if (data) {
        props.success();
      } else {
        message.error(
          intl.formatMessage({ id: 'pages.register.token-error', defaultMessage: 'Token验证失败' }),
        );
        setAuthStatus('error');
      }
    },
  });

  useImperativeHandle(ref, () => ({
    setQrcode,
  }));

  return (
    <Modal
      title={intl.formatMessage({
        id: 'pages.register.authModal.title',
        defaultMessage: '绑定验证器',
      })}
      visible={qrcode !== ''}
      closable={false}
      footer={null}
    >
      <Space direction="vertical">
        <Text>
          1. 请在您的手机上下载 Authenticator 应用。我们推荐{' '}
          <Link
            href="https://support.microsoft.com/zh-cn/account-billing/%E4%B8%8B%E8%BD%BD%E5%B9%B6%E5%AE%89%E8%A3%85-microsoft-authenticator-%E5%BA%94%E7%94%A8-351498fc-850a-45da-b7b6-27e523b8702a"
            target="_blank"
          >
            Microsoft Authenticator
          </Link>
          。
        </Text>
        <Text>2. 请使用您的 Authenticator 应用，扫描以下二维码：</Text>
        <Row justify="center">
          <Col>
            <Image
              src={'https://api.pwmqr.com/qrcode/create/?url=' + qrcode}
              preview={false}
              width={196}
            />
          </Col>
        </Row>
        <Text>如果您的 Authenticator 应用不支持或您不不方便扫描二维码，也可以复制以下链接：</Text>
        <Input.Group compact>
          <Input
            style={{ width: 'calc(100% - 63px)' }}
            type="text"
            name="auth"
            disabled={true}
            value={qrcode}
          />
          <Button
            type="primary"
            onClick={() => {
              copy(qrcode);
              message.success(
                intl.formatMessage({
                  id: 'app.copytoclipboard',
                  defaultMessage: '已成功复制到剪贴板！',
                }),
              );
            }}
          >
            {intl.formatMessage({
              id: 'app.copy',
              defaultMessage: '复制',
            })}
          </Button>
        </Input.Group>
        <Text>3. 请输入您的两步验证软件产生的六位数字验证码：</Text>
        <Row justify="center">
          <Col>
            <Space>
              <Input
                status={authStatus}
                name="auth"
                maxLength={6}
                value={token}
                onChange={(e) => {
                  const { value } = e.target;
                  setAuthStatus('');
                  setToken(value.replace(/[^\d]/g, ''));
                }}
              />
              <Button
                type="primary"
                loading={tokenSubmitting}
                onClick={() => doCheckToken({ username: props.username, token })}
              >
                {intl.formatMessage({
                  id: 'pages.register.authModal.check',
                  defaultMessage: '验证',
                })}
              </Button>
            </Space>
          </Col>
        </Row>
      </Space>
    </Modal>
  );
});

export default ConnectToAuthModal;
