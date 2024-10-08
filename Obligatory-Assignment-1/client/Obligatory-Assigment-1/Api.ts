/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface OrderDto {
  /** @format int32 */
  id?: number;
  /** @format date-time */
  orderDate?: string;
  /** @format date */
  deliveryDate?: string | null;
  status?: string;
  /** @format double */
  totalAmount?: number;
  /** @format int32 */
  customerId?: number | null;
  customer?: CustomerDto;
  orderEntries?: OrderEntryDto[];
}

export interface CustomerDto {
  /** @format int32 */
  id?: number;
  name?: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  orders?: OrderDto[];
}

export interface OrderEntryDto {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  quantity?: number;
  /** @format int32 */
  productId?: number | null;
  paper?: PaperDto | null;
}

export interface PaperDto {
  /** @format int32 */
  id?: number;
  name?: string;
  discontinued?: boolean;
  /** @format int32 */
  stock?: number;
  /** @format double */
  price?: number;
}

export interface Customer {
  /** @format int32 */
  id?: number;
  name?: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  orders?: Order[];
}

export interface Order {
  /** @format int32 */
  id?: number;
  /** @format date-time */
  orderDate?: string;
  /** @format date */
  deliveryDate?: string | null;
  status?: string;
  /** @format double */
  totalAmount?: number;
  /** @format int32 */
  customerId?: number | null;
  customer?: Customer | null;
  orderEntries?: OrderEntry[];
}

export interface OrderEntry {
  /** @format int32 */
  id?: number;
  /** @format int32 */
  quantity?: number;
  /** @format int32 */
  productId?: number | null;
  /** @format int32 */
  orderId?: number | null;
  order?: Order | null;
  product?: Paper | null;
}

export interface Paper {
  /** @format int32 */
  id?: number;
  name?: string;
  discontinued?: boolean;
  /** @format int32 */
  stock?: number;
  /** @format double */
  price?: number;
  orderEntries?: OrderEntry[];
  properties?: Property[];
}

export interface Property {
  /** @format int32 */
  id?: number;
  propertyName?: string;
  papers?: Paper[];
}

