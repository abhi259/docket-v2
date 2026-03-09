"use client";

import {
  CheckCircle,
  User,
  Phone,
  MapPin,
  Package,
  Clock,
  Sparkles,
} from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface OrderConfirmationProps {
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total: number;
}

export default function OrderConfirmation({
  customerName,
  phone,
  address,
  items,
  total,
}: OrderConfirmationProps) {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden my-4">
      {/* Success Header */}
      <div className="bg-linear-to-r from-green-500 to-emerald-500 p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Order Confirmed!
              <Sparkles className="w-5 h-5" />
            </h3>
            <p className="text-green-100 text-sm mt-0.5">
              Thank you for your order
            </p>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="p-4 bg-linear-to-r from-orange-50 to-amber-50 border-b border-orange-100">
        <div className="flex items-center gap-2 text-orange-700">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">
            Estimated delivery: 25-30 mins
          </span>
        </div>
      </div>

      {/* Customer Details */}
      <div className="p-4 border-b border-gray-100">
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Delivery Details
        </h4>
        <div className="space-y-2.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-gray-800 font-medium">{customerName}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-gray-700">{phone}</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-gray-700 text-sm leading-relaxed">
              {address}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-4">
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Order Summary
        </h4>
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 font-medium text-sm truncate">
                  {item.name}
                </p>
                <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
              </div>
              <span className="text-gray-800 font-semibold text-sm">
                ₹{item.price * item.quantity}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Total Amount</span>
            <span className="text-xl font-bold text-gray-900">₹{total}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Payment: Cash on Delivery</p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 pb-4">
        <div className="bg-linear-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-100">
          <p className="text-green-700 text-sm text-center">
            Your delicious food is being prepared with care!
          </p>
        </div>
      </div>
    </div>
  );
}
