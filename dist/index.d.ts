import axios from 'axios';
type HttpMethod = 'get' | 'post' | 'put' | 'delete';
interface UseApiOptions {
    manual?: boolean;
    params?: Record<string, any>;
}
declare function useApi<T = any>(endpoint: string, method: HttpMethod | undefined, options: UseApiOptions | undefined, axiosInstance: typeof axios): {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: (payload?: Record<string, any>) => Promise<void>;
    LoaderComponent: import("react").JSX.Element | null;
};
export default useApi;
