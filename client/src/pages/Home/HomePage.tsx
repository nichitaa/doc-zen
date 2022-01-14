import React from 'react';
import homeLottie from '@assets/lottie-animations/home.json';
import LottieAnimation from '@components/shared/LottieAnimation/LottieAnimation';
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from 'framer-motion';
import { Button, Col, Divider, Row, Timeline, Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

const HomePage = () => {
  const { loginWithPopup } = useAuth0();
  return (
    <>
      <Row
        gutter={[8, 24]}
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Col>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Title level={4}>
              What is doc-zen ?
            </Title>
          </motion.div>
        </Col>
        <Col>
          <motion.div
            initial={{ x: '-40vw' }}
            animate={{ x: 0 }}
            transition={{
              delay: 0.1,
              duration: 0.5,
              type: 'spring',
              stiffness: 120,
            }}
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onTap={() => loginWithPopup()}
            >
              <Button type={'primary'}>Log-In</Button>
            </motion.div>
          </motion.div>
        </Col>
      </Row>

      <Row gutter={[8, 8]}>
        <Col span={12}>
          <Row>
            <Paragraph>
              <Text strong={true}>
                Doc-Zen
              </Text> is a secure cloud storage application that stores and encrypts your documents. You can choose what
              level of security to apply on your documents and share them safely through a unique ID
            </Paragraph>
          </Row>
          <Divider />
          <Row>
            <Timeline>
              <Timeline.Item>Upload a personal document</Timeline.Item>
              <Timeline.Item>Document versioning</Timeline.Item>
              <Timeline.Item>Safe document storage</Timeline.Item>
              <Timeline.Item>Safe document sharing</Timeline.Item>
              <Timeline.Item>Advance filtering options</Timeline.Item>
              <Timeline.Item>Easy to use and friendly UI</Timeline.Item>
            </Timeline>
          </Row>
        </Col>
        <Col span={12}>
          <LottieAnimation
            loop={true}
            speed={0.5}
            lotti={homeLottie}
            width={'500px'}
          />
        </Col>
      </Row>
    </>
  );
};

export default HomePage;
