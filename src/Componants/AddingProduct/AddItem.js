import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Input, Select, Space, Radio } from 'antd';
import currencyOptions from "./CurrencyData";
import ImageUpload from "./ImageUpload";

const { Option } = Select;

const SubmitButton = ({ form }) => {
  const [submittable, setSubmittable] = useState(false);
  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      }
    );
  }, [form, values]);

  const onFinish = () => {
    const timestamp = new Date().toLocaleString();
    const payload = {
      id: Math.random().toString(36).substr(3, 11),
      productName: form.getFieldValue('productName'),
      cost: form.getFieldValue('cost'),
      currency: form.getFieldValue('currency'),
      timestamp: timestamp,
    };

    axios
      .post('http://localhost:3004/Entry', payload)
      .then((response) => {
        console.log('Data posted successfully:', response.data);
      })
      .catch((error) => {
        console.error('Error posting data:', error);
      });
  };

  return (
    <Button type="primary" htmlType="submit" disabled={!submittable} onClick={onFinish}>
      Submit
    </Button>
  );
};

const AddItem = () => {
  const [form] = Form.useForm();
  const [uploadImage, setUploadImage] = useState(false);

  const handleImageUploadChange = (e) => {
    const value = e.target.value;
    setUploadImage(value === 'yes');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Form form={form} name="validateOnly" layout="vertical" autoComplete="off" style={{ width: '300px' }}>
        <h1 style={{ textAlign: 'center' }}>Add Product</h1>
        <Form.Item
          name="productName"
          label="Product Name"
          rules={[
            {
              required: true,
              message: 'Please enter the product name',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="cost"
          label="Cost"
          rules={[
            {
              required: true,
              message: 'Please enter the cost',
            },
            {
              pattern: /^[0-9]*$/,
              message: 'Please enter a valid cost (numbers only)',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="currency"
          label="Currency"
          rules={[
            {
              required: true,
              message: 'Please select the currency',
            },
          ]}
        >
          <Select placeholder="Select currency">
            {currencyOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="uploadImage"
          label="Upload Image?"
          rules={[
            {
              required: true,
              message: 'Please select whether to upload an image',
            },
          ]}
        >
          <Radio.Group onChange={handleImageUploadChange}>
            <Radio value="yes">Yes</Radio>
            <Radio value="no">No</Radio>
          </Radio.Group>
        </Form.Item>
        <div className={`image-upload-section ${uploadImage ? 'show' : 'hide'}`}>
          <Form.Item name="image" label="Image">
            <ImageUpload />
          </Form.Item>
        </div>
        <Form.Item>
          <Space>
            <SubmitButton form={form} />
            <Button htmlType="reset">Reset</Button>
          </Space>
        </Form.Item>
      </Form>
      <style>
        {`
        .image-upload-section {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.8s ease;
        }
        
        .image-upload-section.show {
          max-height: 1000px;
          transition: max-height 0.8s ease;
        }
        
        .image-upload-section.hide {
          max-height: 0;
          transition: max-height 0.3s ease;
        }
        `}
      </style>
    </div>
  );
};

export default AddItem;
