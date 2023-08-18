// @ts-nocheck

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import base_url from './base_url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader';

interface FormData {
  recipient_info: {
    name: string;
    phone: string;
    address: string;
    postal_code: string;
  };
  sender_info: {
    name: string;
    email: string;
    phone: string;
    address: string;
    postal_code: string;
  };
  items: {
    name: string;
    weight: number;
    fee: string;
  }[];
  order_addons: {
    addon: number;
    addon_choice: number;
  }[];
  type: string;
  status: string;
  who_pay: string;

  [key: string]: any;
}

const initialFormData: FormData = {
  "recipient_info": {
    "name": "",
    "phone": "",
    "address": "",
    "postal_code": ""
  },
  "sender_info": {
    "name": "",
    "email": "",
    "phone": "",
    "address": "",
    "postal_code": ""
  },
  "items": [
    {
      "name": "foods",
      "weight": 0,
      "fee": "0"
    }
  ],
  "order_addons": [],
  "type": "mm to sg",
  "status": "pending",
  "who_pay": "mm pay"
};

const MyForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormData>({ ...initialFormData });
  const [addons, setAddons] = useState<any[]>([]); // Store addon data

  useEffect(() => {
    const fetchAddons = async () => {
      try {
        const response = await axios.get(`${base_url()}/api/addons/`);
        const filteredAddons = response.data.filter((addon: any) => addon.type === formData.type);
        setAddons(filteredAddons);
      } catch (error) {
        console.log('Error fetching addons:', error);
      }
    };
    fetchAddons();
  }, [formData.type]);

  const hasEmptyFields = () => Object.keys(formData).some((category) => {
    if (typeof formData[category] === 'object') {
      return Object.values(formData[category]).some((value) => value === '');
    }
    return formData[category] === '';
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (hasEmptyFields()) {
      return
    }
    try {
      console.log(formData)
      setSubmitting(true)
      const response = await axios.post(`${base_url()}/api/orders/`, formData);
      console.log('Response:', response.data);
      window.open('/success', '_self')
      setSubmitting(false)
    } catch (error) {
      setSubmitting(false)
      alert('An error occurs.')
      console.log('Error:', error);
    }
  };


  useEffect(() => {
    if (hasEmptyFields()) {
      setFormErrors(formData);
      console.log(formErrors)
      return;
    }
  })

  const addItem = () => {
    setFormData(prevData => ({
      ...prevData,
      items: [...prevData.items, { name: '', weight: 0, fee: '0' }],
    }));
  };

  const deleteItem = (index: number) => {
    setFormData(prevData => ({
      ...prevData,
      items: prevData.items.filter((_, i) => i !== index),
    }));
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    category: string,
    field: string
  ) => {
    const { value } = event.target;

    setFormData(prevData => ({
      ...prevData,
      [category]: {
        ...prevData[category],
        [field]: value,
      },
    }));
  };

  const handleRootChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: string
  ) => {
    const { value } = event.target;

    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
  };


  const handleItemChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
    field: string
  ) => {
    const { value } = event.target;

    setFormData(prevData => ({
      ...prevData,
      items: prevData.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };


  const handleAddonCheck = (event: React.ChangeEvent<HTMLInputElement>, index: number, addon_id:number) => {
    const checked = event.target.checked;
    if (checked) {
      setFormData(prevData => ({
        ...prevData,
        order_addons: [
          ...prevData.order_addons,
          { addon: addon_id, addon_choice: null }
        ]
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        order_addons: prevData.order_addons.filter(addonObj => addonObj.addon !== index)
      }));
    }
  };


  const handleAddonChoiceChange = (event: React.ChangeEvent<HTMLSelectElement>, addonIndex: number) => {
    const { value } = event.target;
    setFormData(prevData => {
      const updatedOrderAddons = prevData.order_addons.map(addonObj =>
        addonObj.addon === addonIndex ? { ...addonObj, addon_choice: value } : addonObj
      );
      return { ...prevData, order_addons: updatedOrderAddons };
    });
  };

  return (
    <form onSubmit={handleSubmit}>

      <div className="bg-amber-100 my-8 rounded-xl shadow-md p-8">
        <h2 className="text-amber-600 font-bold mb-4">Information</h2>
        <select
          name="type"
          className="me-8 sm:me-4 mb-4 px-4 py-2 bg-white rounded-xl border-none"
          value={formData.type}
          onChange={event => handleRootChange(event, 'type')}
        >
          <option value="mm to sg">MM to SG</option>
          <option value="sg to mm">SG to MM</option>
        </select>
        <select
          className="me-8 sm:me-4 mb-4 px-4 py-2 bg-white rounded-xl border-none"
          name="who_pay"
          value={formData.who_pay}
          onChange={event => handleRootChange(event, 'who_pay')}
        >
          <option value="mm pay">MM Pay</option>
          <option value="sg pay">SG Pay</option>
        </select>
      </div>

      <div className="bg-amber-100 my-8 rounded-xl shadow-md p-8">
        <h2 className="text-amber-600 font-bold mb-4">Order Addons</h2>
        {addons.map((addon, index) => (
          <div key={index}>
            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                name={`addon_${index}`}
                checked={formData.order_addons.some(addonObj => addonObj.addon === addon.id)}
                onChange={event => handleAddonCheck(event, index, addon.id)}
                className="me-2"
              />
              {addon.name} {/* Display addon name */}
            </label>
            {formData.order_addons.some(addonObj => addonObj.addon === addon.id) && (
              <select
                className="mb-4 px-4 py-2 bg-white rounded-xl border-none"
                name={`addon_choice_${index}`}
                onChange={event => handleAddonChoiceChange(event, addon.id)}
              >
                <option value="">Select Option</option>
                {addon.choices.map((choice: any) => (
                  <option key={choice.id} value={choice.id}>{choice.name}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      <div className="bg-amber-100 my-8 rounded-xl shadow-md p-8">
        <h2 className="text-amber-600 font-bold mb-4">Recipient Information</h2>
        <input
          type="text"
          className="me-8 sm:me-4 mb-4 px-4 py-2 bg-white rounded-xl border-none"
          name="recipient_info.name"
          value={formData.recipient_info.name}
          onChange={event => handleChange(event, 'recipient_info', 'name')}
          placeholder="Recipient Name"
        />
        <input
          type="text"
          className="me-8 sm:me-4 mb-4 px-4 py-2 bg-white rounded-xl border-none"
          name="recipient_info.phone"
          value={formData.recipient_info.phone}
          onChange={event => handleChange(event, 'recipient_info', 'phone')}
          placeholder="Recipient Phone"
        />
        <input
          type="text"
          className="me-8 sm:me-4 mb-4 px-4 py-2 bg-white rounded-xl border-none"
          name="recipient_info.address"
          value={formData.recipient_info.address}
          onChange={event => handleChange(event, 'recipient_info', 'address')}
          placeholder="Recipient Address"
        />
        <input
          type="text"
          className="me-8 sm:me-4 mb-4 px-4 py-2 bg-white rounded-xl border-none"
          name="recipient_info.postal_code"
          value={formData.recipient_info.postal_code}
          onChange={event => handleChange(event, 'recipient_info', 'postal_code')}
          placeholder="Recipient Postal Code"
        />
      </div>
      <div className="bg-amber-100 my-8 rounded-xl shadow-md p-8">
        <h2 className="text-amber-600 font-bold mb-4">Sender Information</h2>
        <input
          type="text"
          className="me-8 sm:me-4 mb-4 px-4 py-2 bg-white rounded-xl border-none"
          name="sender_info.name"
          value={formData.sender_info.name}
          onChange={event => handleChange(event, 'sender_info', 'name')}
          placeholder="Sender Name"
        />
        <input
          type="email"
          className="me-8 sm:me-4 mb-4 px-4 py-2 bg-white rounded-xl border-none"
          name="sender_info.email"
          value={formData.sender_info.email}
          onChange={event => handleChange(event, 'sender_info', 'email')}
          placeholder="Sender Email"
        />
        <input
          type="text"
          className="me-8 sm:me-4 mb-4 px-4 py-2 bg-white rounded-xl border-none"
          name="sender_info.phone"
          value={formData.sender_info.phone}
          onChange={event => handleChange(event, 'sender_info', 'phone')}
          placeholder="Sender Phone"
        />
        <input
          type="text"
          className="me-8 sm:me-4 mb-4 px-4 py-2 bg-white rounded-xl border-none"
          name="sender_info.address"
          value={formData.sender_info.address}
          onChange={event => handleChange(event, 'sender_info', 'address')}
          placeholder="Sender Address"
        />
        <input
          type="text"
          className="me-8 sm:me-4 mb-4 px-4 py-2 bg-white rounded-xl border-none"
          name="sender_info.postal_code"
          value={formData.sender_info.postal_code}
          onChange={event => handleChange(event, 'sender_info', 'postal_code')}
          placeholder="Sender Postal Code"
        />
      </div>
      <div className="bg-amber-100 my-8 rounded-xl shadow-md p-8">
        <h2 className="text-amber-600 font-bold mb-4">Items</h2>
        {formData.items.map((item, index) => (
          <div key={index}>
            <select
              className="me-4 mb-4 px-4 py-2 bg-white rounded-xl border-none"
              name={`items[${index}].name`}
              value={item.name}
              onChange={event => handleItemChange(event, index, 'name')}
            >
              <option value="foods" selected>Foods</option>
              <option value="clothes">Clothes</option>
              <option value="shoes and bags">Shoes and Bags</option>
              <option value="cosmetics">Cosmetics</option>
              <option value="medicines">Medicines</option>
              <option value="supplements">Supplements</option>
              <option value="electronics">Electronics</option>
              <option value="valuables">Valuable Items</option>
            </select>

            {/* Add a delete button for each item */}
            <button className="px-4 py-2 mb-4 bg-red-500 rounded-lg hover:bg-red-400" type="button" onClick={() => deleteItem(index)}>
              <FontAwesomeIcon className="text-white" icon={faTrashCan}></FontAwesomeIcon>
            </button>
          </div>
        ))}
        {/* Add a button to add new items */}
        <button className="px-8 py-2 mb-4 bg-lime-500 text-white rounded-lg hover:bg-lime-400" type="button" onClick={addItem}>
          Add +
        </button>
      </div>
      {hasEmptyFields() && <p className="text-red-500 mb-4"> Please fill in all fields before submitting.</p>}
      <button className="focus:outline-0 px-8 py-2 mb-4 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-400" type="submit">
        {!submitting ? "Submit Form" : (<>
          <Loader loading={submitting} message='' color='#ffffff'></Loader>
        </>)}
      </button>
    </form>
  );
};

export default MyForm;
