import { useEffect, useState, useCallback, useMemo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import axios, { AxiosInstance } from 'axios';

//// you can create your custom axios instance in separate file and use it here. It is just for demonstration 

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

interface UseApiOptions {
    manual?: boolean;
    params?: Record<string, any>;
}

function useApi<T = any>(
    endpoint: string,
    method: HttpMethod = 'get',
    options: UseApiOptions = {},
    axiosInstance: AxiosInstance
) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(!options.manual);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(
        async (payload?: Record<string, any>) => {
            setLoading(true);
            setError(null);

            try {
                const response = await axiosInstance.request<T>({
                    url: endpoint,
                    method,
                    data: method === 'post' || method === 'put' ? payload : undefined,
                    params: method === 'get' ? payload ?? options.params : options.params,
                });

                setData(response.data);
            } catch (err: any) {
                const errorMsg =
                    err?.response?.data?.message || err?.message || 'Something went wrong';
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        },
        [endpoint, method, options.params]
    );

    useEffect(() => {
        if (!options.manual) {
            fetchData();
        }
    }, [fetchData, options.manual]);

    const LoaderComponent = useMemo(() => {
        return loading ? (
            <ActivityIndicator style={styles.loader} size="large" color="red" />
        ) : null;
    }, [loading]);

    return {
        data,
        loading,
        error,
        refetch: fetchData,
        LoaderComponent,
    };
}

const styles = StyleSheet.create({
    loader: {
        marginVertical: 16,
    },
});

export default useApi;