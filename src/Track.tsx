
import React, { useState } from 'react';
import axios from 'axios';
import base_url from './base_url';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faTruckFast, faWarning } from '@fortawesome/free-solid-svg-icons';
import Loader from './Loader';
import { QrScanner } from '@yudiel/react-qr-scanner';
import decrypt from './decryption';

type RecipientInfo = {
    id: number;
    name: string;
    phone?: string;
    address?: string;
    postal_code?: string;
};

type SenderInfo = {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    postal_code?: string;
};

type Item = {
    id: number;
    name: string;
    weight: number;
    fee: string;
};

type OrderAddon = {
    id: number;
    addon: Addon;
    addon_choice: Choice;
}

type Choice = {
    id: number;
    name: string;
    fee: number;
}

type Addon = {
    id: number;
    name: string;
    addon_choice: Choice;
}

type OrderResponse = {
    id: number;
    recipient_info?: RecipientInfo;
    sender_info?: SenderInfo;
    items?: Item[];
    order_addons?: OrderAddon[];
    discount_coupon?: string;
    type?: string;
    status?: string;
    who_pay?: string;
    shipping_method?: string;
    total_fee?: string;
    date?: string;
};

const Track: React.FC = () => {
    const [orderId, setOrderId] = useState<string | null>(null);
    const [orderData, setOrderData] = useState<OrderResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [qr, setQr] = useState<boolean>(false)

    const fetchData = async (data: string | null) => {
        setQr(false)
        if (data !== null) {
            setOrderData(null);
            try {
                setLoading(true);
                const real_id = decrypt(data.split('-')[1], 3)
                const response = await axios.get<OrderResponse>(`${base_url()}/api/orders/${parseInt(data ? real_id : '') || null}`);
                setOrderData(response.data);
                setError(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(true);
            }
            setLoading(false);
        }
    };

    const handleScan = (data: string | null) => {
        if (data) {
            setOrderId(data);
            fetchData(data);
        }
    };

    const handleError = (error: any) => {
        console.error(error)
    };


    return (
        <div className="p-8 bg-lime-50 rounded-xl">
            <input
                type="text"
                className="me-4 mb-4 px-4 py-2 bg-white rounded-xl border-none"
                placeholder="Enter order ID"
                value={orderId === null ? '' : orderId}
                onChange={(e) => setOrderId(e.target.value)}
            />
            <button
                className="px-8 py-2 mb-4 bg-amber-600 hover:bg-amber-400 text-white rounded-xl"
                onClick={() => fetchData(orderId)}
            >
                Get Order Data <FontAwesomeIcon icon={faTruckFast} />
            </button>
            <p className="ms-2 mb-4 text-stone-500 text-lg">Or</p>
            <button
                className="px-8 block py-2 mb-4 bg-amber-600 hover:bg-amber-400 text-white rounded-xl"
                onClick={() =>
                    !qr && setQr(true)}
            >
                Scan Qr <FontAwesomeIcon icon={faQrcode} />
            </button>

            {qr && <div className='relative z-10 w-[250px] mx-auto sm:mx-0 border-2 border-amber-600'><QrScanner
                onDecode={handleScan}
                onError={handleError}
            /></div>}

            <Loader loading={loading} message="Fetching data" color="#ee9911" />
            {error && (
                <div className="p-8 bg-red-100 text-red-600">
                    Order not found <FontAwesomeIcon icon={faWarning} />
                </div>
            )}
            {orderData && (
                <div>
                    <h2 className="mb-4 text-xl font-bold text-amber-500">Order Information</h2>
                    <div className="bg-white p-4 mb-8 rounded-xl w-fit">
                        {orderData.type && <p>Type: <span className="text-amber-600">{orderData.type}</span></p>}
                        {orderData.status && <p>Status: <span className="text-amber-600">{orderData.status}</span></p>}
                        {orderData.who_pay && <p>Who Pay: <span className="text-amber-600">{orderData.who_pay}</span></p>}
                        {orderData.shipping_method && <p>Shipping Method: <span className="text-amber-600">{orderData.shipping_method}</span></p>}
                        {orderData.total_fee && <p>Total Fee: <span className="text-amber-600">{parseFloat(orderData.total_fee) ? orderData.total_fee + " SGD" : "uncalculated"}</span></p>}
                        {orderData.date && <p>Date: <span className="text-amber-600">{orderData.date}</span></p>}
                        {orderData && orderData.order_addons && (
                            <div>
                                {orderData.order_addons.map((addon) => (
                                    <div key={addon.id}>
                                        <p className='font-bold mt-2'>{addon.addon.name}</p>
                                        <p>{addon.addon_choice.name} - {addon.addon_choice.fee} SGD</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-row justify-start mb-8 gap-4 flex-wrap">
                        {orderData.recipient_info && (
                            <div className="bg-white p-4 rounded-xl">
                                <h3 className="mb-4 me-4 text-lg font-medium">Recipient Information</h3>
                                <p>Name: <span className="text-amber-600">{orderData.recipient_info.name}</span></p>
                                {orderData.recipient_info.phone && <p>Phone: <span className="text-amber-600">{orderData.recipient_info.phone}</span></p>}
                                {orderData.recipient_info.address && <p>Address: <span className="text-amber-600">{orderData.recipient_info.address}</span></p>}
                                {orderData.recipient_info.postal_code && <p>Postal Code: <span className="text-amber-600">{orderData.recipient_info.postal_code}</span></p>}

                            </div>
                        )}

                        {orderData.sender_info && (
                            <div className="bg-white p-4 rounded-xl">
                                <h3 className="mb-4 text-lg font-medium">Sender Information</h3>
                                <p>Name: <span className="text-amber-600">{orderData.sender_info.name}</span></p>
                                {orderData.sender_info.email && <p>Email: <span className="text-amber-600">{orderData.sender_info.email}</span></p>}
                                {orderData.sender_info.phone && <p>Phone: <span className="text-amber-600">{orderData.sender_info.phone}</span></p>}
                                {orderData.sender_info.address && <p>Address: <span className="text-amber-600">{orderData.sender_info.address}</span></p>}
                                {orderData.sender_info.postal_code && <p>Postal Code: <span className="text-amber-600">{orderData.sender_info.postal_code}</span></p>}

                            </div>
                        )}
                    </div>

                    {orderData.items && (
                        <div>
                            <h3 className="mb-4 text-lg font-medium">Items</h3>
                            <ul className="flex flex-col sm:flex-row gap-4 flex-wrap justify-start mb-8">
                                {orderData.items.map((item) => (
                                    <li key={item.id} className="bg-white p-4 rounded-xl">
                                        <p>Category: <span className="text-amber-600">{item.name}</span></p>
                                        <p>Weight: <span className="text-amber-600"> {item.weight > 0 ? item.weight + " kg" : ' uncalculated'}</span></p>
                                        <p>Fee: <span className="text-amber-600">{parseFloat(item.fee) > 0 ? item.fee + "SGD" : ' uncalculated'}</span></p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Track;
