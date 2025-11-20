# TaskApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiTaskGet**](#apitaskget) | **GET** /api/Task | |
|[**apiTaskIdDelete**](#apitaskiddelete) | **DELETE** /api/Task/{id} | |
|[**apiTaskIdGet**](#apitaskidget) | **GET** /api/Task/{id} | |
|[**apiTaskIdPut**](#apitaskidput) | **PUT** /api/Task/{id} | |
|[**apiTaskPost**](#apitaskpost) | **POST** /api/Task | |

# **apiTaskGet**
> TaskDtoPagedResponse apiTaskGet()


### Example

```typescript
import {
    TaskApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaskApi(configuration);

let status: TaskStatus; // (optional) (default to undefined)
let dueFrom: string; // (optional) (default to undefined)
let dueTo: string; // (optional) (default to undefined)
let pageNumber: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.apiTaskGet(
    status,
    dueFrom,
    dueTo,
    pageNumber,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | **TaskStatus** |  | (optional) defaults to undefined|
| **dueFrom** | [**string**] |  | (optional) defaults to undefined|
| **dueTo** | [**string**] |  | (optional) defaults to undefined|
| **pageNumber** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|


### Return type

**TaskDtoPagedResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTaskIdDelete**
> apiTaskIdDelete()


### Example

```typescript
import {
    TaskApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaskApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.apiTaskIdDelete(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**204** | No Content |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTaskIdGet**
> TaskDto apiTaskIdGet()


### Example

```typescript
import {
    TaskApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TaskApi(configuration);

let id: string; // (default to undefined)

const { status, data } = await apiInstance.apiTaskIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] |  | defaults to undefined|


### Return type

**TaskDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTaskIdPut**
> TaskDto apiTaskIdPut()


### Example

```typescript
import {
    TaskApi,
    Configuration,
    UpdateTaskRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TaskApi(configuration);

let id: string; // (default to undefined)
let updateTaskRequest: UpdateTaskRequest; // (optional)

const { status, data } = await apiInstance.apiTaskIdPut(
    id,
    updateTaskRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateTaskRequest** | **UpdateTaskRequest**|  | |
| **id** | [**string**] |  | defaults to undefined|


### Return type

**TaskDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiTaskPost**
> TaskDto apiTaskPost()


### Example

```typescript
import {
    TaskApi,
    Configuration,
    CreateTaskRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new TaskApi(configuration);

let createTaskRequest: CreateTaskRequest; // (optional)

const { status, data } = await apiInstance.apiTaskPost(
    createTaskRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createTaskRequest** | **CreateTaskRequest**|  | |


### Return type

**TaskDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

