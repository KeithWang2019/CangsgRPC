import axios from "axios";

export const actionType = {
    queryNodes: (data) => ({
        type: 'Query_Nodes',
        data
    })
};

export const action = {
    queryNodes() {
        return function (dispatch) {
            let url = process.env.URL_BASE + '/api/nodes';
            return axios.post(url, {}).then((r) => {
                let data = r.data;
                console.log(data);
                dispatch(actionType.queryNodes(data));
                return Promise.resolve("ok wanggang");
            });
        }
    }
};

export const reducer = (state = [], action) => {
    switch (action.type) {
        case "Query_Nodes":
            return action.data;
        default:
            return state;
    }
}


export default {
    name: "nodeList",
    reducer
}