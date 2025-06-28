"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const axios_1 = __importDefault(require("axios"));
//// you can create your custom axios instance in separate file and use it here. It is just for demonstration 
const axiosInstance = axios_1.default.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});
//use this for authentication with token
axiosInstance.interceptors.request.use((config) => {
    const token = ''; // Add your token logic here
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));
function useApi(endpoint, method = 'get', options = {}) {
    const [data, setData] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(!options.manual);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchData = (0, react_1.useCallback)((payload) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        setLoading(true);
        setError(null);
        try {
            const response = yield axiosInstance.request({
                url: endpoint,
                method,
                data: method === 'post' || method === 'put' ? payload : undefined,
                params: method === 'get' ? payload !== null && payload !== void 0 ? payload : options.params : options.params,
            });
            setData(response.data);
        }
        catch (err) {
            const errorMsg = ((_b = (_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || (err === null || err === void 0 ? void 0 : err.message) || 'Something went wrong';
            setError(errorMsg);
        }
        finally {
            setLoading(false);
        }
    }), [endpoint, method, options.params]);
    (0, react_1.useEffect)(() => {
        if (!options.manual) {
            fetchData();
        }
    }, [fetchData, options.manual]);
    const LoaderComponent = (0, react_1.useMemo)(() => {
        return loading ? (<react_native_1.ActivityIndicator style={styles.loader} size="large" color="red"/>) : null;
    }, [loading]);
    return {
        data,
        loading,
        error,
        refetch: fetchData,
        LoaderComponent,
    };
}
const styles = react_native_1.StyleSheet.create({
    loader: {
        marginVertical: 16,
    },
});
exports.default = useApi;
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
