// src/components/OrderForm.tsx
import React, { useState, useEffect } from 'react';
import socket from '../socket';

interface OrderData {
  customerName: string;
  item: string;
  quantity: number;
  price: number;
}

const OrderPage: React.FC = () => {
  const [orderData, setOrderData] = useState<OrderData>({
    customerName: '',
    item: '',
    quantity: 1,
    price: 0,
  });
  const [queuePosition, setQueuePosition] = useState<number | null>(null);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 서버로부터 대기열 상태 업데이트를 받음
    socket.on('queueStatus', (data) => {
      setQueuePosition(data.position);
      setEstimatedWaitTime(data.estimatedWaitTime);
    });

    return () => {
      socket.off('queueStatus');
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isLoading) return; // 이미 전송 중인 경우 중복 요청 방지

    setIsLoading(true);
    console.log('Sending createOrder event with data:', orderData);
    socket.emit('createOrder', orderData, (response: any) => {
      console.log('Server response:', response);
      setIsLoading(false);
    });
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Order Form</h1>
      <div className="mb-4">
        <label className="block mb-2">Customer Name:</label>
        <input
          type="text"
          name="customerName"
          value={orderData.customerName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Item:</label>
        <input
          type="text"
          name="item"
          value={orderData.item}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Quantity:</label>
        <input
          type="number"
          name="quantity"
          value={orderData.quantity}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Price:</label>
        <input
          type="number"
          name="price"
          step="0.01"
          value={orderData.price}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        {isLoading ? 'Processing...' : 'Submit Order'}
      </button>

      {queuePosition !== null && (
        <div className="mt-4">
          <p>Current Queue Position: {queuePosition}</p>
          <p>Estimated Wait Time: {estimatedWaitTime} seconds</p>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
