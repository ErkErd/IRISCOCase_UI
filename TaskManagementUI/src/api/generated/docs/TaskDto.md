# TaskDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [optional] [default to undefined]
**title** | **string** |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**status** | [**TaskStatus**](TaskStatus.md) |  | [optional] [default to undefined]
**dueDate** | **string** |  | [optional] [default to undefined]
**createdAtUtc** | **string** |  | [optional] [default to undefined]
**updatedAtUtc** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { TaskDto } from './api';

const instance: TaskDto = {
    id,
    title,
    description,
    status,
    dueDate,
    createdAtUtc,
    updatedAtUtc,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
