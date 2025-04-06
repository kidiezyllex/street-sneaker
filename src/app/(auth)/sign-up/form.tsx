'use client';

import Captcha from '@/components/Captcha';
import { useUser } from '@/context/useUserContext';
import { setCookies } from '@/helper';
import { useRegister } from '@/hooks/authentication';
import { IRegister } from '@/interface/request/authentication';
import { Button, Divider, Form, Input, message } from 'antd';
import { FormProps } from 'antd/lib';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type FieldType = {
  username: string;
  email: string;
  phone: string;
  password: string;
  fullName: string;
  invitationCode: string;
  confirmPassword: string;
  shopName: string;
  shopAddress: string;
};

const SignUpForm = () => {
  const router = useRouter();
  const { mutateAsync, isPending } = useRegister();
  const { loginUser } = useUser()
  const [messageApi, contextHolder] = message.useMessage();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [formValues, setFormValues] = useState<FieldType | null>(null);

  const handleCaptchaSuccess = async () => {
    setShowCaptcha(false);
    if (formValues) {
      try {
        const payload: IRegister = {
          username: formValues.username,
          email: formValues.email,
          phone: formValues.phone,
          password: formValues.password,
          fullName: formValues.fullName,
          invitationCode: formValues.invitationCode,
          shopName: formValues.shopName,
          shopAddress: formValues.shopAddress
        };
        const response = await mutateAsync(payload);
        loginUser(response?.data?.user, response?.data?.accessToken);
        messageApi.success('Đăng ký tài khoản thành công!');
        setCookies(response?.data?.accessToken);
        router.push('/seller/dashboard');
      } catch (error: any) {
        messageApi.error(error?.response?.data?.message || 'Có lỗi xảy ra khi đăng ký');
      }
    }
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values: FieldType) => {
    setFormValues(values);
    setShowCaptcha(true);
  };

  return (
    <>
      {contextHolder}
      {!showCaptcha ? (
        <h1 className='text-[28px] font-medium'>
          Tạo tài khoản seller
        </h1>
      ) : (
        <Captcha
          onSuccess={handleCaptchaSuccess}
          onError={(message: string) => messageApi.error(message)}
          onBack={() => setShowCaptcha(false)}
        />
      )}
      <Form
        name="register_form"
        onFinish={onFinish}
        layout='vertical'
      >
        <Form.Item
          label={<strong>Tên tài khoản</strong>}
          name="username"
          className='!mb-4'
          rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<strong>Email</strong>}
          className='!mb-3'
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Vui lòng nhập email hợp lệ!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<strong>Số điện thoại</strong>}
          className='!mb-3'
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<strong>Họ và tên</strong>}
          className='!mb-3'
          name="fullName"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={<strong>mật khẩu</strong>}
          className='!mb-4'
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password
            type="password"
            placeholder="Mật khẩu"
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label={<strong>Xác nhận mật khẩu</strong>}
          dependencies={['password']}
          className='!mb-4'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập mật khẩu',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu mới bạn đã nhập không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label={<strong>Mã mời</strong>}
          name="invitationCode"
          className='!mb-4'
          rules={[{ required: true, message: 'Vui lòng nhập mã mời!' }]}
        >
          <Input />
        </Form.Item>
        <Divider className='!mb-3' />
        <Form.Item
          label={<strong>Tên cửa hàng</strong>}
          name="shopName"
          className='!mb-4'
          rules={[{ required: true, message: 'Vui lòng nhập tên cửa hàng!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={<strong>Địa chỉ cửa hàng</strong>}
          name="shopAddress"
          className='!mb-4'
          rules={[{ required: true, message: 'Vui lòng địa chỉ cửa hàng!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item className='!mb-2'>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button w-full  !font-medium !h-[32px]"
            loading={isPending}
          >
            Tạo tài khoản
          </Button>
        </Form.Item>
        <div className="flex justify-center items-center pb-4 ">
          <span className="border-t border-gray-300 w-1/6 mr-1"></span>
          <span className="text-[#767676] text-[11px]">Bạn đã có tài khoản Amazon Seller?</span>
          <span className="border-t border-gray-300 w-1/6 ml-1"></span>
        </div>

        <Button className='login_register !w-full !h-[28px]' onClick={() => router.push('/sign-in')}>
          Đăng nhập
        </Button>

      </Form>
    </>
  );
};

export default SignUpForm;