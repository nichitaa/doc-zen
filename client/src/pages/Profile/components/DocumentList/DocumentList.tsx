import React, { useEffect, useState } from 'react';
import { Alert, Col, DatePicker, Input, Row, Select, Spin } from 'antd';
import { documentsAPI } from '@feature/documents/documents-api-slice';
import DocumentCard from '../DocumentCard/DocumentCard';
import Fuse from 'fuse.js';
import moment, { Moment } from 'moment';
import './list-styles.less';
import { DocumentTypesEnum, IDocument } from '@models/IDocument';

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface IFilters {
  documentType: undefined | string;
  startDate: null | Moment;
  endDate: null | Moment;
  documentName: undefined | string;
  documentContent: undefined | string;
}

const DocumentList = () => {
  const { data, isLoading, isError, error, isSuccess } =
    documentsAPI.useFetchDocumentsQuery(null);

  const [filtered, setFiltered] = useState<IDocument[]>([]);

  const [filters, setFilters] = useState<IFilters>({} as IFilters);

  // when original data was changed
  useEffect(() => {
    if (data && data.data) setFiltered(data.data);
  }, [data]);

  // when filter values will change
  useEffect(() => {
    if (data && data.data) {
      let temp: IDocument[] = data.data;
      for (let key in filters) {
        const val = filters[key];
        if (val && val !== '') {
          if (key === 'documentType') {
            temp = temp.filter((el) => el.documentType === val);
          }
          if (key === 'documentName') {
            temp = fuseSearch(temp, ['name'], val);
          }
          if (key === 'documentContent') {
            temp = fuseSearch(temp, ['description', 'name'], val);
          }
          if (key === 'startDate') {
            temp = temp.filter((el) => moment(new Date(el.createdAt)) >= val);
          }
          if (key === 'endDate') {
            temp = temp.filter((el) => moment(new Date(el.createdAt)) <= val);
          }
        }
      }
      setFiltered(temp);
    }
  }, [filters]);

  const fuseSearch = (
    array: IDocument[],
    keys: string[],
    value: string,
  ): IDocument[] => {
    const fuse = new Fuse(array, { keys: keys });
    return fuse.search(value).map((el) => el.item);
  };

  return (
    <Spin spinning={isLoading}>
      {isError && (
        <Alert
          type={'error'}
          message={`Something is bad here, ERROR status: ${error!['status']}`}
        />
      )}
      {/*{isError && <pre>{JSON.stringify(error, null, 2)}</pre>}*/}
      <Row gutter={[8, 8]} style={{ marginTop: '15px' }}>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Select
            value={filters.documentType}
            onChange={(value) =>
              setFilters((prev) => ({ ...prev, documentType: value }))
            }
            style={{ width: '100%' }}
            placeholder='Filter by document type'
            allowClear={true}
          >
            {Object.keys(DocumentTypesEnum).map((el) => (
              <Option key={el} value={DocumentTypesEnum[el]}>
                {DocumentTypesEnum[el]}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <RangePicker
            value={[filters.startDate, filters.endDate]}
            onChange={(dates) => {
              if (dates) {
                setFilters((prev) => ({
                  ...prev,
                  startDate: dates![0],
                  endDate: dates![1],
                }));
              } else {
                setFilters((prev) => ({
                  ...prev,
                  startDate: null,
                  endDate: null,
                }));
              }
            }}
            style={{ width: '100%' }}
            placeholder={['Filter by start date', 'to end date interval']}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Search
            value={filters.documentName}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, documentName: e.target.value }))
            }
            placeholder='Search by document name'
            loading={false}
          />
        </Col>
        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
          <Search
            value={filters.documentContent}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                documentContent: e.target.value,
              }))
            }
            placeholder='Fast search by document content'
            loading={false}
          />
        </Col>
      </Row>

      <Row className={'documentsList-container'} gutter={16}>
        {/*<pre>{JSON.stringify(filtered, null, 2)}</pre>*/}
        {filtered &&
          filtered.map((el, idx) => (
            <Col xs={24} sm={24} md={12} lg={8} xl={6} key={idx}>
              <DocumentCard data={el} />
            </Col>
          ))}
      </Row>
    </Spin>
  );
};

export default DocumentList;