export interface CreateCustomerDto {
  name?: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface EditCustomerDto {
  name?: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface OrderRequestDto {
  customer?: CreateCustomerDto;
  order?: CreateOrderDto;
  orderEntries?: CreateOrderEntryDto[];
}

export interface CreateOrderDto {
  /** @format date-time */
  orderDate?: string;
  /** @format date */
  deliveryDate?: string | null;
  status?: string;
  /** @format double */
  totalAmount?: number;
}

export interface CreateOrderEntryDto {
  /** @format int32 */
  productId?: number;
  /** @format int32 */
  quantity?: number;
}

export interface EditOrderEntryDto {
  /** @format int32 */
  productId?: number;
  /** @format int32 */
  quantity?: number;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:5261" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Dunder Mifflin Infinity
 * @version v1
 * @baseUrl http://localhost:5261
 *
 * Try and test
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * No description
     *
     * @tags Customer
     * @name CustomerGetAllCustomers
     * @request GET:/api/customer
     */
    customerGetAllCustomers: (params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/customer`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerCreateCustomer
     * @request POST:/api/customer
     */
    customerCreateCustomer: (data: CreateCustomerDto, params: RequestParams = {}) =>
      this.request<Customer, any>({
        path: `/api/customer`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerGetCustomerById
     * @request GET:/api/customer/{id}
     */
    customerGetCustomerById: (id: number, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/customer/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerUpdateCustomer
     * @request PUT:/api/customer/{id}
     */
    customerUpdateCustomer: (id: number, data: EditCustomerDto, params: RequestParams = {}) =>
      this.request<Customer, any>({
        path: `/api/customer/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerDeleteCustomer
     * @request DELETE:/api/customer/{id}
     */
    customerDeleteCustomer: (id: number, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/customer/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerGetCustomerByEmail
     * @request GET:/api/customer/email/{email}
     */
    customerGetCustomerByEmail: (email: string, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/customer/email/${email}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Customer
     * @name CustomerGetOrdersByCustomerId
     * @request GET:/api/customer/{id}/order
     */
    customerGetOrdersByCustomerId: (id: number, params: RequestParams = {}) =>
      this.request<OrderDto[], any>({
        path: `/api/customer/${id}/order`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderGetAllOrders
     * @request GET:/api/order
     */
    orderGetAllOrders: (params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/order`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderCreateOrder
     * @request POST:/api/order
     */
    orderCreateOrder: (data: OrderRequestDto, params: RequestParams = {}) =>
      this.request<OrderDto, any>({
        path: `/api/order`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderGetOrderById
     * @request GET:/api/order/{id}
     */
    orderGetOrderById: (id: number, params: RequestParams = {}) =>
      this.request<OrderDto, any>({
        path: `/api/order/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderUpdateOrder
     * @request PUT:/api/order/{id}
     */
    orderUpdateOrder: (id: number, data: OrderRequestDto, params: RequestParams = {}) =>
      this.request<OrderDto, any>({
        path: `/api/order/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderDeleteOrder
     * @request DELETE:/api/order/{id}
     */
    orderDeleteOrder: (id: number, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/order/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderUpdateOrderStatus
     * @request PUT:/api/order/{id}/status
     */
    orderUpdateOrderStatus: (id: number, data: string, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/order/${id}/status`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Order
     * @name OrderCancelOrder
     * @request PUT:/api/order/cancel/{id}
     */
    orderCancelOrder: (id: number, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/order/cancel/${id}`,
        method: "PUT",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderEntry
     * @name OrderEntryGetAllOrderEntries
     * @request GET:/api/order-entry
     */
    orderEntryGetAllOrderEntries: (params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/order-entry`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderEntry
     * @name OrderEntryCreateOrderEntry
     * @request POST:/api/order-entry
     */
    orderEntryCreateOrderEntry: (data: CreateOrderEntryDto, params: RequestParams = {}) =>
      this.request<OrderEntry, any>({
        path: `/api/order-entry`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderEntry
     * @name OrderEntryGetOrderEntryById
     * @request GET:/api/order-entry/{id}
     */
    orderEntryGetOrderEntryById: (id: number, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/order-entry/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderEntry
     * @name OrderEntryUpdateOrderEntry
     * @request PUT:/api/order-entry/{id}
     */
    orderEntryUpdateOrderEntry: (id: number, data: EditOrderEntryDto, params: RequestParams = {}) =>
      this.request<OrderEntry, any>({
        path: `/api/order-entry/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags OrderEntry
     * @name OrderEntryDeleteOrderEntry
     * @request DELETE:/api/order-entry/{id}
     */
    orderEntryDeleteOrderEntry: (id: number, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/order-entry/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperGetAllPapers
     * @request GET:/api/paper
     */
    paperGetAllPapers: (params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/paper`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperCreatePaper
     * @request POST:/api/paper
     */
    paperCreatePaper: (
      query?: {
        name?: string;
        /** @format int32 */
        stock?: number;
        /** @format int32 */
        price?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Paper, any>({
        path: `/api/paper`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperGetPaper
     * @request GET:/api/paper/{id}
     */
    paperGetPaper: (id: number, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/paper/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperUpdatePaper
     * @request PUT:/api/paper/{id}
     */
    paperUpdatePaper: (
      id: number,
      query?: {
        /** @format int32 */
        id?: number;
        name?: string;
        /** @format int32 */
        stock?: number;
        /** @format int32 */
        price?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<Paper, any>({
        path: `/api/paper/${id}`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperUpdateDiscontinued
     * @request PATCH:/api/paper/{id}
     */
    paperUpdateDiscontinued: (
      id: number,
      query?: {
        discontinued?: boolean;
      },
      params: RequestParams = {},
    ) =>
      this.request<Paper, any>({
        path: `/api/paper/${id}`,
        method: "PATCH",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Paper
     * @name PaperDeletePaper
     * @request DELETE:/api/paper/{id}
     */
    paperDeletePaper: (id: number, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/paper/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Properties
     * @name PropertiesGetAllProperties
     * @request GET:/api/properties
     */
    propertiesGetAllProperties: (params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/properties`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Properties
     * @name PropertiesCreateProperty
     * @request POST:/api/properties
     */
    propertiesCreateProperty: (
      query?: {
        PropertyName?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Paper, any>({
        path: `/api/properties`,
        method: "POST",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Properties
     * @name PropertiesGetProperty
     * @request GET:/api/properties/{id}
     */
    propertiesGetProperty: (id: number, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/properties/${id}`,
        method: "GET",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Properties
     * @name PropertiesUpdateProperty
     * @request PUT:/api/properties/{id}
     */
    propertiesUpdateProperty: (
      id: number,
      query?: {
        /** @format int32 */
        id?: number;
        PropertyName?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Paper, any>({
        path: `/api/properties/${id}`,
        method: "PUT",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Properties
     * @name PropertiesDeleteProperty
     * @request DELETE:/api/properties/{id}
     */
    propertiesDeleteProperty: (id: number, params: RequestParams = {}) =>
      this.request<File, any>({
        path: `/api/properties/${id}`,
        method: "DELETE",
        ...params,
      }),
  };
}
