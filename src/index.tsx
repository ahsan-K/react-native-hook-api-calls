import { useEffect, useState, useCallback, useMemo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

//// you can create your custom axios instance in separate file and use it here. It is just for demonstration 
const axiosInstance = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

//use this for authentication with token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = ''; // Add your token logic here
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

interface UseApiOptions {
    manual?: boolean;
    params?: Record<string, any>;
}

function useApi<T = any>(
    endpoint: string,
    method: HttpMethod = 'get',
    options: UseApiOptions = {}
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



// use it like this

// interface Todo {
//   id: number;
//   title: string;
//   completed: boolean;
// }


// const MyComponent = () => {
//     const { data, error, LoaderComponent } = useApi<Todo[]>(
//         '/posts',
//         'get'
//     );

//     useEffect(() => {
//         RNBootSplash.hide();
//     }, [])

//     console.log(error)
//     return (
//         <View>
//             {LoaderComponent}
//     
//         </View>
//     );
// };

// export default MyComponent;