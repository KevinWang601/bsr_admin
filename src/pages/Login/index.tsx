import Footer from '@/components/Footer'; // import { login } from '@/services/ant-design-pro/api';

import { login, code } from '@/services/login';
import { LockOutlined, UserOutlined, CodeOutlined } from '@ant-design/icons';
import { LoginForm, ProFormCheckbox, ProFormText } from '@ant-design/pro-components';
import { Alert, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import { saveLoginDto } from '@/util';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

let current = '';

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<DTO.Resp<DTO.Login>>({});
  const [codeUrlState, setCodeUrlState] = useState<string>();
  const { setInitialState } = useModel('@@initialState');

  const fetchCode = async () => {
    current = new Date().getTime() + '';
    const codeUrl = await code(current);
    setCodeUrlState(codeUrl);
  };

  useEffect(() => {
    fetchCode();
  }, []);

  const handleSubmit = async (values: DTO.LoginParams) => {
    try {
      // 登录
      const resp = await login({ ...values, cur: current });
      if (resp.result === 'success') {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        await setInitialState((s) => ({ ...s, currentUser: resp.model }));
        saveLoginDto(resp.model);
        /** 此方法会跳转到 redirect 参数所在的位置 */

        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as {
          redirect: string;
        };
        setTimeout(() => {
          history.push(redirect || '/');
        }, 500);
        return;
      }
      setUserLoginState(resp);
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  const { result, msg } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="Banshanren Manager"
          subTitle={'最好的华人小说社区'}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as DTO.LoginParams);
          }}
        >
          {result === 'fail' && <LoginMessage content={msg || ''} />}
          {
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'用户名:'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={'密码:'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
              <div className={styles.code}>
                <ProFormText
                  name="code"
                  fieldProps={{
                    size: 'large',
                    prefix: <CodeOutlined className={styles.prefixIcon} />,
                  }}
                  width={180}
                  placeholder={'验证码:'}
                  rules={[
                    {
                      required: true,
                      message: '验证码是必填项！',
                    },
                  ]}
                />
                <img
                  src={codeUrlState}
                  onClick={() => {
                    fetchCode();
                  }}
                  width={120}
                  height={40}
                  alt=""
                />
              </div>
            </>
          }
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              忘记密码 ?
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
