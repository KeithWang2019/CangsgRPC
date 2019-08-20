const xxx = (state = [], action) => {
    switch (action.type) {
        case "ADD_TODO2":
            return [
                4, 5, 6
            ];
        default:
            return state;
    }
}

export default xxx;