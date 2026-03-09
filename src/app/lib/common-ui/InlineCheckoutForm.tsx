"use client";

import { useState } from "react";
import { User, Phone, MapPin, CheckCircle, Loader2, ShoppingBag } from "lucide-react";
import { useCartStore } from "../../store/store";

interface InlineCheckoutFormProps {
  onSubmit: (data: { name: string; phone: string; address: string }) => void;
  disabled?: boolean;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
}

export default function InlineCheckoutForm({
  onSubmit,
  disabled = false,
}: InlineCheckoutFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { cart, clearCart } = useCartStore();

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit Indian phone number";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    } else if (address.trim().length < 10) {
      newErrors.address = "Please enter a complete address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || disabled) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);

    onSubmit({
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
    });

    clearCart();
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden my-4">
        <div className="bg-linear-to-r from-green-500 to-emerald-500 p-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Order Confirmed!
          </h3>
        </div>
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <p className="text-gray-600 mb-1">
            Your order has been placed successfully!
          </p>
          <p className="text-gray-600">
            Our delivery partner will bring your order within
          </p>
          <p className="font-semibold text-orange-600 text-lg mt-1">30 minutes</p>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden my-4">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">Your cart is empty</p>
          <p className="text-gray-500 text-sm mt-1">Add some items to checkout</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden my-4">
      <div className="bg-linear-to-r from-orange-500 to-red-500 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Checkout
            </h3>
            <p className="text-orange-100 text-sm mt-0.5">
              {cart.length} item{cart.length !== 1 ? "s" : ""} • Total: ₹{total}
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                placeholder="Enter your name"
                disabled={isSubmitting || disabled}
                className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${
                  errors.name
                    ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                    : "border-gray-200 focus:ring-orange-500/20 focus:border-orange-500"
                }`}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="w-4 h-4 text-gray-400" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                  setPhone(value);
                  if (errors.phone) setErrors({ ...errors, phone: undefined });
                }}
                placeholder="10-digit mobile number"
                disabled={isSubmitting || disabled}
                className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all disabled:opacity-50 ${
                  errors.phone
                    ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                    : "border-gray-200 focus:ring-orange-500/20 focus:border-orange-500"
                }`}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Delivery Address
            </label>
            <div className="relative">
              <div className="absolute top-2.5 left-3 pointer-events-none">
                <MapPin className="w-4 h-4 text-gray-400" />
              </div>
              <textarea
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors({ ...errors, address: undefined });
                }}
                placeholder="House/Flat no., Building, Street, Area"
                rows={2}
                disabled={isSubmitting || disabled}
                className={`w-full pl-9 pr-4 py-2.5 text-sm border rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 transition-all resize-none disabled:opacity-50 ${
                  errors.address
                    ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                    : "border-gray-200 focus:ring-orange-500/20 focus:border-orange-500"
                }`}
              />
            </div>
            {errors.address && (
              <p className="mt-1 text-xs text-red-500">{errors.address}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || disabled}
            className="w-full py-3 bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Place Order • ₹${total}`
            )}
          </button>
          <p className="text-xs text-gray-500 text-center">
            Payment Mode: Cash on Delivery (COD)
          </p>
        </form>
      </div>
    </div>
  );
}
