import React, { useState } from 'react';
import { Card, Col, message, Row, Skeleton, Tag, Badge } from 'antd';
import { IDocument } from '@models/IDocument';
import { motion } from 'framer-motion';
import PasswordModal from '@pages/Profile/components/PasswordModal/PasswordModal';
import { documentsAPI } from '@feature/documents/documents-api-slice';
import { useAppSelector } from '@hooks/rtk-hooks';
import fileDownload from 'js-file-download';
import { DocZenAPI } from '@services/docZenAPI';
import DocumentCardModal from '@pages/Profile/components/DocumentCard/DocumentCardModal';
import './card-styles.less';

const { Meta } = Card;

const DocumentCard = ({ data }: { data: IDocument }) => {
  const { auth0AccessToken } = useAppSelector((s) => s.authorization);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);

  const onDownloadHandler = async () => {
    if (data.password) {
      setIsPasswordModalVisible(true);
    } else {
      downloadDocument();
    }
  };

  const downloadDocument = async (pass?: string) => {
    const { filename, file, error } =
      await DocZenAPI.getInstance().downloadDocument(
        auth0AccessToken!,
        data._id,
        pass
      );

    if (error) return message.error(error, 4);
    if (isPasswordModalVisible) setIsPasswordModalVisible(false);
    return fileDownload(file, filename);
  };

  return (
    <>
      <motion.div whileHover={{ y: -4 }} className={'app-doc-container'}>
        <Card
          className={'app-doc-card'}
          onClick={() => setIsDetailsModalVisible(true)}
        >
          <Skeleton loading={false} avatar active>
            <Meta
              title={
                <>
                  <Row justify={'space-between'}>
                    <Col className={'doc-name'}>{data.name}</Col>
                    <Col>
                      {data.publicReferenceId ? (
                        <Tag color={'volcano'} className={'doc-tag'}>
                          public
                        </Tag>
                      ) : (
                        <Tag color={'lime'} className={'doc-tag'}>
                          private
                        </Tag>
                      )}
                      {data.password ? (
                        <Tag color={'green'} className={'doc-tag'}>
                          secured
                        </Tag>
                      ) : (
                        <Tag color={'blue'} className={'doc-tag'}>
                          regular
                        </Tag>
                      )}
                    </Col>
                  </Row>
                </>
              }
              description={
                <>
                  <Row justify={'space-between'} align={'bottom'}>
                    <Col className={'doc-description'}>{data.description}</Col>
                    <Col className={'doc-timestamp'}>
                      {new Date(data.createdAt).toLocaleString()}
                    </Col>
                  </Row>
                </>
              }
            />
          </Skeleton>
        </Card>
      </motion.div>
      <DocumentCardModal
        doc={data}
        onDownload={onDownloadHandler}
        isVisible={isDetailsModalVisible}
        close={() => setIsDetailsModalVisible(false)}
      />
      <PasswordModal
        isVisible={isPasswordModalVisible}
        close={() => setIsPasswordModalVisible(false)}
        onSubmit={downloadDocument}
      />
    </>
  );
};

export default DocumentCard;
