type ErrorRecord = {
  message?: unknown;
  status?: unknown;
  data?: { message?: unknown; status?: unknown };
  response?: {
    status?: unknown;
    data?: { message?: unknown; status?: unknown };
  };
};

function asErrorRecord(value: unknown): ErrorRecord | undefined {
  return typeof value === 'object' && value !== null
    ? value as ErrorRecord
    : undefined;
}

export function getErrorMessage(error: unknown, fallback: string): string {
  const record = asErrorRecord(error);
  const response = asErrorRecord(record?.response);
  const data = asErrorRecord(response?.data);

  if (typeof data?.message === 'string') return data.message;
  if (typeof record?.message === 'string') return record.message;
  return fallback;
}

export function getErrorStatus(error: unknown): number | undefined {
  const record = asErrorRecord(error);
  const response = asErrorRecord(record?.response);
  const data = asErrorRecord(response?.data);
  const status = data?.status ?? record?.status ?? response?.status;
  return typeof status === 'number' ? status : undefined;
}
