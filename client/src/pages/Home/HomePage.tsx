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
            <Title style={{ color: '#1890ff' }} level={4}>
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
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
              <Text strong>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book.
              </Text>
              .
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
