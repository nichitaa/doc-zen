import { Col, Row, Form, Input, Button, message } from 'antd';
import { DoclockAPI } from '@services/doclockAPI';
import fileDownload from 'js-file-download';
import { useAppSelector } from '@hooks/rtk-hooks';

const SharedDocumentsForm = () => {
  const { auth0AccessToken } = useAppSelector((s) => s.authorization);
  const [form] = Form.useForm();

  const onDownload = async ({
    refId,
    pass,
  }: {
    refId: string;
    pass?: string;
  }) => {
    const { filename, file, error } =
      await DoclockAPI.getInstance().downloadSharedDocument(
        auth0AccessToken!,
        refId,
        pass
      );

    if (error) return message.error(error, 4);
    else {
      form.resetFields();
      fileDownload(file, filename);
    }
  };

  return (
    <Row>
      <Col span={6}>
        <Form
          form={form}
          className={'shared-documents-form'}
          labelAlign={'left'}
          name={'sharedDocumentsForm'}
          onFinish={onDownload}
          autoComplete={'off'}
          layout={'horizontal'}
          labelCol={{ span: 10 }}
        >
          <Form.Item
            label={'Reference ID'}
            name={'refId'}
            rules={[
              {
                required: true,
                message: 'Document Reference is required',
              },
            ]}
          >
            <Input maxLength={30} placeholder={'kQ1A64-tP2'} />
          </Form.Item>
          <Form.Item label={'Password'} name={'pass'}>
            <Input.Password maxLength={9} placeholder={'optional'} />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }} labelCol={{ span: 24 }}>
            <Button block={true} type={'primary'} htmlType={'submit'}>
              Download
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default SharedDocumentsForm;
