export function convert_object_to_sql_object(obj: any) {
  Object.keys(obj).forEach((p) => {
    const value = obj[p];
    if (!value && value !== 0) {
      // value is either null or 0 undefined
      obj[p] = 'NULL';
    }
  });

  return obj;
}
