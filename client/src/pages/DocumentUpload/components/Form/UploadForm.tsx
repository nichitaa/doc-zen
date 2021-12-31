import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import LottieAnimation from '@components/shared/LottieAnimation/LottieAnimation';
import docPreviewLottie from '@assets/lottie-animations/doc-preview.json';
import { documentsAPI } from '@feature/documents/documents-api-slice';
import { DocumentTypesEnum, IDocument } from '@models/IDocument';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Tooltip,
  Upload,
} from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import './form-styless.less';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;

const UploadForm = () => {
  const [isRevision, setIsRevision] = useState<boolean>(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const { data } = documentsAPI.useFetchDocumentsQuery(null);
  const [createDocument, { isLoading: isUploadDocumentLoading }] =
    documentsAPI.useCreateDocumentMutation();

  const onIsParentRevisionCheckboxChange = (e: CheckboxChangeEvent) => {
    setIsRevision(e.target.checked);
  };

  const onFinish = async (values: any) => {
    const formData = new FormData();
    formData.append('file', fileList[0]);
    formData.append(
      'data',
      JSON.stringify({
        name: values.name,
        description: values.description,
        documentType: values.type,
        password: values.password ? values.password : null,
        isRevision: values.isRevision,
        parentId: values.documentRevisionParent
          ? values.documentRevisionParent
          : null,
      })
    );

    const response = await createDocument(formData);
    if ('data' in response) {
      if (response.data.isSuccess) {
        form.resetFields();
        setFileList([]);
        message.success(response.data.message, 3);
      } else message.error(response.data.error, 5);
    }
  };

  const onFinishFailed = (errorInfo: any) =>
    message.error('Please fill in all the required fields!', 2);

  const requiredMsg = 'This field is required!';
  const fileDraggerProps = {
    maxCount: 1,
    fileList: fileList,
    onRemove: (file) => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      console.log('before upload: ', file);
      if (file.type === 'application/pdf') {
        if (fileList.length === 0) setFileList([file]);
        else message.error('A file is already uploaded!', 2);
      } else message.error('Please select a pdf document!');
      return false;
    },
    onDrop(e) {
      console.log('files dropped: ', e.dataTransfer.files.length);
    },
    multiple: false,
    previewFile: (file) => {},
    listType: 'picture',
  };

  return (
    <Row className={'upload-container'}>
      <Col span={12}>
        <Form
          form={form}
          className={'upload-form'}
          labelAlign={'left'}
          name={'uploadForm'}
          layout={'horizontal'}
          labelCol={{ span: 9 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            label='Name'
            name='name'
            rules={[{ required: true, message: requiredMsg }]}
          >
            <Input maxLength={30} placeholder={'My CI'} />
          </Form.Item>
          <Form.Item
            label='Description'
            name='description'
            rules={[{ required: true, message: requiredMsg }]}
          >
            <TextArea
              placeholder={'2022 CI - John Doe - expiring on 01.01.2030'}
              showCount={true}
              maxLength={100}
              rows={2}
            />
          </Form.Item>

          <Form.Item
            label='Type'
            name='type'
            rules={[{ required: true, message: requiredMsg }]}
          >
            <Select
              placeholder='Document type e.g: IDENTITY_CARD'
              allowClear={true}
            >
              {Object.keys(DocumentTypesEnum).map((el) => (
                <Option key={el} value={DocumentTypesEnum[el]}>
                  {DocumentTypesEnum[el]}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Tooltip
            placement={'top'}
            title={
              'A document password will represent a higher level of document security'
            }
          >
            <Form.Item
              label='Password'
              name='password'
              rules={[{ required: false }]}
            >
              <Input.Password
                maxLength={9}
                placeholder={'Secure document access with a password'}
              />
            </Form.Item>
          </Tooltip>

          <Form.Item
            label={'This is a existing document revision'}
            name={'isRevision'}
            valuePropName={'checked'}
            initialValue={isRevision}
          >
            <Checkbox
              checked={isRevision}
              onChange={onIsParentRevisionCheckboxChange}
            />
          </Form.Item>

          {isRevision && (
            <Form.Item
              name='documentRevisionParent'
              label='Parent of the document revision'
              rules={[{ required: isRevision, message: requiredMsg }]}
            >
              <Select
                placeholder='Select a the parent document for this revision'
                allowClear={true}
              >
                {data &&
                  data.data &&
                  data.data.map((doc: IDocument) => (
                    <Option key={doc._id} value={doc._id}>
                      {doc.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            rules={[{ required: true, message: requiredMsg }]}
            name={'file'}
            valuePropName={'file'}
            getValueFromEvent={(e) =>
              !fileList[0] || fileList[0].status === 'removed' ? [] : fileList
            }
          >
            {/*@ts-ignore*/}
            <Dragger {...fileDraggerProps}>
              <p className='ant-upload-drag-icon'>
                <InboxOutlined />
              </p>
              <p className='ant-upload-text'>
                Click or drag file to this area to upload
              </p>
              <p className='ant-upload-hint'>Upload single document</p>
            </Dragger>
          </Form.Item>

          <Form.Item>
            <Row gutter={[8, 8]}>
              <Col span={20}>
                <Button
                  block={true}
                  type='primary'
                  htmlType='submit'
                  loading={isUploadDocumentLoading}
                >
                  Submit
                </Button>
              </Col>
              <Col span={4}>
                <Button
                  block={true}
                  danger={true}
                  type='dashed'
                  onClick={() => form.resetFields()}
                >
                  Reset
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Col>
      <Col span={10}>
        {fileList[0] !== undefined ? (
          <Document onLoadError={console.error} file={fileList[0]}>
            <Page width={400} pageNumber={1} />
          </Document>
        ) : (
          <LottieAnimation loop={false} speed={0.5} lotti={docPreviewLottie} />
        )}
      </Col>
    </Row>
  );
};

export default UploadForm;
