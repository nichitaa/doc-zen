import React from 'react';
import passwordLottie from '@assets/lottie-animations/password.json';
import { Button, Form, Input, Modal } from 'antd';
import LottieAnimation from '@components/shared/LottieAnimation/LottieAnimation';
import { motion } from 'framer-motion';
import './modal-styles.less';

interface MainProps {
  isVisible: boolean;

  onSubmit(pass?: string): void;

  close(): void;
}

const PasswordModal: React.FC<MainProps> = ({ isVisible, onSubmit, close }) => {
  const [form] = Form.useForm();

  const onFormSubmitSuccess = (values) => {
    onSubmit(values.password);
    form.resetFields();
  };

  const closeModal = () => {
    form.resetFields();
    close();
  };
  return (
    <Modal
      className={'password-modal-container'}
      width={400}
      visible={isVisible}
      onCancel={closeModal}
      footer={null}
    >
      <Form
        form={form}
        onFinish={onFormSubmitSuccess}
        layout='horizontal'
        name='documentPassword'
      >
        <Form.Item>
          <LottieAnimation
            height={'150px'}
            width={'250px'}
            loop={true}
            speed={0.5}
            lotti={passwordLottie}
          />
        </Form.Item>
        <Form.Item
          name='password'
          rules={[
            {
              required: true,
              message: 'The document access password is required!',
            },
            { whitespace: true }
          ]}
        >
          <Input.Password
            placeholder={'Enter the document password'}
            maxLength={30}
          />
        </Form.Item>
        <Form.Item>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button
              className={'pass-btn'}
              type={'primary'}
              htmlType={'submit'}
              block={true}
            >
              Request access
            </Button>
          </motion.div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordModal;
