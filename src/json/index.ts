import StatusCode from 'status-code-enum';

export const isParseable = (json: string): boolean => {
  if (!json) {
    return false;
  }

  try {
    JSON.parse(json);
    return true;
  } catch (err) {
    return false;
  }
};

export const invalidJsonError = {
  statusCode: StatusCode.ClientErrorBadRequest,
  body: JSON.stringify({
    errors: [
      {
        code: 'invalid.json',
        message: 'JSON supplied to request is invalid',
        properties: [
          {
            property: 'request.body',
          },
        ],
      },
    ],
  }),
};
