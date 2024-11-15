import { useCallback } from 'react';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

const getErrors = errorObj => {
  let newErrors = {};
  for (const [key, value] of Object.entries(errorObj)) {
    newErrors[key] = Array.isArray(value) ? value.toString() : value;
  }
  return { errors: newErrors };
};

const useApi = () => {
  const { appUrl } = usePage().props;
  const formatUrl = url => (url.startsWith('/') ? url : `/${url}`);
  const handleError = err => {
    let errors = {};
    if (err.response) {
      const status = err.response.status;
      if (status === 422) {
        errors = getErrors(err.response.data.errors || {});
      } else {
        errors.message =
          err.response.data.message || 'An error occurred on the server.';
      }
    } else if (err.request) {
      errors.message =
        'No response received from the server. Please check your network.';
    } else {
      errors.message = err.message || 'An unknown error occurred.';
    }
    return errors;
  };

  const getRoute = useCallback(
    async (url, params) => {
      const headers = {
        'Content-Type': 'application/json',
      };
      try {
        const { data } = await axios.get(`${appUrl}${formatUrl(url)}`, {
          headers,
          params,
        });
        return { data };
      } catch (err) {
        return handleError(err);
      }
    },
    [appUrl]
  );

  const postRoute = useCallback(
    async (url, postData, hasHeaders) => {
      const headers = hasHeaders
        ? {}
        : {
            'Content-Type': 'application/json',
          };
      try {
        const { data } = await axios.post(
          `${appUrl}${formatUrl(url)}`,
          postData,
          {
            headers,
          }
        );
        return { data: data?.data };
      } catch (err) {
        return handleError(err);
      }
    },
    [appUrl]
  );

  const deleteById = useCallback(
    async url => {
      const headers = {
        'Content-Type': 'application/json',
      };
      try {
        const { data } = await axios.delete(`${appUrl}${formatUrl(url)}`, {
          headers,
        });
        return { data: data?.data };
      } catch (err) {
        return handleError(err);
      }
    },
    [appUrl]
  );

  const editRoute = useCallback(
    async (url, formData, params = {}) => {
      const headers = {
        'Content-Type': 'application/json',
      };
      try {
        const { data } = await axios.patch(
          `${appUrl}${formatUrl(url)}`,
          formData,
          {
            params,
            headers,
          }
        );
        return { data };
      } catch (err) {
        return handleError(err);
      }
    },
    [appUrl]
  );

  return {
    getRoute,
    postRoute,
    deleteById,
    editRoute,
  };
};

export default useApi;
