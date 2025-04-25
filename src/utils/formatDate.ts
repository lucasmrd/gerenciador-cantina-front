const formatDate = (date: string): string => {
    const dateformat = new Date(date);
  
    const day = dateformat.getDate().toString().padStart(2, '0');
    const month = (dateformat.getMonth() + 1).toString().padStart(2, '0');
    const year = dateformat.getFullYear();
  
    return `${day}/${month}/${year}`;
  };
  
  export default formatDate;