import axios from "axios";

export const toggleTodo = (id, data) => ({
    type: 'ADD_TODO',
    id,
    data
})

export function test() {
    return function (dispatch) {
        return axios.post("http://127.0.0.1:7500/getCheapTickets", { "city": "北京" }).then((r) => {
            let data = r.data.map((item) => {
                return item.price;
            });
            console.log(data);

            dispatch(toggleTodo(2, data));
            return Promise.resolve("ok wanggang");
        });
    }
}