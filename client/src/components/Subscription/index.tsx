import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { TUser, useGetUserByIdQuery } from '@librechat/data-provider';
import { useRecoilValue } from 'recoil';
import store from '~/store';
import { localize } from '~/localization/Translation';
import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

function SubscriptionContent() {
  const [subscriptionUser, setSubscriptionUser] = useState<TUser | null>(null);
  const [error, setError] = useState(''); // State to hold any error messages
  const { userId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const lang = useRecoilValue(store.lang);
  const navigate = useNavigate();

  const getUserByIdQuery = useGetUserByIdQuery(userId);

  // Effect for fetching user data
  useEffect(() => {
    if (getUserByIdQuery.isSuccess) {
      setSubscriptionUser(getUserByIdQuery.data);
    }
  }, [getUserByIdQuery.isSuccess, getUserByIdQuery.data]);

  async function handleSubscription() {
    console.log('handleSubscription function called with userId:', userId);
    setError('');

    const paymentReference = uuidv4(); // Generate a unique payment reference

    try {
      const body = JSON.stringify({
        userId, // Include userId for backend processing
        paymentReference, // Include the generated payment reference
      });

      const token = Cookies.get('token'); // Retrieve the token from the cookies
      console.log('token:', token)

      const response = await fetch('/api/payments/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include the token in the header
        },
        body
      });

      const data = await response.json();
      console.log('Received response from /create-payment:', data);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (data && data.approval_url) {
        console.log('Approval URL received:', data.approval_url);
        window.location.href = data.approval_url;
      } else {
        console.error('Failed to get approval URL');
        setError('Failed to initiate payment. Please try again.');
      }
    } catch (error) {
      console.error(`An error occurred in handleSubscription: ${error}`);
      setError(`An error occurred: ${error.message}`);
    }
  }

  return (
    <>
      <button
        className='absolute top-12 left-0 mx-2 my-1 py-2 px-3 flex items-center rounded-md text-gray-800 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-600 md:top-1 md:left-12'
        onClick={() => navigate(-1)}
      >
        ← {localize(lang, 'com_ui_back')}
      </button>

      <div className="absolute top-24 left-0 right-0 flex justify-center items-center py-4">
        <div className="relative flex items-center justify-center mr-2 text-xl dark:text-gray-200">
          {`${subscriptionUser?.name}'s Plan Management`}
        </div>
      </div>

      {/* Display error message if there's an error */}
      {error && <div className="error-message text-red-500">{error}</div>}

      <div className="mt-10 mx-auto border rounded" style={{ width: '900px', marginTop: '200px' }}>
        {/* Row 1 */}
        <div className="flex w-full">
          <div className="w-1/3 p-2 border border-r bg-green-500 flex items-center justify-center">Pre-paid Plan Options</div>
          <div className="w-1/3 p-2 border border-r bg-green-500 flex items-center justify-center">Payment Option</div>
          <div className="w-1/3 p-2 border bg-green-500 flex items-center justify-center">Plan Due Date</div>
        </div>

        {/* Row 2 */}
        <div className="flex w-full">
          <div className="w-1/3 p-2 border border-r bg-green-500 flex items-center justify-center">by Month: 10 USD/Month</div>
          <div className="w-1/6 p-2 border border-r flex items-center justify-center bg-green-500"> {/* Flex centering added */}
            <button
              onClick={handleSubscription}
              className="w-full h-full text-white rounded bg-blue-600"
            >
              PayPal
            </button>
          </div>
          <div className="w-1/6 p-2 border bg-green-500 flex items-center justify-center">Coming Soon</div>
          <div className="w-1/3 p-2 border bg-green-500 flex items-center justify-center">Plan Due Date</div>
        </div>
      </div>
    </>
  );
}

function Subscription() {
  const { userId } = useParams();
  return <SubscriptionContent key={userId} />;
}

export default Subscription;