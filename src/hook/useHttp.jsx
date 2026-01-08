import { useReducer, useCallback } from "react";

const httpReducer = (state, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "ERROR":
      return { loading: false, error: action.error };
    case "DONE":
      return { loading: false, error: null };
    default:
      return state;
  }
};

export function useHttp() {
  const [state, dispatch] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  const sendRequest = useCallback(async (requestFn) => {
    dispatch({ type: "SEND" });

    try {
      const data = await requestFn();
      dispatch({ type: "DONE" });
      return data;
    } catch (err) {
      dispatch({
        type: "ERROR",
        error: err.message || "Request failed",
      });
      throw err;
    }
  }, []);

  const clearError = () => dispatch({ type: "DONE" });

  return {
    isLoading: state.loading,
    error: state.error,
    sendRequest,
    clearError,
  };
}



// import { useReducer, useCallback } from "react";

// const httpReducer = (state, action) => {
//   switch (action.type) {
//     case "SEND":
//       return { loading: true, error: null };
//     case "ERROR":
//       return { loading: false, error: action.error };
//     case "DONE":
//       return { loading: false, error: null };
//     default:
//       return state;
//   }
// };

// export function useHttp() {
//   const [state, dispatch] = useReducer(httpReducer, {
//     loading: false,
//     error: null,
//   });

//   const sendRequest = useCallback(async (requestFn) => {
//     dispatch({ type: "SEND" });

//     try {
//       const data = await requestFn();
//       dispatch({ type: "DONE" });
//       return data;
//     } catch (err) {
//       dispatch({
//         type: "ERROR",
//         error: err.message || "Request failed",
//       });
//       throw err;
//     }
//   }, []);

//   const clearError = () => dispatch({ type: "DONE" });

//   return {
//     isLoading: state.loading,
//     error: state.error,
//     sendRequest,
//     clearError,
//   };
// }

