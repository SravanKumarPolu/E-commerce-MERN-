import React, { useEffect, useState } from "react";
import { useShopContext } from "../context/ShopContext";

interface Address {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
  deliveryInstructions?: string;
  default?: boolean;
}

const emptyAddress: Omit<Address, '_id'> = {
  firstName: '',
  lastName: '',
  email: '',
  street: '',
  city: '',
  state: '',
  zipcode: '',
  country: '',
  phone: '',
  deliveryInstructions: '',
  default: false,
};

interface AddressBookProps {
  onDefaultAddress?: (address: Address | null) => void;
}

const AddressBook: React.FC<AddressBookProps> = ({ onDefaultAddress }) => {
  const { token, isLoggedIn } = useShopContext();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Address, '_id'>>(emptyAddress);
  const [adding, setAdding] = useState(false);

  // Fetch addresses
  const fetchAddresses = async () => {
    if (!isLoggedIn) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/user/address", {
        headers: { token },
      });
      const data = await res.json();
      if (data.success) setAddresses(data.addresses);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAddresses(); }, [isLoggedIn]);

  // Call onDefaultAddress whenever addresses change
  useEffect(() => {
    if (onDefaultAddress) {
      const def = addresses.find(a => a.default);
      onDefaultAddress(def || null);
    }
  }, [addresses, onDefaultAddress]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or edit address
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingId
        ? "http://localhost:3001/api/user/address"
        : "http://localhost:3001/api/user/address";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...form, addressId: editingId } : form;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setForm(emptyAddress);
        setEditingId(null);
        setAdding(false);
        fetchAddresses();
      } else {
        alert(data.message || "Failed to save address.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Edit
  const handleEdit = (address: Address) => {
    setForm({ ...address });
    setEditingId(address._id);
    setAdding(false);
  };

  // Delete
  const handleDelete = async (addressId: string) => {
    if (!window.confirm("Delete this address?")) return;
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/user/address", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ addressId }),
      });
      const data = await res.json();
      if (data.success) fetchAddresses();
      else alert(data.message || "Failed to delete address.");
    } finally {
      setLoading(false);
    }
  };

  // Set default
  const handleSetDefault = async (addressId: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/user/address/default", {
        method: "POST",
        headers: { "Content-Type": "application/json", token },
        body: JSON.stringify({ addressId }),
      });
      const data = await res.json();
      if (data.success) fetchAddresses();
      else alert(data.message || "Failed to set default.");
    } finally {
      setLoading(false);
    }
  };

  // Start add
  const handleAdd = () => {
    setForm(emptyAddress);
    setEditingId(null);
    setAdding(true);
  };

  // Cancel add/edit
  const handleCancel = () => {
    setForm(emptyAddress);
    setEditingId(null);
    setAdding(false);
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded bg-white">
      <h2 className="text-xl font-bold mb-4">Saved Addresses</h2>
      {loading && <div>Loading...</div>}
      {!loading && addresses.length === 0 && <div>No addresses saved.</div>}
      <ul className="space-y-4">
        {addresses.map(addr => (
          <li key={addr._id} className={`p-3 border rounded ${addr.default ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{addr.firstName} {addr.lastName} {addr.default && <span className="text-xs text-blue-600">(Default)</span>}</div>
                <div className="text-sm text-gray-700">{addr.street}, {addr.city}, {addr.state}, {addr.zipcode}, {addr.country}</div>
                <div className="text-sm text-gray-500">Email: {addr.email} | Phone: {addr.phone}</div>
                {addr.deliveryInstructions && <div className="text-xs text-gray-600 italic">Instructions: {addr.deliveryInstructions}</div>}
              </div>
              <div className="flex flex-col gap-1 items-end">
                {!addr.default && <button onClick={() => handleSetDefault(addr._id)} className="text-xs text-blue-600 underline">Set Default</button>}
                <button onClick={() => handleEdit(addr)} className="text-xs text-yellow-600 underline">Edit</button>
                <button onClick={() => handleDelete(addr._id)} className="text-xs text-red-600 underline">Delete</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6">
        {!adding && !editingId && <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded">Add New Address</button>}
        {(adding || editingId) && (
          <form onSubmit={handleSave} className="space-y-2 mt-4">
            <div className="flex gap-2">
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" required className="border px-2 py-1 rounded w-1/2" />
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" required className="border px-2 py-1 rounded w-1/2" />
            </div>
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="border px-2 py-1 rounded w-full" />
            <input name="street" value={form.street} onChange={handleChange} placeholder="Street" required className="border px-2 py-1 rounded w-full" />
            <div className="flex gap-2">
              <input name="city" value={form.city} onChange={handleChange} placeholder="City" required className="border px-2 py-1 rounded w-1/2" />
              <input name="state" value={form.state} onChange={handleChange} placeholder="State" required className="border px-2 py-1 rounded w-1/2" />
            </div>
            <div className="flex gap-2">
              <input name="zipcode" value={form.zipcode} onChange={handleChange} placeholder="ZipCode" required className="border px-2 py-1 rounded w-1/2" />
              <input name="country" value={form.country} onChange={handleChange} placeholder="Country" required className="border px-2 py-1 rounded w-1/2" />
            </div>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required className="border px-2 py-1 rounded w-full" />
            <textarea name="deliveryInstructions" value={form.deliveryInstructions} onChange={handleChange} placeholder="Delivery instructions (optional)" className="border px-2 py-1 rounded w-full" />
            <div className="flex gap-2 mt-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
              <button type="button" onClick={handleCancel} className="bg-gray-300 text-gray-800 px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddressBook; 