import React, { useState } from 'react';
import { Progress, Popover } from 'antd';
import { ProFormText } from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import { LockOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
import styles from './SetPasswordWithPopover.less';

interface Iprops<T extends Record<string, any> = Record<string, any>> {
  formRef: React.MutableRefObject<ProFormInstance<T> | undefined>;
}

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <span>强度：强</span>
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <span>强度：中</span>
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <span>强度：太短</span>
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

const SetPasswordWithPopover: React.FC<Iprops> = (props: Iprops) => {
  const intl = useIntl();
  const confirmDirty = false;
  const [visible, setVisible]: [boolean, any] = useState(false);
  const [popover, setPopover]: [boolean, any] = useState(false);
  const getPasswordStatus = () => {
    const value = props.formRef.current?.getFieldFormatValue?.('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };
  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (
      value &&
      value !== (props.formRef.current?.getFieldFormatValue?.('password') as unknown as string)
    ) {
      return promise.reject('两次输入的密码不匹配!');
    }
    return promise.resolve();
  };

  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // 没有值的情况
    if (!value) {
      setVisible(!!value);
      return promise.reject(
        intl.formatMessage({
          id: 'pages.login.password.required',
          defaultMessage: '请输入密码!',
        }),
      );
    }
    // 有值的情况
    if (!visible) {
      setVisible(!!value);
    }
    setPopover(!popover);
    if (value.length < 6) {
      return promise.reject('');
    }
    if (value && confirmDirty) {
      props.formRef.current?.validateFieldsReturnFormatValue?.(['confirm']);
    }
    return promise.resolve();
  };

  const renderPasswordProgress = () => {
    const value = props.formRef.current?.getFieldFormatValue?.('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  return (
    <>
      <Popover
        getPopupContainer={(node) => {
          if (node && node.parentNode) {
            return node.parentNode as HTMLElement;
          }
          return node;
        }}
        content={
          visible && (
            <div style={{ padding: '4px 0' }}>
              {passwordStatusMap[getPasswordStatus()]}
              {renderPasswordProgress()}
              <div style={{ marginTop: 10 }}>
                <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
              </div>
            </div>
          )
        }
        overlayStyle={{ width: 240 }}
        placement="right"
        visible={visible}
      >
        <ProFormText.Password
          name="password"
          className={
            props.formRef.current?.getFieldFormatValue?.('password') &&
            props.formRef.current?.getFieldFormatValue('password').length > 0 &&
            styles.password
          }
          rules={[
            {
              validator: checkPassword,
            },
          ]}
          placeholder="至少6位密码，区分大小写"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={styles.prefixIcon} />,
          }}
        />
      </Popover>
      <ProFormText.Password
        name="confirm"
        rules={[
          {
            required: true,
            message: '确认密码',
          },
          {
            validator: checkConfirm,
          },
        ]}
        placeholder="确认密码"
        fieldProps={{
          size: 'large',
          prefix: <LockOutlined className={styles.prefixIcon} />,
        }}
      />
    </>
  );
};

export default SetPasswordWithPopover;
