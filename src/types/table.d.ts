export type TableFormState = {
  status?: string;
  errors?: {
    id?: string[];
    name?: string[];
    description?: string[];
    status?: string[];
    capacity?: string[];
    _form?: string[];
  };
};
