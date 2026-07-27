import type { IDateValue, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IAddressItem = {
  id: string;
  name: string;
  company: string;
  email: string;
  phoneNumber: string;
  fullAddress: string;
};

export type IInvoiceTableFilters = {
  name: string;
  status: string;
  service: string[];
  endDate: IDatePickerControl;
  startDate: IDatePickerControl;
};

export type IInvoiceItem = {
  id: string;
  title: string;
  price: number;
  total: number;
  service: string;
  quantity: number;
  description: string;
};

export type IInvoice = {
  id: string;
  sent: number;
  taxes: number;
  status: string;
  subtotal: number;
  discount: number;
  shipping: number;
  totalAmount: number;
  dueDate: IDateValue;
  invoiceNumber: string;
  items: IInvoiceItem[];
  createDate: IDateValue;
  invoiceTo: IAddressItem;
  invoiceFrom: IAddressItem;
};
