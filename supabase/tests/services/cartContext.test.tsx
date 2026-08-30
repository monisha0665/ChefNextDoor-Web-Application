import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../../lib/cartContext';

describe('cartContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    expect(result.current.lines).toEqual([]);
    expect(result.current.itemCount).toBe(0);
    expect(result.current.subtotal).toBe(0);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    
    act(() => {
      result.current.addToCart({
        menuItemId: 1,
        name: 'Burger',
        price: 10,
        chefId: 'c1',
        chefName: 'Chef'
      });
    });

    expect(result.current.lines.length).toBe(1);
    expect(result.current.itemCount).toBe(1);
    expect(result.current.subtotal).toBe(10);
  });

  it('should increment existing item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    
    act(() => {
      result.current.addToCart({
        menuItemId: 1,
        name: 'Burger',
        price: 10,
        chefId: 'c1',
        chefName: 'Chef'
      });
      result.current.addToCart({
        menuItemId: 1,
        name: 'Burger',
        price: 10,
        chefId: 'c1',
        chefName: 'Chef'
      });
    });

    expect(result.current.lines.length).toBe(1);
    expect(result.current.lines[0].quantity).toBe(2);
    expect(result.current.itemCount).toBe(2);
    expect(result.current.subtotal).toBe(20);
  });

  it('should change quantity and remove if 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    
    act(() => {
      result.current.addToCart({ menuItemId: 1, name: 'Burger', price: 10, chefId: 'c1', chefName: 'Chef' }, 2);
    });

    act(() => {
      result.current.changeQuantity(1, -1);
    });

    expect(result.current.lines[0].quantity).toBe(1);

    act(() => {
      result.current.changeQuantity(1, -1);
    });

    expect(result.current.lines.length).toBe(0);
  });

  it('should remove item', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    
    act(() => {
      result.current.addToCart({ menuItemId: 1, name: 'Burger', price: 10, chefId: 'c1', chefName: 'Chef' });
    });

    act(() => {
      result.current.removeFromCart(1);
    });

    expect(result.current.lines.length).toBe(0);
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider });
    
    act(() => {
      result.current.addToCart({ menuItemId: 1, name: 'Burger', price: 10, chefId: 'c1', chefName: 'Chef' });
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.lines.length).toBe(0);
  });

  it('should throw error if useCart used outside provider', () => {
    // Suppress console.error for expected error
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    
    expect(() => {
      renderHook(() => useCart());
    }).toThrow('useCart must be used within a CartProvider');
    
    spy.mockRestore();
  });
});
