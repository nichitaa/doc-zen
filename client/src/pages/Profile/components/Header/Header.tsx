import React from 'react';
import { Avatar, Button, Col, Row, Typography } from 'antd';
import { motion, Variants } from 'framer-motion';
import { useAuth0 } from '@auth0/auth0-react';
import { useAppDispatch } from '@hooks/rtk-hooks';
import { clearToken } from '@feature/authorization/authorization-slice';
import {
  GoogleOutlined,
  LogoutOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import './header-styles.less';

const { Title, Text } = Typography;

const headerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -200,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1,
      type: 'spring',
      stiffness: 110,
      mass: 0.6,
    },
  },
};
const Header = () => {
  const { user, logout } = useAuth0();
  const dispatch = useAppDispatch();

  const userLogout = () => {
    dispatch(clearToken());
    logout();
  };
  return (
    <motion.div
      variants={headerVariants}
      initial={'hidden'}
      animate={'visible'}
    >
      <Row gutter={[24, 16]} className={'profile-section-container'}>
        <Col>
          <Row gutter={[24, 16]}>
            <Col>
              <Avatar
                shape='square'
                size={85}
                className={'profile-image'}
                src={user?.picture}
                icon={<UserOutlined />}
              />
            </Col>
            <Col>
              <Row>
                <Title level={4}>{user?.name}</Title>
              </Row>
              <Row>
                <Text type={'secondary'}>
                  <GoogleOutlined /> {user?.nickname}
                </Text>
              </Row>
              <Row>
                <Text type={'secondary'}>
                  <MailOutlined /> {user?.email}
                </Text>
              </Row>
            </Col>
          </Row>
        </Col>

        <Col />
      </Row>
    </motion.div>
  );
};

export default Header;
