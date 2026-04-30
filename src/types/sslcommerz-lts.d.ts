// Type declaration for sslcommerz-lts
declare module 'sslcommerz-lts' {
  interface SSLCommerzInitData {
    total_amount: number;
    currency: string;
    tran_id: string;
    success_url: string;
    fail_url: string;
    cancel_url: string;
    ipn_url?: string;
    cus_name: string;
    cus_email: string;
    cus_add1: string;
    cus_add2?: string;
    cus_city: string;
    cus_state: string;
    cus_postcode: string;
    cus_country: string;
    cus_phone: string;
    cus_fax?: string;
    ship_name?: string;
    ship_add1?: string;
    ship_add2?: string;
    ship_city?: string;
    ship_state?: string;
    ship_postcode?: string;
    ship_country?: string;
    ship_phone?: string;
    product_name: string;
    product_category: string;
    product_profile: string;
    shipping_method?: string;
    num_of_item?: number;
    value_a?: string;
    value_b?: string;
    value_c?: string;
    value_d?: string;
    [key: string]: unknown;
  }

  interface SSLCommerzInitResponse {
    status: string;
    sessionkey?: string;
    GatewayPageURL?: string;
    storeBanner?: string;
    storeLogo?: string;
    desc?: string;
    is_direct_pay_enable?: string;
    [key: string]: unknown;
  }

  interface SSLCommerzValidateResponse {
    status: string;
    tran_id: string;
    amount: string;
    card_type: string;
    card_issuer: string;
    bank_tran_id: string;
    store_amount: string;
    tran_date: string;
    [key: string]: unknown;
  }

  class SSLCommerzPayment {
    constructor(storeId: string, storePassword: string, isLive: boolean);
    init(data: SSLCommerzInitData): Promise<SSLCommerzInitResponse>;
    validate(data: { val_id: string }): Promise<SSLCommerzValidateResponse>;
    transactionQueryByTransactionId(data: { tran_id: string }): Promise<unknown>;
  }

  export = SSLCommerzPayment;
}
