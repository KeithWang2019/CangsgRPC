import { matchPath } from "react-router-dom";

const quickNavigationItems = (state = [], action) => {
    let items = null;
    switch (action.type) {
        case "loadQuickNavigation":
            items = [
                {
                    type: "group",
                    to: "/hello",
                    label: "组1",
                    child: [
                        {
                            label: "主机1",
                            to: "/hello/d",
                            icon: "#cac-database-fill"
                        },
                        {
                            label: "主机2",
                            to: "/hello/e",
                            icon: "#cac-database"
                        }
                    ]
                },
                {
                    type: "group",
                    to: "/about",
                    label: "组2",
                    child: [
                        {
                            type: "group",
                            to: "/about/a",
                            label: "组3",
                        },
                        {
                            type: "group",
                            to: "/about/b",
                            label: "组4",
                            child: [
                                {
                                    label: "主机2",
                                    to: "/about/b/c"
                                }
                            ]
                        }
                    ]
                }
            ];
            traversal(items, action.path, true);
            return Object.assign(items, state);
        case "openQuickNavigation":
            items = JSON.parse(JSON.stringify(state));
            traversal(items, action.path, action.open);
            return items;
        default:
            return state;
    }
}

function traversal(items, path, open) {
    for (let i = 0; i < items.length; i++) {
        let item = items[i];

        const match = matchPath(document.location.pathname, {
            path: item.to,
            exact: false,
            strict: false
        });

        if (match) {
            item.open = true;
        }

        if (path == item.to) {
            item.open = open;
        }

        if (item.child) {
            traversal(item.child, path, open);
        }
    }
}

export default quickNavigationItems;