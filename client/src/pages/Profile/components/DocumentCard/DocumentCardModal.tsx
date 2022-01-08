import React, { FC, useState } from 'react';
import { Button, Checkbox, Col, DatePicker, Form, Input, message, Modal, Row, Select, Tag, Tooltip } from 'antd';
import { nanoid } from 'nanoid';
import { DocumentTypesEnum, IDocument } from '@models/IDocument';
import { DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { documentsAPI } from '@feature/documents/documents-api-slice';

const { TextArea } = Input;

interface MainProps {
  isVisible: boolean;
  doc: IDocument;

  onDownload?(): void;

  close(): void;
}

const DocumentCardModal: FC<MainProps> = ({
                                            doc,
                                            isVisible,
                                            onDownload,
                                            close,
                                          }) => {
  const [isRevision, setIsRevision] = useState<boolean>(doc.isRevision);

  const [deleteDoc, { isLoading: isDeleteLoading }] =
    documentsAPI.useDeleteDocumentMutation();
  const [updateDoc, { isLoading: isUpdateLoading, error: updateError }] =
    documentsAPI.useUpdateDocumentMutation();
  const { data } = documentsAPI.useFetchDocumentsQuery(null);

  const [form] = Form.useForm();

  const closeModal = () => {
    form.resetFields();
    close();
  };

  const deleteDocument = async (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    const response = await deleteDoc(doc._id);
    if ('data' in response) {
      if (response.data.isSuccess) {
        message.success(response.data.message, 2);
        close();
      } else message.error(response.data.error);
    }
  };

  const onDocumentUpdate = async () => {
    const res = await updateDoc({
      _id: doc._id,
      userId: doc.userId,
      name: form.getFieldValue('name'),
      description: form.getFieldValue('description'),
      documentType: form.getFieldValue('documentType'),
      publicReferenceId: form.getFieldValue('publicReferenceId'),
      isRevision: form.getFieldValue('isRevision'),
      parentId: form.getFieldValue('isRevision')
        ? form.getFieldValue('documentRevisionParent')
        : null,
    } as IDocument);
    console.log('response: ', res);

    // @ts-ignore
    if (res?.error?.data?.error) message.error(res.error.data.error);

  };

  return (
    <Modal
      title={
        <>
          Details &nbsp;
          {doc.publicReferenceId ? (
            <Tag color={'volcano'} className={'doc-tag'}>
              public
            </Tag>
          ) : (
            <Tag color={'lime'} className={'doc-tag'}>
              private
            </Tag>
          )}
          {doc.password ? (
            <Tag color={'green'} className={'doc-tag'}>
              secured
            </Tag>
          ) : (
            <Tag color={'blue'} className={'doc-tag'}>
              regular
            </Tag>
          )}
        </>
      }
      width={500}
      visible={isVisible}
      footer={null}
      onCancel={closeModal}
    >
      <Form
        labelAlign={'left'}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        form={form}
        initialValues={{
          name: doc.name,
          description: doc.description,
          documentType: doc.documentType,
          createdOn: moment(doc.createdAt),
          publicReferenceId: doc.publicReferenceId,
          documentRevisionParent: doc.parentId,
        }}
      >
        <Form.Item
          name={'name'}
          label={'Name'}
          rules={[{ required: true, message: 'document name is required' }]}
        >
          <Input placeholder={'name e.g.: My Identity card'} />
        </Form.Item>

        <Form.Item
          label='Description'
          name='description'
          rules={[{ required: true, message: 'document name is required' }]}
        >
          <TextArea
            placeholder={
              'description e.g.: 2022 CI - John Doe - expiring on 01.01.2030'
            }
            showCount={true}
            maxLength={100}
            rows={2}
          />
        </Form.Item>

        <Form.Item
          label='Type'
          name='documentType'
          rules={[{ required: true, message: 'document type is required' }]}
        >
          <Select placeholder='type e.g: IDENTITY_CARD' allowClear={true}>
            {Object.keys(DocumentTypesEnum).map((el) => (
              <Select.Option key={el} value={DocumentTypesEnum[el]}>
                {DocumentTypesEnum[el]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={'is Revision'}
          name={'isRevision'}
          valuePropName={'checked'}
          initialValue={isRevision}
        >
          <Checkbox
            checked={isRevision}
            onChange={(e) => setIsRevision(e.target.checked)}
          />
        </Form.Item>

        {isRevision && (
          <Form.Item
            name='documentRevisionParent'
            label='Revision for'
            rules={[
              {
                required: true,
                message: 'document parent is required for a revision document',
              },
            ]}
          >
            <Select placeholder='Select parent document' allowClear={true}>
              {data &&
                data.data &&
                data.data.map((el: IDocument) => (
                  <Select.Option key={el._id} value={el._id}>
                    {el.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item label='Created On' name='createdOn'>
          <DatePicker
            style={{ width: '100%' }}
            format='YYYY-MM-DD HH:mm:ss'
            disabled
          />
        </Form.Item>

        <Row gutter={8}>
          <Col span={7}>
            <Tooltip
              placement={'topLeft'}
              title={
                'Will generate a document reference ID that you can share with anyone'
              }
            >
              <Button
                danger={true}
                onClick={() =>
                  form.setFieldsValue({
                    publicReferenceId: nanoid(10),
                  })
                }
                block={true}
                type={'dashed'}
              >
                Public
              </Button>
            </Tooltip>
          </Col>

          <Col span={7}>
            <Tooltip
              placement={'top'}
              title={'Deletes the reference ID and makes the document private'}
            >
              <Button
                onClick={() => {
                  form.setFieldsValue({
                    publicReferenceId: null,
                  });
                }}
                block={true}
                type={'dashed'}
              >
                Private
              </Button>
            </Tooltip>
          </Col>

          <Col span={10}>
            <Tooltip
              placement={'topRight'}
              title={`Document's reference ID, DON'T forget to copy it and press Update button!`}
            >
              <Form.Item
                style={{ width: '100%' }}
                wrapperCol={{ span: 24 }}
                name={'publicReferenceId'}
              >
                <Input
                  style={{ width: '100%' }}
                  disabled={true}
                  placeholder={'reference ID'}
                />
              </Form.Item>
            </Tooltip>
          </Col>
        </Row>
        <Row gutter={8} justify={'end'}>
          <Col span={7}>
            <Button block={true} type={'default'} onClick={onDownload}>
              Download File
            </Button>
          </Col>
          <Col span={15}>
            <Button
              loading={isUpdateLoading}
              onClick={onDocumentUpdate}
              block={true}
              type={'primary'}
            >
              Update
            </Button>
          </Col>

          <Col span={2}>
            <Button
              loading={isDeleteLoading}
              onClick={deleteDocument}
              danger={true}
              icon={<DeleteOutlined />}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DocumentCardModal;
