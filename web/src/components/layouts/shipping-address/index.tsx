'use client';

import { useState } from 'react';

interface AddressFormProps {
    onSubmit: (address: AddressData) => void;
}

interface AddressData {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    zipCode: string;
    city: string;
    state: string;
}

export default function AddressForm({ onSubmit }: AddressFormProps) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Create the address data object
        const addressData = {
            firstName,
            lastName,
            address1,
            address2,
            zipCode,
            city,
            state,
        };

        // Pass the data to the parent via the onSubmit handler
        onSubmit(addressData);
    };

    return (
        <div className="border p-4 rounded-md">
            <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First Name"
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last Name"
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
                        Address 1
                    </label>
                    <input
                        type="text"
                        id="address1"
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        placeholder="Address Line 1"
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div>
                    <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
                        Address 2 (Optional)
                    </label>
                    <input
                        type="text"
                        id="address2"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        placeholder="Address Line 2"
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <div className="flex space-x-4">
                    <div className="flex-1">
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                            Zip Code
                        </label>
                        <input
                            type="text"
                            id="zipCode"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            placeholder="Zip Code"
                            className="w-full p-2 border rounded-md"
                        />
                    </div>

                    <div className="flex-1">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                            City
                        </label>
                        <input
                            type="text"
                            id="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                            className="w-full p-2 border rounded-md"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                    </label>
                    <input
                        type="text"
                        id="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="State"
                        className="w-full p-2 border rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-md mt-4"
                >
                    Save Address
                </button>
            </form>
        </div>
    );
}