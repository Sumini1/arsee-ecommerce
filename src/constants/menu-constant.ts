export const HEADER_TABLE_MENU = [
  "No",
  "Name",
  "Category",
  "Price",
  "Available",
  "Action",
];

export const CATEGORY_LIST = [
  {
    value: "Pasban Aisyah",
    label: "Khimar",
  },
  {
    value: "abaya-jetblack-lily",
    label: "Abaya  Jetblack Lily",
  },
  {
    value: "khimar-jetblack-lily",
    label: "Khimar Jetblack Lily",
  },
];

export const INITIAL_MENU = {
  name: "",
  description: "",
  price: "",
  discount: "",
  category: "",
  image_url: "",
  is_available: "",
};

export const INITIAL_STATE_MENU = {
  status: "idle",
  errors: {
    name: [],
    description: [],
    price: [],
    discount: [],
    category: [],
    image_url: [],
    is_available: [],
    _form: [],
  },
};

