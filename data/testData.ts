import { getEnv } from '../utils/envReader';
import { User } from '../types';
import { CheckoutInfo } from '../types';

const password = getEnv('PASSWORD');

export const users = {
  standard: { username: getEnv('STANDARD_USER'), password },
  lockedOut: { username: getEnv('LOCKED_OUT_USER'), password },
  problem: { username: getEnv('PROBLEM_USER'), password },
  performanceGlitch: { username: getEnv('PERFORMANCE_GLITCH_USER'), password },
  invalid: { username: 'wrong_user', password: 'wrong_password' },
} satisfies Record<string, User>;

export const checkoutInfo: CheckoutInfo = {
  firstName: 'Noam',
  lastName: 'Bitton',
  postalCode: '8122001',
};

export const ErrorMessages = {
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  protectedPage: (path: string) => `Epic sadface: You can only access '${path}' when you are logged in.`,
  firstNameRequired: 'Error: First Name is required',
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
} as const;

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
} as const;