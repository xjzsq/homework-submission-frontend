import React, { useRef, useState } from 'react';
import { Popover, message, Tabs, Tooltip } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import {
  MailOutlined,
  UserOutlined,
  UserAddOutlined,
  LoadingOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
} from '@ant-design/icons';
import { useIntl, Link, useRequest, history, FormattedMessage, SelectLang } from 'umi';
import { authRegister, passwordRegister, checkUsername } from '@/services/user/api';
import Footer from '@/components/Footer';
import styles from './style.less';
import SetPasswordWithPopover from '../componets/SetPasswordWithPopover';
import ConnectToAuthModal from '../componets/ConnectToAuthModal';
import { MD5 } from 'crypto-js';

interface StateType {
  status?: 'ok' | 'error';
  currentAuthority?: 'user' | 'guest' | 'admin';
  errorCode?: 'inviteCodeError';
  qrcode?: string;
}

interface registerData {
  email: string;
  username: string;
  invite: string;
  password?: string;
  confirm?: string;
  auth?: string;
}

const Register: React.FC = () => {
  const intl = useIntl();
  const [type, setType] = useState('password');
  const [popover, setPopover]: [boolean, any] = useState(false);
  const [inviteCodeError, setInviteCodeError]: [boolean, any] = useState(false);
  const formRef = useRef<ProFormInstance<registerData>>();
  const authModalRef = useRef();

  const AuthSuccess = () => {
    message.success(
      intl.formatMessage({ id: 'pages.register.success', defaultMessage: '注册成功' }),
    );
    history.push({
      pathname: '/user/register-result',
    });
  };

  const { loading: passwordSubmitting, run: doPasswordRegister } = useRequest<{ data: StateType }>(
    passwordRegister,
    {
      manual: true,
      onSuccess: (data: StateType, params: registerData) => {
        if (data.status === 'ok') {
          message.success('注册成功！');
          history.push({
            pathname: '/user/register-result',
            state: {
              account: params.email,
            },
          });
        } else if (data.status === 'error') {
          if (data.errorCode === 'inviteCodeError') {
            setInviteCodeError(true);
            message.error(
              intl.formatMessage({
                id: 'pages.register.inviteCodeError',
                defaultMessage: '邀请码错误或已被使用',
              }),
            );
          } else {
            message.error('发生了不可预料的错误，请联系管理员');
          }
        } else {
          message.error('发生了不可预料的错误，请联系管理员');
        }
      },
      onError: (err: Error) => {
        console.error(err);
      },
    },
  );

  const { loading: authSubmitting, run: doAuthRegister } = useRequest(authRegister, {
    manual: true,
    onSuccess: (data: StateType) => {
      if (data.status === 'ok') {
        (authModalRef.current! as any).setQrcode(data.qrcode);
      } else if (data.status === 'error') {
        if (data.errorCode === 'inviteCodeError') {
          setInviteCodeError(true);
          message.error(
            intl.formatMessage({
              id: 'pages.register.inviteCodeError',
              defaultMessage: '邀请码错误或已被使用',
            }),
          );
        } else {
          message.error('发生了不可预料的错误，请联系管理员');
        }
      } else {
        message.error('发生了不可预料的错误，请联系管理员');
      }
    },
  });
  const {
    loading: checkingUsername,
    data: canUsername,
    run: doCheckUsername,
  } = useRequest(checkUsername, {
    debounceInterval: 300,
    manual: true,
  });

  const onFinish = async (values: registerData) => {
    if (canUsername && !inviteCodeError) {
      setPopover(false);
      if (type == 'password') {
        values.password = MD5(values.password + 'Chtholly').toString();
        values.confirm = undefined;
        doPasswordRegister(values);
      } else if (type == 'auth') {
        doAuthRegister(values);
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="../logo.svg" />
              <span className={styles.title}>{intl.formatMessage({ id: 'app.name' })}</span>
            </Link>
          </div>
          <div className={styles.desc}>
            {intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
          </div>
        </div>
        <div className={styles.main}>
          <ProForm
            formRef={formRef}
            submitter={{
              searchConfig: {
                submitText:
                  type === 'password'
                    ? intl.formatMessage({
                        id: 'pages.register.submit',
                        defaultMessage: '注册',
                      })
                    : intl.formatMessage({
                        id: 'pages.register.qrcode',
                        defaultMessage: '获取验证器二维码',
                      }),
              },
              render: (_, dom) => (
                <>
                  {dom.pop()}
                  <Link className={styles.login} to="/user/login">
                    <span>使用已有账户登录</span>
                  </Link>
                </>
              ),
              submitButtonProps: {
                loading: passwordSubmitting || authSubmitting,
                size: 'large',
                style: {
                  width: '50%',
                },
              },
            }}
            onFinish={onFinish}
            onValuesChange={(values) => {
              // 输入用户名时校验用户名是否可用
              if ('username' in values) {
                doCheckUsername({ username: values.username });
              } else if ('invite' in values) {
                setInviteCodeError(false);
              }
            }}
          >
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane
                key="password"
                tab={intl.formatMessage({
                  id: 'pages.register.passwordRegister.tab',
                  defaultMessage: '账号密码注册',
                })}
              />
              <Tabs.TabPane
                key="auth"
                tab={intl.formatMessage({
                  id: 'pages.register.authRegister.tab',
                  defaultMessage: '验证器注册',
                })}
              />
            </Tabs>
            <ProFormText
              name="username"
              help={
                canUsername == false ? (
                  <span style={{ color: 'red' }}>
                    <FormattedMessage
                      id="pages.login.username.used"
                      defaultMessage="用户名已被使用！"
                    />
                  </span>
                ) : null
              }
              fieldProps={{
                size: 'large',
                status: canUsername == false ? 'error' : '',
                prefix: <UserOutlined className={styles.prefixIcon} />,
                suffix:
                  formRef.current?.getFieldValue('username') == undefined ||
                  formRef.current?.getFieldValue('username') == '' ? (
                    <></>
                  ) : checkingUsername ? (
                    <Tooltip title="检查中...">
                      <LoadingOutlined />
                    </Tooltip>
                  ) : canUsername ? (
                    <Tooltip title="用户名可用~">
                      <CheckCircleTwoTone twoToneColor="#52c41a" />
                    </Tooltip>
                  ) : (
                    <Tooltip title="用户名已被注册或不符规范...">
                      <CloseCircleTwoTone twoToneColor="#eb2f96" />
                    </Tooltip>
                  ),
              }}
              placeholder={intl.formatMessage({
                id: 'pages.login.username.placeholder',
                defaultMessage: '用户名',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.login.username.required"
                      defaultMessage="请输入用户名!"
                    />
                  ),
                },
              ]}
            />
            <Popover
              getPopupContainer={(node) => {
                if (node && node.parentNode) {
                  return node.parentNode as HTMLElement;
                }
                return node;
              }}
              content={
                <div style={{ padding: '4px 0' }}>
                  <span>
                    <FormattedMessage
                      id="pages.register.email.popover"
                      defaultMessage="邮箱将作为重置密码/验证器的唯一凭证，请确认填写无误！"
                    />
                  </span>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={popover}
            >
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <MailOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.register.email.placeholder',
                  defaultMessage: '邮箱',
                })}
                rules={[
                  {
                    required: true,
                    message: '请输入邮箱地址!',
                  },
                  {
                    type: 'email',
                    message: '邮箱地址格式错误!',
                  },
                  {
                    validator: () => {
                      setPopover(true);
                      return Promise.resolve();
                    },
                  },
                ]}
              />
            </Popover>
            <ProFormText
              name="invite"
              help={
                inviteCodeError ? (
                  <span style={{ color: 'red' }}>
                    <FormattedMessage
                      id="pages.register.invite.error"
                      defaultMessage="验证码错误或已被使用！"
                    />
                  </span>
                ) : null
              }
              fieldProps={{
                size: 'large',
                prefix: <UserAddOutlined className={styles.prefixIcon} />,
                status: inviteCodeError ? 'error' : '',
              }}
              placeholder={intl.formatMessage({
                id: 'pages.register.invite.placeholder',
                defaultMessage: '邀请码',
              })}
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.register.invite.required"
                      defaultMessage="请输入邀请码!"
                    />
                  ),
                },
              ]}
            />
            {type === 'password' && <SetPasswordWithPopover formRef={formRef} />}
          </ProForm>
        </div>
      </div>
      <ConnectToAuthModal
        ref={authModalRef}
        username={formRef.current?.getFieldValue('username')}
        success={AuthSuccess}
      />
      <Footer />
    </div>
  );
};
export default Register;
