export const HEADER_TABLE_ORDER = [
  "No",
  "Order ID",
  "Customer Name",
  "Table",
  "Status",
  "Action",
];

export const INITIAL_ORDER = {
  customer_name: "",
  table_id: "",
  status: "",
};


export const INITIAL_STATE_ORDER = {
  status: "idle",
  errors: {
    customer_name: [],
    table_id: [],
    status: [],
    _form: [],
  }
};

export const STATUS_CREATE_ORDER = [
  {
    value: "reserved",
    label: "Reserved",
  },
  {
    value: "process",
    label: "Process",
  },
  {
    value: "done",
    label: "Done",
  },
];

export const HEADER_TABLE_DETAIL_ORDER = [
  "No",
  "Menu",
  "Total",
  "Status",
  "Action",
];

export const FILTER_MENU = [
  {
    value: "",
    label: "All",
  },
  {
    value: "abaya",
    label: "Abaya",
  },
  {
    value: "pasban-aisyah",
    label: "Pasban Aisyah",
  },
  {
    value: "pasban-Jetblack-lily",
    label: "Pasban Jetblack Lily",
  },
  {
    value: "abaya-nayla",
    label: "Abaya Nayla",
  }
];