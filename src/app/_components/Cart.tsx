"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "../store/store";
import { useMemo } from "react";

interface CartItemGroup {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  type: string;
}

export default function Cart() {
  const { cart, addToCart, decrementItem, removeAllOfItem, clearCart } =
    useCartStore();


    const handleCheckout = () => {
      console.log("Checkout");
    };

  const groupedItems = useMemo(() => {
    const itemMap = new Map<number, CartItemGroup>();
    cart.forEach((item) => {
      if (itemMap.has(item.id)) {
        const existing = itemMap.get(item.id)!;
        existing.quantity += 1;
      } else {
        itemMap.set(item.id, {
          id: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: 1,
          type: item.type,
        });
      }
    });
    return Array.from(itemMap.values());
  }, [cart]);

  const subtotal = useMemo(() => {
    return groupedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  }, [groupedItems]);

  const totalItems = useMemo(() => {
    return groupedItems.reduce((count, item) => count + item.quantity, 0);
  }, [groupedItems]);

  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handleIncrement = (item: CartItemGroup) => {
    const cartItem = cart.find((i) => i.id === item.id);
    if (cartItem) {
      addToCart(cartItem);
    }
  };

  return (
    <div className="min-w-[360px] h-full bg-gray-100 flex flex-col border-l border-gray-200 sticky top-0 z-10">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md shadow-orange-200">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
              <p className="text-xs text-gray-500">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
          {groupedItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {groupedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">Your cart is empty</p>
            <p className="text-gray-400 text-sm mt-1">
              Add items to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {groupedItems.map((item) => {
              const isVeg = item.type === "Vegetarian";
              return (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                >
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isVeg ? "border-green-500" : "border-red-500"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                isVeg ? "bg-green-500" : "bg-red-500"
                              }`}
                            />
                          </div>
                          <h3 className="font-medium text-gray-900 text-sm truncate">
                            {item.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeAllOfItem(item.id)}
                          className="p-1 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </div>

                      <p className="text-orange-600 font-semibold text-sm mt-1">
                        ₹{item.price}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => decrementItem(item.id)}
                            className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5 text-gray-600" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrement(item)}
                            className="w-7 h-7 flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary & Checkout */}
      {groupedItems.length > 0 && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          {/* Price Breakdown */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-900 font-medium">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery Fee</span>
              <span
                className={`font-medium ${deliveryFee === 0 ? "text-green-600" : "text-gray-900"}`}
              >
                {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
              </span>
            </div>
            {subtotal < 500 && (
              <p className="text-xs text-orange-600">
                Add ₹{500 - subtotal} more for free delivery
              </p>
            )}
            <div className="flex justify-between pt-2 border-t border-gray-200">
              <span className="text-gray-900 font-semibold">Total</span>
              <span className="text-gray-900 font-bold text-lg">₹{total}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button onClick={handleCheckout} className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/25 active:scale-[0.98] cursor-pointer">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
