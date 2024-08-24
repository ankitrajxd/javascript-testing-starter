import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  renderPage,
  signUp,
  submitOrder,
} from '../src/mocking';
import { getExchangeRate } from '../src/libs/currency';
import { getShippingQuote } from '../src/libs/shipping';
import { trackPageView } from '../src/libs/analytics';
import { charge } from '../src/libs/payment';
import { sendEmail } from '../src/libs/email';
import security from '../src/libs/security';
import { login } from '../src/mocking';
vi.mock('../src/libs/currency');
vi.mock('../src/libs/shipping');
vi.mock('../src/libs/analytics');
vi.mock('../src/libs/payment');
vi.mock('../src/libs/email', async (importOrginal) => {
  const originalModule = await importOrginal();
  return {
    ...originalModule,
    sendEmail: vi.fn(),
  };
});

describe('test suite', () => {
  it('test case', () => {
    const sendText = vi.fn();
    sendText.mockReturnValue('ok');
    const result = sendText('Hello world');

    expect(sendText).toHaveBeenCalledWith('Hello world');
    expect(result).toBe('ok');
  });
});

describe('getPriceInCurrency', () => {
  it('should return price in target currency', () => {
    vi.mocked(getExchangeRate).mockReturnValue(1.5);
    const price = getPriceInCurrency(10, 'AUD');
    expect(price).toBe(15);
  });
});

describe('getShippingInfo', () => {
  it('should return shipping unavailable if quote is not found!', () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);
    const result = getShippingInfo('USA');
    expect(result).toMatch(/unavailable/i);
  });

  it('should return shipping info if quote can be fetced', () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 2 });
    const result = getShippingInfo('London');

    expect(result).toMatch('$10');
    expect(result).toMatch(/2 days/i);
  });
});

// Interaction Testing
describe('renderPage', () => {
  it('should return correct content', async () => {
    const result = await renderPage();
    expect(result).toMatch(/content/i);
  });

  it('should call analytics', async () => {
    await renderPage();

    expect(trackPageView).toHaveBeenCalledWith('/home');
  });
});

describe('submitOrder', () => {
  const order = {
    totalAmount: 100,
  };
  const creditCard = {
    crediCardNumber: '123456789',
  };

  it('should charge the customer', async () => {
    vi.mocked(charge).mockResolvedValue({
      status: 'success',
    });

    await submitOrder(order, creditCard);
    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });

  it('should return success when payement is successfull', async () => {
    vi.mocked(charge).mockResolvedValue({
      status: 'success',
    });

    const result = await submitOrder(order, creditCard);
    expect(result).toEqual({ success: true });
  });
});

// partial mocking
describe('signup', () => {
  const email = 'name@domain.com';

  // beforeEach(() => {
  //     vi.mocked(sendEmail).mockClear();
  // })

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return false if the email is not valid', async () => {
    const result = await signUp('a');
    expect(result).toBe(false);
  });
  it('should return true if the email is  valid', async () => {
    const result = await signUp(email);
    expect(result).toBe(true);
  });
  it('should send the welcome email if email is valid', async () => {
    await signUp('name@domain.com');
    expect(sendEmail).toHaveBeenCalledOnce();
    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(args[0]).toBe(email);
    expect(args[1]).toMatch(/welcome/i);
  });
});

describe('login', () => {
  const email = 'name@domain.com';
  it('should email the one time login code', async () => {
    const spy = vi.spyOn(security, 'generateCode');

    await login(email);
    const securityCode = spy.mock.results[0].value.toString();
    expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
  });
});

describe('isOnline', () => {
  it('should return false if the current hour is outside opening hours', () => {
    vi.setSystemTime('2024-01-01 07:59');
    expect(isOnline()).toBe(false);
    vi.setSystemTime('2024-01-01 20:01');
    expect(isOnline()).toBe(false);
  });

  // it("should return true if current hour is within opening hours", () => {

  // })
});
